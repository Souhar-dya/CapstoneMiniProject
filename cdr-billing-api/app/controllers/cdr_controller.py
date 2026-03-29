from fastapi import HTTPException
from app.services import cdr_service
from app.schemas.cdr_schema import CDRCreate


async def add_cdr(cdr_data: CDRCreate):
    try:
        cdr = cdr_service.create_cdr(cdr_data)
        return {
            "id": cdr.id,
            "user_id": cdr.user_id,
            "type": cdr.type,
            "duration": cdr.duration,
            "data_used": cdr.data_used,
            "destination_number": cdr.destination_number,
            "timestamp": cdr.timestamp
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


async def get_user_cdr(user_id: str):
    try:
        cdrs = cdr_service.get_cdr_by_user(user_id)
        result = []
        for cdr in cdrs:
            result.append({
                "id": cdr.id,
                "user_id": cdr.user_id,
                "type": cdr.type,
                "duration": cdr.duration,
                "data_used": cdr.data_used,
                "destination_number": cdr.destination_number,
                "timestamp": cdr.timestamp
            })
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


async def get_cdr_summary(user_id: str):
    try:
        summary = cdr_service.get_cdr_summary(user_id)
        return summary
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
