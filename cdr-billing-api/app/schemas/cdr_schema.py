from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional
from datetime import datetime


class CDRType(str, Enum):
    call = "call"
    sms = "sms"
    data = "data"


class CDRCreate(BaseModel):
    user_id: str = Field(..., pattern=r"^[a-fA-F0-9]{24}$")

    type: CDRType

    duration: Optional[int] = Field(None, ge=0)
    data_used: Optional[float] = Field(None, ge=0)

    destination_number: Optional[str] = Field(
        None, pattern="^[0-9]{10}$"
    )

    timestamp: Optional[datetime] = None


class CDROut(BaseModel):
    id: str
    user_id: str
    type: CDRType
    duration: Optional[int]
    data_used: Optional[float]
    destination_number: Optional[str]
    timestamp: datetime