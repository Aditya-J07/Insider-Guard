import uuid
from datetime import datetime
import os

class MockCollection:
    def __init__(self):
        self.data = []

    async def create_index(self, *args, **kwargs):
        pass

    async def update_many(self, filter_doc, update_doc):
        set_ops = update_doc.get("$set", {})
        count = 0
        for doc in self.data:
            match = all(doc.get(k) == filter_doc.get(k) for k in filter_doc)
            if match:
                for k, v in set_ops.items():
                    doc[k] = v
                count += 1
        return count

    async def insert_one(self, doc):
        if "_id" not in doc:
            doc["_id"] = str(uuid.uuid4())
        self.data.append(doc)
        return doc

    async def find_one(self, filter_doc):
        for doc in self.data:
            match = all(doc.get(k) == filter_doc.get(k) for k in filter_doc)
            if match:
                return doc
        return None

    def find(self):
        class AsyncCursor:
            def __init__(self, data):
                self.data = list(data)
                self.index = 0
            def __aiter__(self):
                return self
            async def __anext__(self):
                if self.index < len(self.data):
                    val = self.data[self.index]
                    self.index += 1
                    return val
                else:
                    raise StopAsyncIteration
        
        sorted_data = sorted(self.data, key=lambda x: x.get("timestamp", datetime.min) if isinstance(x.get("timestamp"), datetime) else datetime.min, reverse=True)
        return AsyncCursor(sorted_data)

log_collection = MockCollection()
session_collection = MockCollection()

async def init_db():
    print("[*] Using IN-MEMORY Mock Database (No external DB required)")

# Helper to format Database documents for the API
def log_helper(log) -> dict:
    return {
        "id": str(log.get("_id", uuid.uuid4())),
        "username": log.get("username"),
        "action": log.get("action"),
        "resource": log.get("resource"),
        "ip_address": log.get("ip_address"),
        "risk_score": log.get("risk_score"),
        "timestamp": log.get("timestamp")
    }