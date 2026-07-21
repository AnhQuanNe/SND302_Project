import numpy as np

from utils.peak_hour import is_peak_hour
from utils.peak_hour import peak_intensity


def create_feature(data):

    return np.array([[
        data.currentQueueCount,
        data.hourOfDay,
        data.dayOfWeek,
        data.averageServiceTime,
        data.staffCount,
        data.counterCount,
        int(is_peak_hour(data.hourOfDay,data.dayOfWeek)),
        peak_intensity(data.hourOfDay,data.dayOfWeek)
    ]])