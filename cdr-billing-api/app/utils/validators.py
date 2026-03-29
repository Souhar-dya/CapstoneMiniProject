import re
from app.utils.constants import MOBILE_NUMBER_PATTERN, MIN_PASSWORD_LENGTH, MIN_NAME_LENGTH


def validate_mobile_number(mobile: str) -> bool:
    return bool(re.match(MOBILE_NUMBER_PATTERN, mobile))


def validate_password(password: str) -> bool:
    return len(password) >= MIN_PASSWORD_LENGTH


def validate_name(name: str) -> bool:
    return len(name) >= MIN_NAME_LENGTH and len(name) <= 100


def validate_email(email: str) -> bool:
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def validate_billing_cycle(cycle: str) -> bool:
    try:
        parts = cycle.split("-")
        if len(parts) != 2:
            return False
        year = int(parts[0])
        month = int(parts[1])
        if month < 1 or month > 12:
            return False
        return True
    except:
        return False


def validate_amount(amount: float) -> bool:
    return amount > 0


def validate_rate(rate: float) -> bool:
    return rate > 0
