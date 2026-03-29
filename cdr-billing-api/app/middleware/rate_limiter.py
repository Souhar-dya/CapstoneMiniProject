from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
import time


class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host

        current_time = time.time()

        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if current_time - req_time < 60
        ]

        if len(self.requests[client_ip]) >= self.requests_per_minute:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")

        self.requests[client_ip].append(current_time)

        response = await call_next(request)

        return response
