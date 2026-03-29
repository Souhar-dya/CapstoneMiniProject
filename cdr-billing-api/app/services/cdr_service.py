from app.repositories import cdr_repository, user_repository
from app.models.cdr_model import CDRModel
from app.schemas.cdr_schema import CDRCreate


def create_cdr(cdr_data: CDRCreate):
    user = user_repository.get_user_by_id(cdr_data.user_id)

    if not user:
        raise ValueError("User not found")

    cdr = CDRModel(
        user_id=cdr_data.user_id,
        type=cdr_data.type,
        duration=cdr_data.duration,
        data_used=cdr_data.data_used,
        destination_number=cdr_data.destination_number,
        timestamp=cdr_data.timestamp if cdr_data.timestamp else None
    )

    if not cdr.timestamp:
        from datetime import datetime
        cdr.timestamp = datetime.utcnow()

    created_cdr = cdr_repository.create_cdr(cdr)

    return created_cdr


def get_cdr_by_user(user_id: str):
    user = user_repository.get_user_by_id(user_id)

    if not user:
        return []

    cdrs = cdr_repository.get_cdr_by_user_id(user_id)

    return cdrs


def get_cdr_summary(user_id: str):
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise ValueError("User not found")

    cdrs = cdr_repository.get_cdr_by_user_id(user_id)

    summary = {
        "total_calls": 0,
        "total_duration": 0,
        "total_sms": 0,
        "total_data": 0.0
    }

    for cdr in cdrs:
        if cdr.type == "call":
            summary["total_calls"] += 1
            if cdr.duration:
                summary["total_duration"] += cdr.duration
        elif cdr.type == "sms":
            summary["total_sms"] += 1
        elif cdr.type == "data":
            if cdr.data_used:
                summary["total_data"] += cdr.data_used

    return summary
