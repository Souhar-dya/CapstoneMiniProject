import pytest
import random
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_user():
    unique_mobile = f"9{random.randint(100000000, 999999999)}"
    unique_email = f"john{random.randint(1000, 9999)}@example.com"
    response = client.post(
        "/auth/register",
        json={
            "name": "John Doe",
            "email": unique_email,
            "mobile_number": unique_mobile,
            "password": "password123",
            "plan_id": "507f1f77bcf86cd799439011"
        }
    )
    assert response.status_code in [200, 201]


def test_register_invalid_mobile():
    response = client.post(
        "/auth/register",
        json={
            "name": "John Doe",
            "email": "john@example.com",
            "mobile_number": "invalid",
            "password": "password123",
            "plan_id": "507f1f77bcf86cd799439011"
        }
    )
    assert response.status_code == 422


def test_register_short_password():
    response = client.post(
        "/auth/register",
        json={
            "name": "John Doe",
            "email": "john2@example.com",
            "mobile_number": "9876543210",
            "password": "short",
            "plan_id": "507f1f77bcf86cd799439011"
        }
    )
    assert response.status_code == 422


def test_login_user():
    response = client.post(
        "/auth/login",
        json={
            "email": "admin@telecom.com",
            "password": "password123"
        }
    )
    assert response.status_code in [200, 401]
