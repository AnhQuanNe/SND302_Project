import os
import joblib
import pandas as pd

from dotenv import load_dotenv
from pymongo import MongoClient

from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

from config import MODEL_PATH, SCALER_PATH

load_dotenv()

# ===========================================
# MongoDB
# ===========================================

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["queue_management"]

collection = db["queuehistories"]

print("===================================")
print("Database :", db.name)
print("Collections :", db.list_collection_names())
print("===================================")

count = collection.count_documents({})

print("QueueHistory Count :", count)

if count == 0:
    raise Exception("QueueHistory is empty!")

# ===========================================
# Load Data
# ===========================================

history = list(collection.find(
    {},
    {
        "_id": 0,
        "currentQueueCount": 1,
        "queueLength": 1,
        "hourOfDay": 1,
        "dayOfWeek": 1,
        "averageServiceTime": 1,
        "staffCount": 1,
        "counterCount": 1,
        "isPeakHour": 1,
        "peakIntensity": 1,
        "actualWaitTime": 1
    }
))

df = pd.DataFrame(history)

if df.empty:
    raise Exception("QueueHistory is empty!")

# ===========================================
# Compatible với DB cũ
# ===========================================

if "currentQueueCount" not in df.columns:
    if "queueLength" in df.columns:
        df["currentQueueCount"] = df["queueLength"]

# ===========================================
# Clean Data
# ===========================================

df = df.fillna(0)

print("\n========== SAMPLE DATA ==========")
print(df.head())

print("\n========== NULL ==========")
print(df.isnull().sum())

# ===========================================
# Feature
# ===========================================

FEATURES = [

    "currentQueueCount",

    "hourOfDay",

    "dayOfWeek",

    "averageServiceTime",

    "staffCount",

    "counterCount",

    "isPeakHour",

    "peakIntensity"

]

TARGET = "actualWaitTime"

X = df[FEATURES]

y = df[TARGET]

# ===========================================
# Train / Test Split
# ===========================================

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.2,

    random_state=42

)

# ===========================================
# Standard Scale
# ===========================================

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)

X_test_scaled = scaler.transform(X_test)

# ===========================================
# Train Model
# ===========================================

model = RandomForestRegressor(

    n_estimators=200,

    random_state=42

)

model.fit(X_train_scaled, y_train)

# ===========================================
# Evaluate
# ===========================================

prediction = model.predict(X_test_scaled)

mae = mean_absolute_error(y_test, prediction)

r2 = r2_score(y_test, prediction)

print("\n===================================")
print("Model Evaluation")
print("===================================")

print("MAE :", round(mae, 2), "minutes")

print("R2  :", round(r2, 4))

# ===========================================
# Feature Importance
# ===========================================

importance = pd.DataFrame({

    "Feature": FEATURES,

    "Importance": model.feature_importances_

})

importance = importance.sort_values(

    by="Importance",

    ascending=False

)

print("\n===================================")
print("Feature Importance")
print("===================================")

print(importance)

# ===========================================
# Save
# ===========================================

joblib.dump(model, MODEL_PATH)

joblib.dump(scaler, SCALER_PATH)

print("\n===================================")
print("AI MODEL TRAINED SUCCESSFULLY")
print("===================================")

print("Total Records :", len(df))

print("Model Saved   :", MODEL_PATH)

print("Scaler Saved  :", SCALER_PATH)

print("===================================")