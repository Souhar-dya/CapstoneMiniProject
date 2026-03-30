from bson import ObjectId
from app.core.database import db
from app.models.cdr_model import CDRModel


collection = db["cdr_records"]


def create_cdr(cdr: CDRModel) -> CDRModel:
    cdr_dict = cdr.dict(exclude={"id"})

    result = collection.insert_one(cdr_dict)

    cdr.id = str(result.inserted_id)

    return cdr


def get_cdr_by_id(cdr_id: str) -> CDRModel | None:
    cdr = collection.find_one({"_id": ObjectId(cdr_id)})

    if not cdr:
        return None

    return CDRModel(
        id=str(cdr["_id"]),
        user_id=str(cdr["user_id"]),
        type=cdr["type"],
        duration=cdr.get("duration"),
        data_used=cdr.get("data_used"),
        destination_number=cdr.get("destination_number"),
        timestamp=cdr["timestamp"],
    )


def get_cdr_by_user_id(user_id: str) -> list[CDRModel]:
    cdrs = collection.find({"user_id": ObjectId(user_id)})

    result = []
    for cdr in cdrs:
        result.append(
            CDRModel(
                id=str(cdr["_id"]),
                user_id=str(cdr["user_id"]),
                type=cdr["type"],
                duration=cdr.get("duration"),
                data_used=cdr.get("data_used"),
                destination_number=cdr.get("destination_number"),
                timestamp=cdr["timestamp"],
            )
        )

    return result


def get_all_cdrs() -> list[CDRModel]:
    cdrs = collection.find()

    result = []
    for cdr in cdrs:
        result.append(
            CDRModel(
                id=str(cdr["_id"]),
                user_id=str(cdr["user_id"]),
                type=cdr["type"],
                duration=cdr.get("duration"),
                data_used=cdr.get("data_used"),
                destination_number=cdr.get("destination_number"),
                timestamp=cdr["timestamp"],
            )
        )

    return result


def get_cdr_by_user_and_type(user_id: str, cdr_type: str) -> list[CDRModel]:
    cdrs = collection.find({
        "user_id": ObjectId(user_id),
        "type": cdr_type
    })

    result = []
    for cdr in cdrs:
        result.append(
            CDRModel(
                id=str(cdr["_id"]),
                user_id=str(cdr["user_id"]),
                type=cdr["type"],
                duration=cdr.get("duration"),
                data_used=cdr.get("data_used"),
                destination_number=cdr.get("destination_number"),
                timestamp=cdr["timestamp"],
            )
        )

    return result


def delete_cdr(cdr_id: str) -> bool:
    result = collection.delete_one({"_id": ObjectId(cdr_id)})

    return result.deleted_count > 0