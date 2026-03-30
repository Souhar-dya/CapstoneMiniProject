from fastapi import APIRouter
from app.controllers import auth_controller
from app.schemas.auth_schema import RegisterSchema, LoginSchema, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(register_data: RegisterSchema):
    return await auth_controller.register(register_data)


@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginSchema):
    return await auth_controller.login(login_data)
