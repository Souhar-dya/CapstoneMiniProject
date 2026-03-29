from pydantic import BaseModel, Field


class RegisterSchema(BaseModel):
    name: str = Field(..., min_length=3)
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    mobile_number: str = Field(..., pattern="^[0-9]{10}$")
    password: str = Field(..., min_length=6)
    plan_id: str = Field(..., pattern=r"^[a-fA-F0-9]{24}$")


class LoginSchema(BaseModel):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(..., min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"