from fastapi import APIRouter, Depends, Path
from app.controllers import cdr_controller
from app.core.dependencies import require_admin, require_customer, require_customer_or_admin
from app.models.user_model import UserModel, Role
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
    current_user: UserModel = Depends(require_customer_or_admin),
):
    # Admins can see all CDR, customers see only their own
    if current_user.role == Role.admin:
        return await cdr_controller.get_all_cdr()
    return await cdr_controller.get_user_cdr(current_user.id)


@router.get("/user/{user_id}", response_model=list[CDROut])
async def get_user_cdr(
    user_id: str = Path(..., pattern=r"^[a-fA-F0-9]{24}$"),
    current_user: UserModel = Depends(require_admin),
):
    """
    Admin-only endpoint to get CDR records for a specific user.
    Useful for viewing usage details or generating reports.
    """
    return await cdr_controller.get_user_cdr(user_id)



@router.get("/summary/my")
async def my_cdr_summary(
    current_user: UserModel = Depends(require_customer_or_admin),
):
    return await cdr_controller.get_cdr_summary(current_user.id)


@router.get("/summary/{user_id}")
async def cdr_summary(
    user_id: str = Path(..., pattern=r"^[a-fA-F0-9]{24}$"),
    _: UserModel = Depends(require_admin),
):
    return await cdr_controller.get_cdr_summary(user_id)
