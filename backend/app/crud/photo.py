from sqlalchemy.orm import Session
from app.models import Photo
from app.schemas import photo

# CREATE
def create_photo(db: Session, photo: photo.PhotoCreate):
    db_photo = Photo(
        transaction_id=photo.transaction_id,
        file_path=photo.file_path,
        drive_url=photo.drive_url
    )
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    return db_photo

# READ - all photos
def get_photos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Photo).offset(skip).limit(limit).all()

# READ - single photo
def get_photo(db: Session, photo_id: int):
    return db.query(Photo).filter(Photo.id == photo_id).first()

# UPDATE
def update_photo(db: Session, photo_id: int, updated_data: photo.PhotoCreate):
    db_photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not db_photo:
        return None
    
    db_photo.transaction_id = updated_data.transaction_id
    db_photo.file_path = updated_data.file_path
    db_photo.drive_url = updated_data.drive_url

    db.commit()
    db.refresh(db_photo)
    return db_photo

# DELETE
def delete_photo(db: Session, photo_id: int):
    db_photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not db_photo:
        return None
    
    db.delete(db_photo)
    db.commit()
    return db_photo
