from bson import ObjectId
from app.core.database import db
from app.models.plan_model import PlanModel


collection = db["plans"]


def create_plan(plan: PlanModel) -> PlanModel:
    plan_dict = plan.dict(exclude={"id"})

    result = collection.insert_one(plan_dict)

    plan.id = str(result.inserted_id)

    return plan


def get_all_plans() -> list[PlanModel]:
    plans = collection.find()

    result = []
    for plan in plans:
        result.append(
            PlanModel(
                id=str(plan["_id"]),
                name=plan["name"],
                call_rate=plan["call_rate"],
                sms_rate=plan["sms_rate"],
                data_rate=plan["data_rate"],
            )
        )

    return result


def get_plan_by_id(plan_id: str) -> PlanModel | None:
    plan = collection.find_one({"_id": ObjectId(plan_id)})

    if not plan:
        return None

    return PlanModel(
        id=str(plan["_id"]),
        name=plan["name"],
        call_rate=plan["call_rate"],
        sms_rate=plan["sms_rate"],
        data_rate=plan["data_rate"],
    )


def update_plan(plan_id: str, update_data: dict) -> bool:
    result = collection.update_one(
        {"_id": ObjectId(plan_id)},
        {"$set": update_data}
    )

    return result.modified_count > 0


def delete_plan(plan_id: str) -> bool:
    result = collection.delete_one({"_id": ObjectId(plan_id)})

    return result.deleted_count > 0