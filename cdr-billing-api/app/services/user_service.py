from app.repositories import user_repository
from app.models.user_model import UserModel


def get_user(user_id: str):
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise ValueError("User not found")

    return user


def get_user_by_mobile(mobile_number: str):
    user = user_repository.get_user_by_mobile(mobile_number)

    if not user:
        raise ValueError("User not found")

    return user


def get_user_by_email(email: str):
    user = user_repository.get_user_by_email(email)

    if not user:
        raise ValueError("User not found")

    return user


def get_all_users():
    from app.core.database import db
    collection = db["users"]
    users = collection.find()

    result = []
    for user in users:
        result.append(
            UserModel(
                id=str(user["_id"]),
                name=user["name"],
                email=user.get("email"),
                mobile_number=user["mobile_number"],
                password=user["password"],
                role=user["role"],
                plan_id=user["plan_id"],
            )
        )

    return result
