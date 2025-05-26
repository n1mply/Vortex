# routers/auth_router.py

import uuid
from datetime import datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, EmailStr
from annotated_types import MinLen, MaxLen

from passlib.context import CryptContext

from database import users_collection, sessions_collection

# создаём APIRouter
auth_router = APIRouter()

# для хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Параметры сессии
SESSION_COOKIE = "session_id"
SESSION_EXPIRE_MINUTES = 60 * 24  # 1 день

# Pydantic-модели для входа и регистрации
class RegisterModel(BaseModel):
    username: Annotated[str, MinLen(3), MaxLen(16)]
    mail: EmailStr
    password: Annotated[str, MinLen(8), MaxLen(100)]

class LoginModel(BaseModel):
    username: Annotated[str, MinLen(3), MaxLen(16)]
    password: Annotated[str, MinLen(8), MaxLen(100)]

async def get_current_user(request: Request):
    """
    Dependency для проверки сессии:
    - считываем cookie,
    - проверяем наличие в БД,
    - проверяем срок жизни,
    - возвращаем объект пользователя.
    """
    session_id = request.cookies.get(SESSION_COOKIE)
    if not session_id:
        raise HTTPException(status_code=401, detail="Не авторизован")

    session = await sessions_collection.find_one({"_id": session_id})
    if not session:
        raise HTTPException(status_code=401, detail="Сессия не найдена")

    # проверяем, не истёк ли срок сессии
    if session["expires_at"] < datetime.utcnow():
        # удаляем просроченную сессию
        await sessions_collection.delete_one({"_id": session_id})
        raise HTTPException(status_code=401, detail="Сессия истекла")

    # возвращаем данные пользователя (можно расширить)
    user = await users_collection.find_one(
        {"_id": session["user_id"]},
        {"password": 0},  # не отдаём хеш пароля
    )
    return user

@auth_router.post("/register")
async def register(data: RegisterModel):
    """
    Регистрация нового пользователя:
    - проверяем, что логин и e-mail ещё не заняты,
    - хешируем пароль,
    - сохраняем в коллекцию users.
    """
    # проверка уникальности username
    if await users_collection.find_one({"username": data.username}):
        raise HTTPException(status_code=400, detail="Имя пользователя занято")

    # проверка уникальности mail
    if await users_collection.find_one({"mail": data.mail}):
        raise HTTPException(status_code=400, detail="E-mail уже используется")

    # создаём документ пользователя
    user_doc = {
        "username": data.username,
        "mail": data.mail,
        # хешируем пароль перед сохранением
        "password": pwd_context.hash(data.password),
        "created_at": datetime.utcnow(),
    }
    result = await users_collection.insert_one(user_doc)

    return {"message": "Пользователь создан", "user_id": str(result.inserted_id)}

@auth_router.post("/login")
async def login(data: LoginModel, response: Response):
    """
    Вход пользователя:
    - ищем пользователя по username,
    - проверяем пароль,
    - генерируем session_id и сохраняем в БД sessions,
    - устанавливаем cookie с session_id.
    """
    # ищем пользователя
    user = await users_collection.find_one({"username": data.username})
    if not user or not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Неверные учётные данные")

    # создаём сессию
    session_id = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(minutes=SESSION_EXPIRE_MINUTES)
    session_doc = {
        "_id": session_id,
        "user_id": user["_id"],
        "created_at": datetime.utcnow(),
        "expires_at": expires_at,
    }
    await sessions_collection.insert_one(session_doc)

    # ставим cookie
    response.set_cookie(
        key=SESSION_COOKIE,
        value=session_id,
        httponly=True,
        expires=SESSION_EXPIRE_MINUTES * 60,
    )

    return {"message": "Успешный вход"}

@auth_router.post("/logout")
async def logout(request: Request, response: Response):
    """
    Выход из системы:
    - удаляем сессию из БД,
    - сбрасываем cookie.
    """
    session_id = request.cookies.get(SESSION_COOKIE)
    if session_id:
        # удаляем из БД
        await sessions_collection.delete_one({"_id": session_id})
        # очищаем cookie на клиенте
        response.delete_cookie(SESSION_COOKIE)

    return {"message": "Вы вышли из системы"}
