from app.repositories import plan_repository
from app.models.plan_model import PlanModel
from app.schemas.plan_schema import PlanCreate


def get_all_plans():
    plans = plan_repository.get_all_plans()

    return plans


def get_plan(plan_id: str):
    plan = plan_repository.get_plan_by_id(plan_id)

    if not plan:
        raise ValueError("Plan not found")

    return plan


def create_plan(plan_data: PlanCreate):
    plan = PlanModel(
        name=plan_data.name,
        call_rate=plan_data.call_rate,
        sms_rate=plan_data.sms_rate,
        data_rate=plan_data.data_rate
    )

    created_plan = plan_repository.create_plan(plan)

    return created_plan
