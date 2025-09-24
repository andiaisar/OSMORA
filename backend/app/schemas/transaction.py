from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.photo import PhotoResponse  # kalau PhotoResponse sudah ada
from app.models import StatusTransactionEnum


# === BASE ===
class TransactionBase(BaseModel):
    booth_id: int
    total_amount: float
    status: StatusTransactionEnum = StatusTransactionEnum.pending


# === CREATE ===
class TransactionCreate(TransactionBase):
    pass


# === RESPONSE ===
class TransactionResponse(TransactionBase):
    id: int
    taken_at: datetime
    created_at: datetime
    updated_at: datetime
    photos: Optional[List[PhotoResponse]] = []  # relasi ke photos

    class Config:
        from_attributes = True
        

