from datetime import datetime


def get_current_month_cycle() -> str:
    now = datetime.utcnow()
    return f"{now.year}-{now.month:02d}"


def get_previous_month_cycle() -> str:
    now = datetime.utcnow()
    if now.month == 1:
        return f"{now.year - 1}-12"
    return f"{now.year}-{now.month - 1:02d}"


def is_valid_cycle_format(cycle: str) -> bool:
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


def format_currency(amount: float) -> str:
    return f"${amount:.2f}"


def convert_seconds_to_minutes(seconds: int) -> float:
    return seconds / 60


def convert_bytes_to_mb(bytes_val: float) -> float:
    return bytes_val / (1024 * 1024)
