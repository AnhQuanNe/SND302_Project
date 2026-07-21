from fastapi import FastAPI

from schemas.queue_schema import QueueRequest

from services.ai_service import AIService

app=FastAPI()

service=AIService()


@app.get("/health")

def health():

    return{

        "status":"healthy"

    }


@app.post("/predict")

def predict_queue(data:QueueRequest):

    return service.predict_wait(data)