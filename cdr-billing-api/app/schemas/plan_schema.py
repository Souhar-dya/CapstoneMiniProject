


from pydantic import BaseModel, Field

class PlanCreate(BaseModel):
    name: str = Field(..., min_length=3)
    call_rate: float = Field(..., gt=0)
    sms_rate: float = Field(..., gt=0)
    data_rate: float = Field(..., gt=0)

class PlanOut(BaseModel):
    id: str
    name: str
    call_rate: float
    sms_rate: float
    data_rate: float