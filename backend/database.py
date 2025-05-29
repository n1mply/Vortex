from motor.motor_asyncio import AsyncIOMotorClient
import re

MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client["Vortex"]
sessions_collection = db["sessions"]
users_collection = db["users"]


async def search_users_by_username(username: str, threshold: float = 0.4):
    if not username:
        return []
    
    escaped_username = re.escape(username)
    pattern = re.compile(f'^{escaped_username}', re.IGNORECASE)
    users = await users_collection.find({
        "username": {"$regex": pattern}
    }).to_list(length=None)

    if users:
        return users

    all_users = await users_collection.find({}).to_list(length=None)
    
    similar_users = []
    for user in all_users:
        user_username = user.get("username", "")
        if not user_username:
            continue

        similarity = calculate_similarity(username.lower(), user_username.lower())
        if similarity >= threshold:
            similar_users.append(user)

    similar_users.sort(
        key=lambda x: calculate_similarity(username.lower(), x["username"].lower()),
        reverse=True
    )
    
    return similar_users


def calculate_similarity(s1: str, s2: str) -> float:
    set1 = set(s1)
    set2 = set(s2)
    intersection = set1 & set2
    union = set1 | set2
    
    if not union:
        return 0.0
    
    return len(intersection) / len(union)