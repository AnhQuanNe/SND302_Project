import joblib

from config import MODEL_PATH


model = None


def load_model():
    global model

    model = joblib.load(MODEL_PATH)

    print("AI model loaded successfully")


def predict(feature):
    global model

    if model is None:
        load_model()

    result = model.predict(feature)

    return float(result[0])