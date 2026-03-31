import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app, base_url="http://testserver/api")


def test_generate_billing():
    response = client.post(
        "/billing/generate",
        params={
            "user_id": "507f1f77bcf86cd799439011",
            "billing_cycle": "2024-03"
        }
    )
    assert response.status_code == 401


def test_get_user_billing():
    response = client.get("/billing/my")
    assert response.status_code == 401


def test_pay_billing():
    response = client.put(
        "/billing/pay/507f1f77bcf86cd799439011"
    )
    assert response.status_code == 401


def test_generate_duplicate_billing():
    response = client.post(
        "/billing/generate",
        params={
            "user_id": "507f1f77bcf86cd799439011",
            "billing_cycle": "2024-03"
        }
    )
    assert response.status_code == 401
