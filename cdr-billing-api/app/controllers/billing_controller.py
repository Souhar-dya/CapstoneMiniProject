from fastapi import HTTPException
from app.services import billing_service


async def generate_billing(user_id: str, billing_cycle: str):
    try:
        billing = billing_service.generate_billing(user_id, billing_cycle)
        return {
            "id": billing.id,
            "user_id": billing.user_id,
            "billing_cycle": billing.billing_cycle,
            "total_amount": billing.total_amount,
            "status": billing.status,
            "generated_at": billing.generated_at
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


async def get_user_billing(user_id: str):
    try:
        billings = billing_service.get_billing(user_id)
        result = []
        for billing in billings:
            result.append({
                "id": billing.id,
                "user_id": billing.user_id,
                "billing_cycle": billing.billing_cycle,
                "total_amount": billing.total_amount,
                "status": billing.status,
                "generated_at": billing.generated_at
            })
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


async def get_all_billing():
    try:
        billings = billing_service.get_all_billings()
        result = []
        for billing in billings:
            result.append({
                "id": billing.id,
                "user_id": billing.user_id,
                "billing_cycle": billing.billing_cycle,
                "total_amount": billing.total_amount,
                "status": billing.status,
                "generated_at": billing.generated_at
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


async def pay_billing(billing_id: str):
    try:
        billing = billing_service.pay_billing(billing_id)
        return {
            "id": billing.id,
            "user_id": billing.user_id,
            "billing_cycle": billing.billing_cycle,
            "total_amount": billing.total_amount,
            "status": billing.status,
            "generated_at": billing.generated_at
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
