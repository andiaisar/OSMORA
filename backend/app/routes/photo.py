from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.photo import PhotoCreate, PhotoResponse 
import app.crud.photo as crud_photo

router = APIRouter(
    prefix="/photos",
    tags=["Photos"]
)

# CREATE
@router.post("/", response_model=PhotoResponse)
def create_photo(photo: PhotoCreate, db: Session = Depends(get_db)):
    return crud_photo.create_photo(db, photo)

# READ - all
@router.get("/", response_model=List[PhotoResponse])
def get_photos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_photo.get_photos(db, skip=skip, limit=limit)

# READ - single
@router.get("/{photo_id}", response_model=PhotoResponse)
def get_photo(photo_id: int, db: Session = Depends(get_db)):
    db_photo = crud_photo.get_photo(db, photo_id)
    if not db_photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    return db_photo

# UPDATE
@router.put("/{photo_id}", response_model=PhotoResponse)
def update_photo(photo_id: int, photo: PhotoCreate, db: Session = Depends(get_db)):
    db_photo = crud_photo.update_photo(db, photo_id, photo)
    if not db_photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    return db_photo

# DELETE
@router.delete("/{photo_id}", response_model=PhotoResponse)
def delete_photo(photo_id: int, db: Session = Depends(get_db)):
    db_photo = crud_photo.delete_photo(db, photo_id)
    if not db_photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    return db_photo
