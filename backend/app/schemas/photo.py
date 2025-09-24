from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# --- BASE ---
class PhotoBase(BaseModel):
    file_path: str
    drive_url: Optional[str] = None


# --- CREATE ---
class PhotoCreate(PhotoBase):
    transaction_id: int


# --- RESPONSE ---
class PhotoResponse(PhotoBase):
    id: int
    transaction_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
