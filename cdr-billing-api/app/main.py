from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import router
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.rate_limiter import RateLimiterMiddleware
from app.exceptions.exception_handlers import register_exception_handlers
from app.core.config import settings

app = FastAPI(
    title="CDR Billing System",
    description="Telecom CDR and Billing Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)
app.add_middleware(RateLimiterMiddleware, requests_per_minute=100)

register_exception_handlers(app)

app.include_router(router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "environment": settings.ENV}


@app.get("/")
async def root():
    return {
        "message": "CDR Billing System API",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/auth",
            "users": "/users",
            "cdr": "/cdr",
            "billing": "/billing",
            "plans": "/plans",
            "admin": "/admin"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )
