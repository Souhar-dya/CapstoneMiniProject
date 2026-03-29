from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.core.config import settings
from app.core.database import db
from app.models.user_model import Role, UserModel
from app.repositories import user_repository

def get_database():
    return db


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_current_user(token: str = Depends(oauth2_scheme)) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

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