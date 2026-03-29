from app.repositories import user_repository
from app.core.security import hash_password, create_access_token, verify_password
from app.schemas.auth_schema import RegisterSchema

from app.models.user_model import UserModel, Role


def register(register_data: RegisterSchema):
    user = user_repository.get_user_by_mobile(register_data.mobile_number)
    user_by_email = user_repository.get_user_by_email(register_data.email)

    if user or user_by_email:
        raise ValueError("User already exists")

    hashed_password = hash_password(register_data.password)


    new_user = UserModel(
        name=register_data.name,
        email=register_data.email,
        mobile_number=register_data.mobile_number,
        password=hashed_password,
        role=Role.customer,
        plan_id=register_data.plan_id
    )

    created_user = user_repository.create_user(new_user)

    access_token = create_access_token({"sub": created_user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": created_user.id
    }


def login(email: str, password: str):
    user = user_repository.get_user_by_email(email)

    if not user:
        raise ValueError("Invalid credentials")

    if not verify_password(password, user.password):
        raise ValueError("Invalid credentials")

    access_token = create_access_token({"sub": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id
    }
