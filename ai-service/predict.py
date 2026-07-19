import joblib

from config import MODEL_PATH
from config import SCALER_PATH

model = None
scaler = None


def load_model():

    global model
    global scaler

    model = joblib.load(MODEL_PATH)

    scaler = joblib.load(SCALER_PATH)


def predict(feature):

    x = scaler.transform(feature)

    result = model.predict(x)

    return float(result[0])