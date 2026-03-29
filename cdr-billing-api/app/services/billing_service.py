from app.repositories import billing_repository, cdr_repository, user_repository, plan_repository
from app.models.billing_model import BillingModel, BillingStatus
from datetime import datetime


def generate_billing(user_id: str, billing_cycle: str):
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise ValueError("User not found")

    plan = plan_repository.get_plan_by_id(user.plan_id)

    if not plan:
        raise ValueError("Plan not found")

    existing_billing = billing_repository.get_billing_by_user_and_cycle(user_id, billing_cycle)

    if existing_billing:
        raise ValueError("Billing already exists for this cycle")

    cdrs = cdr_repository.get_cdr_by_user_id(user_id)

    total_amount = 0.0

    for cdr in cdrs:
        if cdr.type == "call" and cdr.duration:
            total_amount += cdr.duration * plan.call_rate
        elif cdr.type == "sms":
            total_amount += 1 * plan.sms_rate
        elif cdr.type == "data" and cdr.data_used:
            total_amount += cdr.data_used * plan.data_rate

    billing = BillingModel(
        user_id=user_id,
        billing_cycle=billing_cycle,
        total_amount=total_amount,
        status=BillingStatus.pending,
        generated_at=datetime.utcnow()
    )

    created_billing = billing_repository.create_billing(billing)

    return created_billing


def get_billing(user_id: str):
    user = user_repository.get_user_by_id(user_id)

    if not user:
        return []

    billings = billing_repository.get_billing_by_user_id(user_id)

    return billings


def pay_billing(billing_id: str):
    billing = billing_repository.get_billing_by_id(billing_id)

    if not billing:
        raise ValueError("Billing not found")

    if billing.status == BillingStatus.paid:
        raise ValueError("Billing already paid")

    update_result = billing_repository.update_billing(
        billing_id,
        {"status": BillingStatus.paid}
    )

    if not update_result:
        raise ValueError("Failed to update billing status")

    updated_billing = billing_repository.get_billing_by_id(billing_id)

    return updated_billing


def get_all_billings():
    billings = billing_repository.get_all_billings()

    return billings
