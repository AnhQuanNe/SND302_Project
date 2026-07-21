import os
import joblib
import pandas as pd

from dotenv import load_dotenv
from pymongo import MongoClient

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from config import MODEL_PATH

load_dotenv()

# ===========================================
# MongoDB
# ===========================================

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("Missing MONGO_URI environment variable")

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

history = list(
    collection.find(
        {},
        {
            "_id": 0,
            "serviceId": 1,
            "currentQueueCount": 1,
            "queueLength": 1,
            "hourOfDay": 1,
            "dayOfWeek": 1,
            "averageServiceTime": 1,
            "staffCount": 1,
            "counterCount": 1,
            "isPeakHour": 1,
            "peakIntensity": 1,
            "actualWaitTime": 1,
        },
    )
)

df = pd.DataFrame(history)

if df.empty:
    raise Exception("QueueHistory is empty!")

# ===========================================
# Compatible với DB cũ
# ===========================================

if "currentQueueCount" not in df.columns:
    if "queueLength" in df.columns:
        df["currentQueueCount"] = df["queueLength"]

# Nếu một số document thiếu currentQueueCount
if "queueLength" in df.columns:
    df["currentQueueCount"] = df["currentQueueCount"].fillna(
        df["queueLength"]
    )

# ===========================================
# Convert serviceId
# ===========================================

if "serviceId" not in df.columns:
    raise Exception(
        "QueueHistory does not contain serviceId. "
        "You must save serviceId in queuehistories."
    )

df["serviceId"] = df["serviceId"].astype(str)


print("\n========== SERVICE ID DEBUG ==========")
print(df["serviceId"].head(20))
print("Unique serviceId:", df["serviceId"].nunique())
print(df["serviceId"].value_counts().head(20))
# ===========================================
# Clean Data
# ===========================================

NUMERIC_FEATURES = [
    "currentQueueCount",
    "hourOfDay",
    "dayOfWeek",
    "averageServiceTime",
    "staffCount",
    "counterCount",
    "isPeakHour",
    "peakIntensity",
]

CATEGORICAL_FEATURES = [
    "serviceId",
]

TARGET = "actualWaitTime"

required_columns = (
    NUMERIC_FEATURES
    + CATEGORICAL_FEATURES
    + [TARGET]
)

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise Exception(
        f"Missing columns: {missing_columns}"
    )

for column in NUMERIC_FEATURES + [TARGET]:
    df[column] = pd.to_numeric(
        df[column],
        errors="coerce",
    )

df[NUMERIC_FEATURES] = df[NUMERIC_FEATURES].fillna(0)

df = df.dropna(subset=[TARGET, "serviceId"])

if df.empty:
    raise Exception("No valid training records after cleaning!")

print("\n========== SAMPLE DATA ==========")
print(df.head())

print("\n========== SERVICE COUNTS ==========")
print(df["serviceId"].value_counts())

# ===========================================
# Feature
# ===========================================

FEATURES = CATEGORICAL_FEATURES + NUMERIC_FEATURES

X = df[FEATURES]
y = df[TARGET]

# ===========================================
# Train / Test Split
# ===========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

# ===========================================
# Preprocessing
# ===========================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "numeric",
            StandardScaler(),
            NUMERIC_FEATURES,
        ),
        (
            "service",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            CATEGORICAL_FEATURES,
        ),
    ]
)

# ===========================================
# Pipeline
# ===========================================

pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor,
        ),
        (
            "model",
            RandomForestRegressor(
                n_estimators=200,
                random_state=42,
            ),
        ),
    ]
)

# ===========================================
# Train
# ===========================================

pipeline.fit(X_train, y_train)

# ===========================================
# Evaluate
# ===========================================

prediction = pipeline.predict(X_test)

mae = mean_absolute_error(
    y_test,
    prediction,
)

r2 = r2_score(
    y_test,
    prediction,
)

print("\n===================================")
print("Model Evaluation")
print("===================================")

print("MAE :", round(mae, 2), "minutes")
print("R2  :", round(r2, 4))

# ===========================================
# Save Pipeline
# ===========================================

joblib.dump(pipeline, MODEL_PATH)

print("\n===================================")
print("AI MODEL TRAINED SUCCESSFULLY")
print("===================================")

print("Total Records :", len(df))
print("Services      :", df["serviceId"].nunique())
print("Model Saved   :", MODEL_PATH)

print("===================================")