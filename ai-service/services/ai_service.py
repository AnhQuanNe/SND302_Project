from predict import predict
from predict import load_model

from services.feature_engineering import create_feature

from utils.peak_hour import is_peak_hour


class AIService:

    def __init__(self):
        load_model()

    def predict_wait(self, data):
        feature = create_feature(data)

        print(
            "PREDICTION INPUT:",
            feature.to_dict(orient="records")
        )

        wait = predict(feature)

        recommendation = "Normal"

        if wait > 20:
            recommendation = "Open more counters"

        return {
            "predictedWaitTime": round(wait, 2),

            "confidenceScore": 0.92,

            "isPeakHour": is_peak_hour(
                data.hourOfDay,
                data.dayOfWeek
            ),

            "recommendation": recommendation
        }