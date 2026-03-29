from fastapi import HTTPException
from app.services import user_service, billing_service, cdr_service


async def get_users():
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


async def get_reports():
    try:
        billings = billing_service.get_all_billings()

        total_users = len(user_service.get_all_users())
        total_revenue = sum(b.total_amount for b in billings)
        paid_revenue = sum(b.total_amount for b in billings if b.status == "paid")
        pending_revenue = sum(b.total_amount for b in billings if b.status == "pending")

        report = {
            "total_users": total_users,
            "total_revenue": total_revenue,
            "paid_revenue": paid_revenue,
            "pending_revenue": pending_revenue,
            "total_billings": len(billings)
        }

        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
