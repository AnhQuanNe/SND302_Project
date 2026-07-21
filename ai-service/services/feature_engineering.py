import pandas as pd

from utils.peak_hour import is_peak_hour
from utils.peak_hour import peak_intensity


def create_feature(data):
    return pd.DataFrame([
        {
            "serviceId": str(data.serviceId),

            "currentQueueCount": data.currentQueueCount,

            "hourOfDay": data.hourOfDay,

            "dayOfWeek": data.dayOfWeek,

            "averageServiceTime": data.averageServiceTime,

            "staffCount": data.staffCount,

            "counterCount": data.counterCount,

            "isPeakHour": int(
                is_peak_hour(
                    data.hourOfDay,
                    data.dayOfWeek
                )
            ),

            "peakIntensity": peak_intensity(
                data.hourOfDay,
                data.dayOfWeek
            )
        }
    ])