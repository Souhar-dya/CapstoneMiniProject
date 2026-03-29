from pydantic import BaseModel, StrictInt, StrictStr, Field
from enum import Enum

class Role(str, Enum):
    customer = "customer"
    admin = "admin"



class UserCreate(BaseModel):
    name : StrictStr = Field(...,min_length=3)
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    mobile_number : str = Field(...,pattern="^[0-9]{10}$")
    role : Role = Role.customer
    plan_id : str = Field(..., pattern=r"^[a-fA-F0-9]{24}$")

class UserOut(BaseModel):
    id: str
    name: str
    email: str | None = None
    mobile_number: str
    role: Role
    plan_id: str