from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


from database import create_message_indexes
from routers.auth_router import auth_router, get_current_user
from routers.websocket_router import ws_router
from routers.user_router import user_router
from routers.message_router import msg_router
from routers.chat_router import chat_router

app = FastAPI()
@app.on_event('startup')
async def on_startup():
    await create_message_indexes()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.1.10:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, tags=["auth"])
app.include_router(ws_router, tags=["websocket"])
app.include_router(user_router, tags=["user"])
app.include_router(msg_router, tags=["message"])
app.include_router(chat_router, tags=["chat"])

@app.get("/protected")
async def protected_route(user=Depends(get_current_user)):
    if not user['username']:
        raise HTTPException(status_code=401, detail='Unauthoraized')
    else:
        return {"username": user['username']}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
