from fastapi import APIRouter, HTTPException, Cookie, WebSocket, WebSocketDisconnect, WebSocketException
from fastapi.websockets import WebSocketState
from database import (
    get_user_info_by_session, 
    save_message, 
    set_user_online, 
    set_user_offline, 
    get_user_status,
    get_multiple_users_status
)

ws_router = APIRouter()

active_connections = {}

async def broadcast_status_update(username: str, status_data: dict):
    """Отправляет обновление статуса всем активным соединениям"""
    for user, websocket in active_connections.items():
        try:
            await websocket.send_json({
                "type": "status_update",
                "username": username,
                "status": status_data["status"],
                "last_seen": status_data.get("last_seen")
            })
        except Exception as e:
            print(f"Error broadcasting status to {user}: {e}")

@ws_router.websocket("/ws")
async def websocket_chats(websocket: WebSocket, session_id: str = Cookie(None)):
    await websocket.accept()
    print(active_connections)
    
    if not session_id:
        await websocket.close(code=1008, reason="Not authenticated")
        return

    user_info = None
    try:
        user_info = await get_user_info_by_session(session_id)
        if not user_info[1]:
            await websocket.close(code=1008, reason="Invalid session")
            return
            
        username = user_info[1]
        active_connections[username] = websocket
        
        # Устанавливаем пользователя в статус online
        await set_user_online(username)
        
        # Уведомляем всех о том, что пользователь онлайн
        status_data = await get_user_status(username)
        if status_data:
            await broadcast_status_update(username, status_data)
        
        while True:
            data = await websocket.receive_json()
            message_type = data.get("type", "message")
            
            if message_type == "message":
                # Обработка сообщений
                if "receiver" not in data or "text" not in data:
                    continue

                receiver = data["receiver"]
                text = data["text"]
                saved_msg = await save_message(username, receiver, text)

                # Обновляем чаты для отправителя и получателя
                for user in [username, receiver]:
                    if user in active_connections:
                        await active_connections[user].send_json({
                            "type": "chats_updated"
                        })

                # Отправляем сообщение получателю
                if receiver in active_connections:
                    await active_connections[receiver].send_json({
                        "type": "new_message",
                        "message": saved_msg
                    })

                # Подтверждаем отправку отправителю
                await websocket.send_json({
                    "type": "new_message",
                    "message": saved_msg
                })
                
            elif message_type == "get_status":
                # Запрос статуса конкретного пользователя
                target_username = data.get("username")
                if target_username:
                    status_data = await get_user_status(target_username)
                    if status_data:
                        await websocket.send_json({
                            "type": "status_response",
                            "username": target_username,
                            "status": status_data["status"],
                            "last_seen": status_data.get("last_seen")
                        })
                        
            elif message_type == "get_multiple_status":
                # Запрос статусов нескольких пользователей
                usernames = data.get("usernames", [])
                if usernames:
                    statuses = await get_multiple_users_status(usernames)
                    await websocket.send_json({
                        "type": "multiple_status_response",
                        "statuses": statuses
                    })

    except WebSocketDisconnect:
        if user_info and user_info[1] in active_connections:
            username = user_info[1]
            del active_connections[username]
            
            # Устанавливаем пользователя в статус offline
            await set_user_offline(username)
            
            # Уведомляем всех о том, что пользователь офлайн
            status_data = await get_user_status(username)
            if status_data:
                await broadcast_status_update(username, status_data)
                
    except Exception as e:
        print(f"WebSocket error: {e}")
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close(code=1011)
        
        # В случае ошибки также устанавливаем пользователя офлайн
        if user_info and user_info[1]:
            username = user_info[1]
            if username in active_connections:
                del active_connections[username]
            await set_user_offline(username)
            
            status_data = await get_user_status(username)
            if status_data:
                await broadcast_status_update(username, status_data)