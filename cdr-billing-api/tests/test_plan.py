import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_all_plans():
    response = client.get("/plans")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_plan():
    response = client.get("/plans/507f1f77bcf86cd799439011")
    assert response.status_code in [200, 404]


def test_create_plan():
    response = client.post(
        "/plans",
        json={
            "name": "Premium Plan",
            "call_rate": 0.5,
            "sms_rate": 1.0,
            "data_rate": 0.01
        }
    )
    assert response.status_code == 401


def test_create_plan_invalid_rate():
    response = client.post(
        "/plans",
        json={
            "name": "Invalid Plan",
            "call_rate": -0.5,
            "sms_rate": 1.0,
            "data_rate": 0.01
        }
    )
    assert response.status_code == 401
