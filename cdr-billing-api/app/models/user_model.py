from pydantic import BaseModel
from enum import Enum


class Role(str, Enum):
    customer = "customer"
    admin = "admin"


class UserModel(BaseModel):
    id: str | None = None
    name: str
    email: str | None = None
    mobile_number: str
    password: str
    role: Role
    plan_id: str