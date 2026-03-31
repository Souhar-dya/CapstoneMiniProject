import pytest
from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime, timezone

client = TestClient(app, base_url="http://testserver/api")


def test_add_cdr():
    response = client.post(
        "/cdr",
        json={
            "user_id": "507f1f77bcf86cd799439011",
            "type": "call",
            "duration": 120,
            "destination_number": "9123456789",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )
    assert response.status_code == 401


def test_add_sms_cdr():
    response = client.post(
        "/cdr",
        json={
            "user_id": "507f1f77bcf86cd799439011",
            "type": "sms",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )
    assert response.status_code == 401


def test_add_data_cdr():
    response = client.post(
        "/cdr",
        json={
            "user_id": "507f1f77bcf86cd799439011",
            "type": "data",
            "data_used": 50.5,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )
    assert response.status_code == 401


def test_get_user_cdr():
    response = client.get("/cdr/my")
    assert response.status_code == 401


def test_cdr_summary():
    response = client.get("/cdr/summary/my")
    assert response.status_code == 401
