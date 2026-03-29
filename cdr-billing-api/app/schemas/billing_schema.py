from pydantic import BaseModel
from enum import Enum
from datetime import datetime


class BillingStatus(str, Enum):
    pending = "pending"
    paid = "paid"

class BillingPay(BaseModel):
    pass

class BillingOut(BaseModel):
    id: str
    user_id: str
    billing_cycle: str
    total_amount: float
    status: BillingStatus
    generated_at: datetime