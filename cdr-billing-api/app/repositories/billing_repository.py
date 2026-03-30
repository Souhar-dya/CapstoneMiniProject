from bson import ObjectId
from app.core.database import db
from app.models.billing_model import BillingModel


collection = db["billing"]


def create_billing(billing: BillingModel) -> BillingModel:
    billing_dict = billing.dict(exclude={"id"})

    result = collection.insert_one(billing_dict)

    billing.id = str(result.inserted_id)

    return billing


def get_billing_by_id(billing_id: str) -> BillingModel | None:
    billing = collection.find_one({"_id": ObjectId(billing_id)})

    if not billing:
        return None

    return BillingModel(
        id=str(billing["_id"]),
        user_id=str(billing["user_id"]),
        billing_cycle=billing["billing_cycle"],
        total_amount=billing["total_amount"],
        status=billing["status"],
        generated_at=billing["generated_at"],
    )


def get_billing_by_user_id(user_id: str) -> list[BillingModel]:
    billings = collection.find({"user_id": ObjectId(user_id)})

    result = []
    for billing in billings:
        result.append(
            BillingModel(
                id=str(billing["_id"]),
                user_id=str(billing["user_id"]),
                billing_cycle=billing["billing_cycle"],
                total_amount=billing["total_amount"],
                status=billing["status"],
                generated_at=billing["generated_at"],
            )
        )

    return result


def get_all_billings() -> list[BillingModel]:
    billings = collection.find()

    result = []
    for billing in billings:
        result.append(
            BillingModel(
                id=str(billing["_id"]),
                user_id=str(billing["user_id"]),
                billing_cycle=billing["billing_cycle"],
                total_amount=billing["total_amount"],
                status=billing["status"],
                generated_at=billing["generated_at"],
            )
        )

    return result


def get_billing_by_user_and_cycle(user_id: str, billing_cycle: str) -> BillingModel | None:
    billing = collection.find_one({
        "user_id": ObjectId(user_id),
        "billing_cycle": billing_cycle
    })

    if not billing:
        return None

    return BillingModel(
        id=str(billing["_id"]),
        user_id=str(billing["user_id"]),
        billing_cycle=billing["billing_cycle"],
        total_amount=billing["total_amount"],
        status=billing["status"],
        generated_at=billing["generated_at"],
    )


def update_billing(billing_id: str, update_data: dict) -> bool:
    result = collection.update_one(
        {"_id": ObjectId(billing_id)},
        {"$set": update_data}
    )

    return result.modified_count > 0
