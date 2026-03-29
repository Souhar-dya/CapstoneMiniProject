from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from app.controllers import billing_controller
from app.core.dependencies import require_admin, require_customer
from app.models.user_model import UserModel
from app.repositories import billing_repository
from app.schemas.billing_schema import BillingOut

router = APIRouter(prefix="/billing", tags=["billing"])


@router.post("/generate")
async def generate_billing(
    user_id: str = Query(..., pattern=r"^[a-fA-F0-9]{24}$"),
    billing_cycle: str = Query(..., pattern=r"^\d{4}-(0[1-9]|1[0-2])$"),
    _: UserModel = Depends(require_admin),
):
    return await billing_controller.generate_billing(user_id, billing_cycle)


@router.get("/my", response_model=list[BillingOut])
async def get_my_billing(
    current_user: UserModel = Depends(require_customer),
):
    return await billing_controller.get_user_billing(current_user.id)


@router.put("/pay/{billing_id}", response_model=BillingOut)
async def pay_billing(
    billing_id: str = Path(..., pattern=r"^[a-fA-F0-9]{24}$"),
    current_user: UserModel = Depends(require_customer),
):
    billing = billing_repository.get_billing_by_id(billing_id)
    if not billing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Billing not found")

    if current_user.id != billing.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only pay your own billing"
        )

    return await billing_controller.pay_billing(billing_id)
