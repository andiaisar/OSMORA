from datetime import datetime
from pydantic import BaseModel
from typing import Optional


# Base Schema (atribut umum)
class FrameBase(BaseModel):
    # booth_id: int
    name: str
    file_path: str
    preview_image: Optional[str] = None
    photo_in_frame: int
    photo_count: int


# Create Schema (saat insert data baru)
class FrameCreate(FrameBase):
    pass


# Response Schema (untuk return dari API)
class FrameResponse(FrameBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
