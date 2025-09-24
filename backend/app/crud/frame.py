from sqlalchemy.orm import Session
from .. import models
from app.schemas import frame

# CREATE
def create_frame(db: Session, frame: frame.FrameCreate):
    db_frame = models.Frame(
        booth_id=frame.booth_id,
        name=frame.name,
        file_path=frame.file_path,
        preview_image=frame.preview_image,
        photo_in_frame=frame.photo_in_frame,
        photo_count=frame.photo_count
    )
    db.add(db_frame)
    db.commit()
    db.refresh(db_frame)
    return db_frame

# READ ALL
def get_frames(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Frame).offset(skip).limit(limit).all()

# READ BY ID
def get_frame(db: Session, frame_id: int):
    return db.query(models.Frame).filter(models.Frame.id == frame_id).first()

# UPDATE
def update_frame(db: Session, frame_id: int, frame_update: frame.FrameCreate):
    db_frame = db.query(models.Frame).filter(models.Frame.id == frame_id).first()
    if not db_frame:
        return None

    db_frame.booth_id = frame_update.booth_id
    db_frame.name = frame_update.name
    db_frame.file_path = frame_update.file_path
    db_frame.preview_image = frame_update.preview_image
    db_frame.photo_in_frame=frame_update.photo_in_frame,
    db_frame.photo_count = frame_update.photo_count

    db.commit()
    db.refresh(db_frame)
    return db_frame

# DELETE
def delete_frame(db: Session, frame_id: int):
    db_frame = db.query(models.Frame).filter(models.Frame.id == frame_id).first()
    if not db_frame:
        return None
    db.delete(db_frame)
    db.commit()
    return db_frame
