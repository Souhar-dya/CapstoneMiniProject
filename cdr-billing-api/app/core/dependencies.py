from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.config import settings
from app.core.database import db
from app.models.user_model import Role, UserModel
from app.repositories import user_repository




bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)
) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not credentials:
        raise credentials_exception

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: str | None = payload.get("sub")
        if not user_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = user_repository.get_user_by_id(user_id)
    if not user:
        raise credentials_exception

    return user


def require_admin(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    """Allow access only to admin users."""
    if current_user.role == Role.admin:
        return current_user

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Admin access required"
    )


def require_customer(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    """Allow access only to customer users."""
    if current_user.role == Role.customer:
        return current_user

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Customer access required"
    )


def require_customer_or_admin(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    """Allow access to both customer and admin users."""
    if current_user.role in (Role.customer, Role.admin):
        return current_user

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access required"
    )


def ensure_self_or_admin(
    requested_user_id: str,
    current_user: UserModel,
) -> None:
    if current_user.role == Role.admin:
        return

    if current_user.id != requested_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own records"
        )