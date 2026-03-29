from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.controllers import auth_controller
from app.schemas.auth_schema import RegisterSchema, LoginSchema, TokenResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(register_data: RegisterSchema):
    return await auth_controller.register(register_data)


@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginSchema):
    return await auth_controller.login(login_data)


@router.post("/token", response_model=TokenResponse)
async def get_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        return auth_service.login(form_data.username, form_data.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
