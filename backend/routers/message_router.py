from fastapi import APIRouter, Cookie, HTTPException
from database import get_messages_between_users, get_user_info_by_session

msg_router = APIRouter()

@msg_router.get("/messages/{other_user}")
async def get_chat_history(
    other_user: str, 
    session_id: str = Cookie(None)
):
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        current_user = await get_user_info_by_session(session_id)
        chat_history = await get_messages_between_users(current_user[1], other_user)
        return {'history': chat_history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

