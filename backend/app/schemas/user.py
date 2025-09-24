from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from app.models import RoleEnum, LocationEnum, StatusBoothEnum

# Schema khusus untuk data booth saat register
class UserBoothData(BaseModel):
    name: str
    location: LocationEnum 
    status: Optional[StatusBoothEnum] = StatusBoothEnum.deactivate

# Base schema
class UserBase(BaseModel):
    username: str
    role: Optional[RoleEnum] = RoleEnum.booth
    
# Schema Login
class UserLoginRequest(BaseModel):
    username: str
    password: str

# Schema untuk create
class UserCreate(UserBase):
    password: str
    booth_data: Optional[UserBoothData] = None

# Schema untuk update
class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[RoleEnum] = None

# Schema untuk response
class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True