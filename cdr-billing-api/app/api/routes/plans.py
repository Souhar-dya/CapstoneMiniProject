from fastapi import APIRouter, Depends, Path
from app.controllers import plan_controller
from app.core.dependencies import require_admin
from app.models.user_model import UserModel
from app.schemas.plan_schema import PlanCreate, PlanOut

router = APIRouter(prefix="/plans", tags=["plans"])


@router.get("", response_model=list[PlanOut])
async def get_plans():
    return await plan_controller.get_all_plans()


@router.get("/{plan_id}", response_model=PlanOut)
async def get_plan(plan_id: str = Path(..., pattern=r"^[a-fA-F0-9]{24}$")):
    return await plan_controller.get_plan(plan_id)


@router.post("", response_model=PlanOut)
async def create_plan(
    plan_data: PlanCreate,
    _: UserModel = Depends(require_admin),
):
    return await plan_controller.create_plan(plan_data)
