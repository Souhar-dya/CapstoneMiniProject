from pydantic import BaseModel


class PlanModel(BaseModel):
    id: str | None = None
    name: str
    call_rate: float
    sms_rate: float
    data_rate: float