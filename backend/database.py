from motor.motor_asyncio import AsyncIOMotorClient



MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client["Vortex"]
sessions_collection = db["sessions"]
users_collection = db["users"]