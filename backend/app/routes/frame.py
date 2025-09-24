from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud import frame as crud_frame
from app.schemas import frame as frame_schema
from ..database import get_db

router = APIRouter(prefix="/frames", tags=["Frames"])

# CREATE
@router.post("/", response_model=frame_schema.FrameResponse)
def create_frame(frame: frame_schema.FrameCreate, db: Session = Depends(get_db)):
    return crud_frame.create_frame(db, frame)

# READ ALL
@router.get("/", response_model=list[frame_schema.FrameResponse])
def read_frames(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_frame.get_frames(db, skip, limit)

# READ BY ID
@router.get("/{frame_id}", response_model=frame_schema.FrameResponse)
def read_frame(frame_id: int, db: Session = Depends(get_db)):
    db_frame = crud_frame.get_frame(db, frame_id)
    if not db_frame:
        raise HTTPException(status_code=404, detail="Frame not found")
    return db_frame

# UPDATE
@router.put("/{frame_id}", response_model=frame_schema.FrameResponse)
def update_frame(frame_id: int, frame: frame_schema.FrameCreate, db: Session = Depends(get_db)):
    db_frame = crud_frame.update_frame(db, frame_id, frame)
    if not db_frame:
        raise HTTPException(status_code=404, detail="Frame not found")
    return db_frame

# DELETE
@router.delete("/{frame_id}")
def delete_frame(frame_id: int, db: Session = Depends(get_db)):
    db_frame = crud_frame.delete_frame(db, frame_id)
    if not db_frame:
        raise HTTPException(status_code=404, detail="Frame not found")
    return {"message": "Frame deleted successfully"}
