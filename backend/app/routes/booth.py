from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud import booth as crud_booth
from app.schemas import booth as booth_schema
from ..database import get_db

router = APIRouter(prefix="/booths", tags=["Booths"])

# CREATE
@router.post("/", response_model=booth_schema.BoothResponse)
def create_booth(booth: booth_schema.BoothCreate, db: Session = Depends(get_db)):
    return crud_booth.create_booth(db, booth)

# READ ALL
@router.get("/", response_model=list[booth_schema.BoothResponse])
def read_booths(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_booth.get_booths(db, skip, limit)

# READ BY ID
@router.get("/{booth_id}", response_model=booth_schema.BoothResponse)
def read_booth(booth_id: int, db: Session = Depends(get_db)):
    db_booth = crud_booth.get_booth(db, booth_id)
    if not db_booth:
        raise HTTPException(status_code=404, detail="Booth not found")
    return db_booth

# UPDATE
@router.put("/{booth_id}", response_model=booth_schema.BoothResponse)
def update_booth(booth_id: int, booth: booth_schema.BoothCreate, db: Session = Depends(get_db)):
    db_booth = crud_booth.update_booth(db, booth_id, booth)
    if not db_booth:
        raise HTTPException(status_code=404, detail="Booth not found")
    return db_booth

# DELETE
@router.delete("/{booth_id}")
def delete_booth(booth_id: int, db: Session = Depends(get_db)):
    db_booth = crud_booth.delete_booth(db, booth_id)
    if not db_booth:
        raise HTTPException(status_code=404, detail="Booth not found")
    return {"message": "Booth deleted successfully"}
