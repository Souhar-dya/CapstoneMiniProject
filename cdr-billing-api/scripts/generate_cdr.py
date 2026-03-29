import random
from datetime import datetime, timedelta
from app.core.database import db
from bson import ObjectId


def generate_cdr_records(num_records: int = 100):
    users_collection = db["users"]
    cdr_collection = db["cdr_records"]

    users = list(users_collection.find({"role": "customer"}))

    if not users:
        print("No customer users found. Please seed users first.")
        return

    cdr_types = ["call", "sms", "data"]
    mobile_numbers = [f"91{random.randint(1000000000, 9999999999)}" for _ in range(10)]

    cdrs = []

    for i in range(num_records):
        user = random.choice(users)
        cdr_type = random.choice(cdr_types)

        cdr_record = {
            "user_id": user["_id"],
            "type": cdr_type,
            "timestamp": datetime.utcnow() - timedelta(days=random.randint(0, 30))
        }

        if cdr_type == "call":
            cdr_record["duration"] = random.randint(30, 3600)
            cdr_record["destination_number"] = random.choice(mobile_numbers)
        elif cdr_type == "sms":
            pass
        elif cdr_type == "data":
            cdr_record["data_used"] = round(random.uniform(1.0, 500.0), 2)

        cdrs.append(cdr_record)

    result = cdr_collection.insert_many(cdrs)
    print(f"Generated {len(result.inserted_ids)} CDR records")


def generate_distribution():
    users_collection = db["users"]
    cdr_collection = db["cdr_records"]

    users = list(users_collection.find({"role": "customer"}))

    print("\n=== CDR Distribution Report ===\n")

    for user in users:
        user_cdrs = list(cdr_collection.find({"user_id": user["_id"]}))

        total_calls = sum(1 for cdr in user_cdrs if cdr["type"] == "call")
        total_sms = sum(1 for cdr in user_cdrs if cdr["type"] == "sms")
        total_data = sum(cdr.get("data_used", 0) for cdr in user_cdrs if cdr["type"] == "data")

        print(f"User: {user['name']} ({user['mobile_number']})")
        print(f"  Calls: {total_calls}")
        print(f"  SMS: {total_sms}")
        print(f"  Data: {total_data:.2f} MB")
        print()


def main():
    import sys

    print("CDR Generator Script")
    print("====================\n")

    if len(sys.argv) > 1:
        num_records = int(sys.argv[1])
    else:
        num_records = 100

    print(f"Generating {num_records} CDR records...\n")

    try:
        generate_cdr_records(num_records)
        generate_distribution()
        print("\nCDR generation completed successfully!")
    except Exception as e:
        print(f"Error generating CDR records: {str(e)}")


if __name__ == "__main__":
    main()
