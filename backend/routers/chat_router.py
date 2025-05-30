from fastapi import APIRouter, Cookie, HTTPException, Request
from database import get_user_chats, get_user_info_by_session

chat_router = APIRouter()


@chat_router.get('/chats/get')
async def get_chats(request: Request):
    session_id = request.cookies.get('session_id')
    print('session ',session_id)
    if not session_id:
        raise HTTPException(status_code=401, detail='Unauthorazed')
    try:
        username = await get_user_info_by_session(session_id)
        chats = await get_user_chats(username[1])
        print(chats)
        return {"chats": chats}
    except Exception as e:
        print(e)