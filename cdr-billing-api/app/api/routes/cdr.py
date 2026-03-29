from fastapi import APIRouter, Depends, Path
from app.controllers import cdr_controller
from app.core.dependencies import require_admin, require_customer
from app.models.user_model import UserModel
from app.schemas.cdr_schema import CDRCreate, CDROut

router = APIRouter(prefix="/cdr", tags=["cdr"])


@router.post("", response_model=CDROut)
async def add_cdr(
    cdr_data: CDRCreate,
    _: UserModel = Depends(require_admin),
):
    return await cdr_controller.add_cdr(cdr_data)


@router.get("/my", response_model=list[CDROut])
async def get_my_cdr(
    current_user: UserModel = Depends(require_customer),
):
    return await cdr_controller.get_user_cdr(current_user.id)


@router.get("/summary/my")
async def my_cdr_summary(
    current_user: UserModel = Depends(require_customer),
):
    return await cdr_controller.get_cdr_summary(current_user.id)


@router.get("/summary/{user_id}")
async def cdr_summary(
    user_id: str = Path(..., pattern=r"^[a-fA-F0-9]{24}$"),
    _: UserModel = Depends(require_admin),
):
    return await cdr_controller.get_cdr_summary(user_id)
