from app.core.database import db
from bson import ObjectId
from datetime import datetime,timezone
from app.core.security import hash_password


def seed_plans():
    plans_collection = db["plans"]

    plans_collection.delete_many({})

    plans = [
        {
            "name": "Basic Plan",
            "call_rate": 0.5,
            "sms_rate": 1.0,
            "data_rate": 0.01
        },
        {
            "name": "Standard Plan",
            "call_rate": 0.3,
            "sms_rate": 0.5,
            "data_rate": 0.005
        },
        {
            "name": "Premium Plan",
            "call_rate": 0.1,
            "sms_rate": 0.2,
            "data_rate": 0.002
        }
    ]

    result = plans_collection.insert_many(plans)
    print(f"Inserted {len(result.inserted_ids)} plans")
    return result.inserted_ids


def seed_users(plan_ids):
    users_collection = db["users"]

    users_collection.delete_many({})

    users = [
        {
            "name": "Admin User",
            "email": "admin@telecom.com",
            "mobile_number": "9876543210",
            "password": hash_password("admin123"),
            "role": "admin",
            "plan_id": str(plan_ids[0])
        },
        {
            "name": "John Doe",
            "email": "john@telecom.com",
            "mobile_number": "9123456789",
            "password": hash_password("password123"),
            "role": "customer",
            "plan_id": str(plan_ids[0])
        },
        {
            "name": "Jane Smith",
            "email": "jane@telecom.com",
            "mobile_number": "9234567890",
            "password": hash_password("password123"),
            "role": "customer",
            "plan_id": str(plan_ids[1])
        }
    ]

    result = users_collection.insert_many(users)
    print(f"Inserted {len(result.inserted_ids)} users")
    return result.inserted_ids


def seed_cdr_records(user_ids):
    cdr_collection = db["cdr_records"]

    cdr_collection.delete_many({})

    cdrs = [
        {
            "user_id": ObjectId(user_ids[1]),
            "type": "call",
            "duration": 300,
            "destination_number": "9111111111",
            "timestamp": datetime.utcnow()
        },
        {
            "user_id": ObjectId(user_ids[1]),
            "type": "call",
            "duration": 120,
            "destination_number": "9222222222",
            "timestamp": datetime.utcnow()
        },
        {
            "user_id": ObjectId(user_ids[1]),
            "type": "sms",
            "timestamp": datetime.utcnow()
        },
        {
            "user_id": ObjectId(user_ids[1]),
            "type": "data",
            "data_used": 100.5,
            "timestamp": datetime.now(timezone.utc)
        },
        {
            "user_id": ObjectId(user_ids[2]),
            "type": "call",
            "duration": 600,
            "destination_number": "9333333333",
            "timestamp": datetime.utcnow()
        },
        {
            "user_id": ObjectId(user_ids[2]),
            "type": "data",
            "data_used": 250.75,
            "timestamp": datetime.utcnow()
        }
    ]

    result = cdr_collection.insert_many(cdrs)
    print(f"Inserted {len(result.inserted_ids)} CDR records")
    return result.inserted_ids


def seed_billing(user_ids):
    billing_collection = db["billing"]

    billing_collection.delete_many({})

    billing_records = [
        {
            "user_id": ObjectId(user_ids[1]),
            "billing_cycle": "September 2024",
            "total_amount": 50.0,
            "status": "paid",
            "generated_at": datetime.utcnow()
        },
        {
            "user_id": ObjectId(user_ids[1]),
            "billing_cycle": "October 2024",
            "total_amount": 45.5,
            "status": "pending",
            "generated_at": datetime.utcnow()
        },
        {
            "user_id": ObjectId(user_ids[2]),
            "billing_cycle": "October 2024",
            "total_amount": 60.0,
            "status": "pending",
            "generated_at": datetime.utcnow()
        }
    ]

    result = billing_collection.insert_many(billing_records)
    print(f"Inserted {len(result.inserted_ids)} billing records")
    return result.inserted_ids


def main():
    print("Starting seed data insertion...")

    try:
        plan_ids = seed_plans()
        user_ids = seed_users(plan_ids)
        cdr_ids = seed_cdr_records(user_ids)
        billing_ids = seed_billing(user_ids)

        print("Seed data inserted successfully!")
    except Exception as e:
        print(f"Error inserting seed data: {str(e)}")


if __name__ == "__main__":
    main()
