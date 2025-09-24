from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models import LocationEnum, StatusBoothEnum

class BoothBase(BaseModel):
    name: str
    location: LocationEnum
    status: Optional[StatusBoothEnum] = StatusBoothEnum.deactivate

class BoothCreate(BoothBase):
    user_id: int

class BoothUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[LocationEnum] = None
    status: Optional[StatusBoothEnum] = None

class BoothResponse(BoothBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True