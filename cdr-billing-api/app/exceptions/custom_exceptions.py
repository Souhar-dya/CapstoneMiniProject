from fastapi import HTTPException


class UserNotFound(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="User not found")


class UserAlreadyExists(HTTPException):
    def __init__(self):
        super().__init__(status_code=400, detail="User already exists")


class InvalidCredentials(HTTPException):
    def __init__(self):
        super().__init__(status_code=401, detail="Invalid credentials")


class UnauthorizedAccess(HTTPException):
    def __init__(self):
        super().__init__(status_code=403, detail="Unauthorized access")


class PlanNotFound(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="Plan not found")


class BillingNotFound(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="Billing not found")


class CDRNotFound(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="CDR not found")


class ValidationError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail)
