import os
from motor.motor_asyncio import AsyncIOMotorClient # type: ignore
from dotenv import load_dotenv # type: ignore

load_dotenv()

class Database:
    def __init__(self):
        self.MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        self.DATABASE_NAME = "portfolio"
        self.client = None
        self.database = None
    
    async def connect(self):
        self.client = AsyncIOMotorClient(self.MONGODB_URL)
        self.database = self.client[self.DATABASE_NAME]
        print("Connected to MongoDB")
    
    async def disconnect(self):
        if self.client is not None:
            self.client.close()
            print("Disconnected from MongoDB")
    
    def get_collection(self, collection_name):
        if self.database is not None:
            return self.database[collection_name]
        raise Exception("Database not connected")

# Create global database instance
db = Database()