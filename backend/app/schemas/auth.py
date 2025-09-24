# Buat file baru: app/schemas/auth.py
from pydantic import BaseModel, Field
from typing import Optional
from app.models import RoleEnum

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username untuk login")
    password: str = Field(..., min_length=6, description="Password untuk login")
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "admin123",
                "password": "password123"
            }
        }

class LoginResponse(BaseModel):
    message: str
    user: dict
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Login berhasil",
                "user": {
                    "id": 1,
                    "username": "admin123",
                    "role": "admin"
                }
            }
        }


class RegisterResponse(BaseModel):
    message: str
    user: dict
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Akun berhasil dibuat",
                "user": {
                    "id": 2,
                    "username": "booth_kalsel",
                    "role": "Booth"
                }
            }
        }

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., description="Password lama")
    new_password: str = Field(..., min_length=6, description="Password baru")
    confirm_password: str = Field(..., description="Konfirmasi password baru")
    
    class Config:
        json_schema_extra = {
            "example": {
                "current_password": "oldpassword123",
                "new_password": "newpassword123",
                "confirm_password": "newpassword123"
            }
        }

class ChangePasswordResponse(BaseModel):
    message: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Password berhasil diubah"
            }
        }

class DeleteAccountResponse(BaseModel):
    message: str
    deleted_user: dict
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Akun berhasil dihapus",
                "deleted_user": {
                    "id": 2,
                    "username": "booth_jakarta",
                    "role": "booth"
                }
            }
        }
        
class BoothData(BaseModel):
    nama_booth: str = Field(..., description="Nama booth")
    location: str = Field(..., description="Lokasi booth") 
    status: str = Field(default="active", description="Status booth")

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    role: RoleEnum
    booth_data: Optional[BoothData] = None  # ✅ Sekarang structured object
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "booth_kalsel",
                "password": "password123",
                "role": "Booth",
                "booth_data": {
                    "nama_booth": "PhotoBooth Kalimantan Selatan",
                    "location": "Kalimantan Selatan",
                    "status": "activate"
                }
            }
        }