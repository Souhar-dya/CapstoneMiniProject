from fastapi import HTTPException
from app.services import user_service


async def get_user(user_id: str):
    try:
        user = user_service.get_user(user_id)
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "mobile_number": user.mobile_number,
            "role": user.role,
            "plan_id": user.plan_id
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


async def get_all_users():
    try:
        users = user_service.get_all_users()
        result = []
        for user in users:
            result.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "mobile_number": user.mobile_number,
                "role": user.role,
                "plan_id": user.plan_id
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
