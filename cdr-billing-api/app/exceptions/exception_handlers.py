from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.exceptions.custom_exceptions import (
    UserNotFound, UserAlreadyExists, InvalidCredentials,
    UnauthorizedAccess, PlanNotFound, BillingNotFound, 
    CDRNotFound, ValidationError
)


def register_exception_handlers(app: FastAPI):
    @app.exception_handler(UserNotFound)
    async def user_not_found_handler(request: Request, exc: UserNotFound):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(UserAlreadyExists)
    async def user_already_exists_handler(request: Request, exc: UserAlreadyExists):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(InvalidCredentials)
    async def invalid_credentials_handler(request: Request, exc: InvalidCredentials):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(UnauthorizedAccess)
    async def unauthorized_access_handler(request: Request, exc: UnauthorizedAccess):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(PlanNotFound)
    async def plan_not_found_handler(request: Request, exc: PlanNotFound):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(BillingNotFound)
    async def billing_not_found_handler(request: Request, exc: BillingNotFound):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(CDRNotFound)
    async def cdr_not_found_handler(request: Request, exc: CDRNotFound):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

    @app.exception_handler(ValidationError)
    async def validation_error_handler(request: Request, exc: ValidationError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )
