from fastapi import APIRouter, Depends
from app.controllers import admin_controller
from app.core.dependencies import require_admin
from app.models.user_model import UserModel
from app.schemas.user_schema import UserOut

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserOut])
async def get_users(
    _: UserModel = Depends(require_admin),
):
    return await admin_controller.get_users()


@router.get("/reports")
async def get_reports(
    _: UserModel = Depends(require_admin),
):
    return await admin_controller.get_reports()
