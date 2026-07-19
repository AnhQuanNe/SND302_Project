from pydantic import BaseModel


class QueueRequest(BaseModel):
    serviceId: str
    currentQueueCount: int
    averageServiceTime: float
    staffCount: int
    counterCount: int
    hourOfDay: int
    dayOfWeek: int


class PredictionResponse(BaseModel):
    predictedWaitTime: float
    confidenceScore: float
    isPeakHour: bool
    recommendation: str