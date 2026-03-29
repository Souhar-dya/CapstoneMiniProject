from pydantic import BaseModel
from enum import Enum
from typing import Optional
from datetime import datetime


class CDRType(str, Enum):
    call = "call"
    sms = "sms"
    data = "data"


class CDRModel(BaseModel):
    id: str | None = None
    user_id: str
    type: CDRType
    duration: Optional[int]
    data_used: Optional[float]
    destination_number: Optional[str]
    timestamp: datetime