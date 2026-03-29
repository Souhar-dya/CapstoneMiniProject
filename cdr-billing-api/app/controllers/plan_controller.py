from fastapi import HTTPException
from app.services import plan_service
from app.schemas.plan_schema import PlanCreate


async def get_all_plans():
    try:
        plans = plan_service.get_all_plans()
        result = []
        for plan in plans:
            result.append({
                "id": plan.id,
                "name": plan.name,
                "call_rate": plan.call_rate,
                "sms_rate": plan.sms_rate,
                "data_rate": plan.data_rate
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


async def get_plan(plan_id: str):
    try:
        plan = plan_service.get_plan(plan_id)
        return {
            "id": plan.id,
            "name": plan.name,
            "call_rate": plan.call_rate,
            "sms_rate": plan.sms_rate,
            "data_rate": plan.data_rate
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


async def create_plan(plan_data: PlanCreate):
    try:
        plan = plan_service.create_plan(plan_data)
        return {
            "id": plan.id,
            "name": plan.name,
            "call_rate": plan.call_rate,
            "sms_rate": plan.sms_rate,
            "data_rate": plan.data_rate
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
