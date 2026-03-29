from bson import ObjectId
from app.core.database import db
from app.models.user_model import UserModel


collection = db["users"]


def create_user(user: UserModel) -> UserModel:
    user_dict = user.model_dump(exclude={"id"})

    result = collection.insert_one(user_dict)

    user.id = str(result.inserted_id)

    return user


def get_user_by_mobile(mobile_number: str) -> UserModel | None:
    user = collection.find_one({"mobile_number": mobile_number})

    if not user:
        return None

    return UserModel(
        id=str(user["_id"]),
        name=user["name"],
        email=user.get("email"),
        mobile_number=user["mobile_number"],
        password=user["password"],
        role=user["role"],
        plan_id=user["plan_id"],
    )


def get_user_by_email(email: str) -> UserModel | None:
    user = collection.find_one({"email": email})

    if not user:
        return None

    return UserModel(
        id=str(user["_id"]),
        name=user["name"],
        email=user.get("email"),
        mobile_number=user["mobile_number"],
        password=user["password"],
        role=user["role"],
        plan_id=user["plan_id"],
    )


def get_user_by_id(user_id: str) -> UserModel | None:
    user = collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        return None

    return UserModel(
        id=str(user["_id"]),
        name=user["name"],
        email=user.get("email"),
        mobile_number=user["mobile_number"],
        password=user["password"],
        role=user["role"],
        plan_id=user["plan_id"],
    )


def update_user(user_id: str, update_data: dict) -> bool:
    result = collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    return result.modified_count > 0


def delete_user(user_id: str) -> bool:
    result = collection.delete_one({"_id": ObjectId(user_id)})

    return result.deleted_count > 0