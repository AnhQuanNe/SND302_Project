import os
import joblib
import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient

from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

from config import MODEL_PATH, SCALER_PATH

load_dotenv()

# ==========================
# Connect MongoDB
# ==========================

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
print("Databases:")
print(client.list_database_names())

# Nếu tên database của bạn khác thì sửa lại
db = client["queue_management"]

# Nếu collection tên khác thì sửa lại
collection = db["queuehistories"]
print("Current DB:", db.name)
print("Collections:", db.list_collection_names())
count = collection.count_documents({})

print("QueueHistory Count:", count)

doc = collection.find_one()

print("First Document:", doc)

if count == 0:
    raise Exception("QueueHistory is empty!")

# ==========================
# Load Data
# ==========================

history = list(collection.find({}, {
    "_id": 0,
    "queueLength": 1,
    "hourOfDay": 1,
    "dayOfWeek": 1,
    "averageServiceTime": 1,
    "staffCount": 1,
    "counterCount": 1,
    "isPeakHour": 1,
    "peakIntensity": 1,
    "actualWaitTime": 1
}))

if len(history) == 0:
    raise Exception("QueueHistory is empty!")

df = pd.DataFrame(history)

print(df.head())

# ==========================
# Prepare Feature
# ==========================

X = df[
    [
        "queueLength",
        "hourOfDay",
        "dayOfWeek",
        "averageServiceTime",
        "staffCount",
        "counterCount",
        "isPeakHour",
        "peakIntensity",
    ]
]

y = df["actualWaitTime"]

# ==========================
# Train
# ==========================

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_scaled, y)

# ==========================
# Save Model
# ==========================

joblib.dump(model, MODEL_PATH)

joblib.dump(scaler, SCALER_PATH)

print("===================================")
print("AI Model Trained Successfully")
print("Total Records:", len(df))
print("Model:", MODEL_PATH)
print("===================================")
print("Database:", db.name)
print("Collections:", db.list_collection_names())

count = collection.count_documents({})
print("QueueHistory Count:", count)