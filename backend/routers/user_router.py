from fastapi import APIRouter, HTTPException
from database import search_users_by_username

user_router = APIRouter()


@user_router.get('/user/search/{username}')
async def search_user(username: str):
    try:
        if len(username) < 3:
            raise HTTPException(
                status_code=400,
                detail="Search query must be at least 3 characters long"
            )
            
        db_users = await search_users_by_username(username)
        users = [
            {"id": str(user["_id"]), "username": user["username"]}
            for user in db_users
        ]
        return {"users": users}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while searching for users: {str(e)}"
        )