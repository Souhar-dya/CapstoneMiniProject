from pydantic import BaseModel
from enum import Enum
from datetime import datetime


class BillingStatus(str, Enum):
    pending = "pending"
    paid = "paid"


class BillingModel(BaseModel):
    id: str | None = None
    user_id: str
    billing_cycle: str
    total_amount: float
    status: BillingStatus
    generated_at: datetime