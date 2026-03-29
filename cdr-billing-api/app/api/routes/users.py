from fastapi import APIRouter, Depends, Path
from app.controllers import user_controller
from app.core.dependencies import get_current_user, ensure_self_or_admin, require_admin
from app.models.user_model import UserModel
from app.schemas.user_schema import UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserOut])
async def list_users(
    _: UserModel = Depends(require_admin),
):
    return await user_controller.get_all_users()


@router.get("/{user_id}", response_model=UserOut)
async def get_user(
    user_id: str = Path(..., pattern=r"^[a-fA-F0-9]{24}$"),
    current_user: UserModel = Depends(get_current_user),
):
    ensure_self_or_admin(user_id, current_user)
    return await user_controller.get_user(user_id)
