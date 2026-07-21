from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

MODEL_DIR = BASE_DIR / "models"

DATA_DIR = BASE_DIR / "data"

MODEL_PATH = MODEL_DIR / "queue_model.pkl"

SCALER_PATH = MODEL_DIR / "scaler.pkl"