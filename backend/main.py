# main.py

from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# импортируем роутер из нашего модуля
from routers.auth_router import auth_router, get_current_user

app = FastAPI()

# подключаем CORS, чтобы фронтенд на другом порту мог делать запросы
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.1.10:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# регистрируем роутер с префиксом /auth
app.include_router(auth_router, prefix="/auth", tags=["auth"])

# пример защищённого эндпоинта
@app.get("/protected")
async def protected_route(user=Depends(get_current_user)):
    """
    Здесь мы проверяем сессию пользователя через Depends(get_current_user).
    Если сессия валидна, возвращаем приветствие, иначе — ошибка 401.
    """
    return {"message": f"Привет, {user['username']}! Вы вошли в систему."}


if __name__ == "__main__":
    # запускаем uvicorn-сервер
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
