from fastapi import HTTPException
from app.services import auth_service
from app.schemas.auth_schema import RegisterSchema, LoginSchema


async def register(register_data: RegisterSchema):
    try:
        result = auth_service.register(register_data)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


async def login(login_data: LoginSchema):
    try:
        result = auth_service.login(login_data.email, login_data.password)
        return result
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
