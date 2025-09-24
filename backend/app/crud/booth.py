from sqlalchemy.orm import Session
from .. import models
from app.schemas import booth

# CREATE
def create_booth(db: Session, booth: booth.BoothCreate):
    db_booth = models.Booth(
        user_id=booth.user_id,
        name=booth.name,
        location=booth.location,
        status=booth.status
    )
    db.add(db_booth)
    db.commit()
    db.refresh(db_booth)
    return db_booth

# READ ALL
def get_booths(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Booth).offset(skip).limit(limit).all()

# READ BY ID
def get_booth(db: Session, booth_id: int):
    return db.query(models.Booth).filter(models.Booth.id == booth_id).first()

# UPDATE
def update_booth(db: Session, booth_id: int, booth_update: booth.BoothCreate):
    db_booth = db.query(models.Booth).filter(models.Booth.id == booth_id).first()
    if not db_booth:
        return None
    
    db_booth.name = booth_update.name
    db_booth.location = booth_update.location
    db_booth.status = booth_update.status
    db_booth.user_id = booth_update.user_id
    
    db.commit()
    db.refresh(db_booth)
    return db_booth

# DELETE
def delete_booth(db: Session, booth_id: int):
    db_booth = db.query(models.Booth).filter(models.Booth.id == booth_id).first()
    if not db_booth:
        return None
    db.delete(db_booth)
    db.commit()
    return db_booth
