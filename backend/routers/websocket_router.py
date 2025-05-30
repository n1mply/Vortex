from fastapi import APIRouter, HTTPException, Cookie, WebSocket, WebSocketDisconnect, WebSocketException
from fastapi.websockets import WebSocketState
from database import get_user_info_by_session, save_message

ws_router = APIRouter()

active_connections = {}

@ws_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, session_id: str = Cookie(None)):
    await websocket.accept()
    print(active_connections)
    if not session_id:
        await websocket.close(code=1008, reason="Not authenticated")
        return
    
    try:
        user_info = await get_user_info_by_session(session_id)
        print('session: ',session_id)
        print('user: ',user_info[1])
        print('connections: ',active_connections)
        active_connections[user_info[1]] = websocket
        while True:
            data = await websocket.receive_json()
            if "receiver" not in data or "text" not in data:
                continue

            receiver = data["receiver"]
            text = data["text"]
            saved_msg = await save_message(user_info[1], receiver, text)

            for user in [user_info[1], receiver]:
                if user in active_connections:
                    await active_connections[user].send_json({
                        "type": "chats_updated"
                    })

            if receiver in active_connections:
                await active_connections[receiver].send_json({
                    "type": "new_message",
                    "message": saved_msg
                })
                
            await websocket.send_json({
                "type": "new_message",
                "message": saved_msg
            })


    except WebSocketDisconnect:
        if user_info[1] in active_connections:
            del active_connections[user_info[1]]
    except Exception as e:
        print(f"WebSocket error: {e}")
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close(code=1011)
            