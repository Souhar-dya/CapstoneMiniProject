from fastapi import APIRouter
from app.api.routes import auth, users, cdr, billing, plans, admin

router = APIRouter()

router.include_router(auth.router)
router.include_router(users.router)
router.include_router(cdr.router)
router.include_router(billing.router)
router.include_router(plans.router)
router.include_router(admin.router)
