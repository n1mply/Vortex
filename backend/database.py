import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import re
from datetime import datetime
import pytz
from pydantic import BaseModel

MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client["Vortex"]
sessions_collection = db["sessions"]
users_collection = db["users"]
message_collection = db["messages"]


class Message(BaseModel):
    sender: str
    receiver: str
    text: str
    timestamp: datetime = None


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


async def get_user_info_by_session(cookie: str):
    try:
        session = await sessions_collection.find_one({"_id": cookie})
        
        if not session:
            return None, None
        user_id = session.get("user_id")
        if not user_id:
            return None, None
        user = await users_collection.find_one({"_id": user_id})
        
        if not user:
            return None, None
        print(str(user["_id"]), user.get("username"))
        return str(user["_id"]), user.get("username")
        
    except Exception as e:
        print(f"Error in get_user_info_by_session: {e}")
        return None, None
    

async def get_username_by_id(id: str):
    try:
        user = await users_collection.find_one({"_id": ObjectId(str(id))})
        
        if not user:
            return None
        return user.get("username")
        
    except Exception as e:
        print(f"Error in get_user_by_id: {e}")
        return None


async def create_message_indexes():
    await message_collection.create_index([("sender", 1), ("receiver", 1)])
    await message_collection.create_index([("receiver", 1), ("sender", 1)])
    await message_collection.create_index("timestamp")
    await message_collection.create_index([
        ("sender", 1),
        ("receiver", 1),
        ("timestamp", 1)
    ], name="chat_history_idx")

async def save_message(sender: str, receiver: str, text: str):  
    tz = pytz.timezone("Europe/Moscow")  
    current_time = datetime.now(tz)  # Получаем текущее время с учётом пояса
    
    message = Message(
        sender=sender,
        receiver=receiver,
        text=text,
        timestamp=current_time  # Сохраняем время с поясом
    )
    
    result = await message_collection.insert_one(message.dict())
    saved_msg = message.dict()
    saved_msg['timestamp'] = saved_msg['timestamp'].isoformat()
    saved_msg['id'] = str(result.inserted_id)
    return saved_msg

async def get_messages_between_users(user1: str, user2: str, limit: int = 100):
    cursor = message_collection.find({
        "$or": [
            {"sender": user1, "receiver": user2},
            {"sender": user2, "receiver": user1}
        ]
    }).sort("timestamp", 1).limit(limit)
    messages = []
    async for msg in cursor:
        msg['_id'] = str(msg['_id'])
        msg['timestamp'] = msg['timestamp'].isoformat()
        messages.append(msg)
    return messages

async def get_user_messages(username: str, limit: int = 100):
    cursor = message_collection.find({
        "$or": [{"sender": username}, {"receiver": username}]
    }).sort("timestamp", 1).limit(limit)
    return await cursor.to_list(length=limit)

async def get_last_messages(username: str, limit: int = 10):
    cursor = message_collection.find({
        "$or": [{"sender": username}, {"receiver": username}]
    }).sort("timestamp", -1).limit(limit)
    return await cursor.to_list(length=limit)


async def get_user_chats(username: str) -> list[dict]:
    pipeline = [
        {
            "$match": {
                "$or": [
                    {"sender": username},
                    {"receiver": username}
                ]
            }
        },
        {
            "$sort": {"timestamp": -1}
        },
        {
            "$group": {
                "_id": {
                    "$cond": [
                        {"$eq": ["$sender", username]},
                        "$receiver",
                        "$sender"
                    ]
                },
                "last_message": {"$first": "$text"},
                "last_time": {"$first": "$timestamp"},
                "is_my_last_message": {
                    "$first": {
                        "$eq": ["$sender", username]
                    }
                }
            }
        },
        {
            "$lookup": {
                "from": "users",  # предполагается, что коллекция пользователей называется "users"
                "localField": "_id",
                "foreignField": "username",
                "as": "user_data"
            }
        },
        {
            "$unwind": "$user_data"  # разворачиваем массив с данными пользователя
        },
        {
            "$project": {
                "username": "$_id",
                "last_message": 1,
                "last_time": 1,
                "is_my_last_message": 1,
                "user_id": "$user_data._id",  # добавляем ObjectId пользователя
                "_id": 0
            }
        },
        {
            "$sort": {"last_time": -1}
        }
    ]
    
    chats = await message_collection.aggregate(pipeline).to_list(None)
    
    # Конвертируем datetime в строку и ObjectId в str
    for chat in chats:
        chat["last_time"] = chat["last_time"].isoformat()
        chat["user_id"] = str(chat["user_id"])  # конвертируем ObjectId в строку
    
    return chats