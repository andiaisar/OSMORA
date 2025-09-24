from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .. import models
from app.schemas import user
from app.crud import booth
from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models
from app.schemas import user
from datetime import datetime

def create_user_with_booth(db: Session, user_data: user.UserCreate):
    """Create user dan booth sekaligus"""
    try:
        # 1. Buat user dulu
        db_user = models.User(
            username=user_data.username,
            password=user_data.password,  # Sudah di-hash dari route
            role=user_data.role
        )
        db.add(db_user)
        db.flush()  # Dapat ID tanpa commit
        
        # 2. Jika ada booth_data, buat booth
        if user_data.booth_data:
            # ✅ Sekarang booth_data adalah BoothData object
            db_booth = models.Booth(
                user_id=db_user.id,
                name=user_data.booth_data.nama_booth,  # Akses sebagai attribute
                location=user_data.booth_data.location,
                status=user_data.booth_data.status
            )
            db.add(db_booth)
        
        db.commit()
        db.refresh(db_user)
        return db_user
        
    except Exception as e:
        db.rollback()
        raise e

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user_data: user.UserCreate):
    db_user = models.User(
        username=user_data.username,
        password=user_data.password,
        role=user_data.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# READ ALL
def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()

# READ BY ID dengan booth info
def get_user_with_booth(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# READ BY ID
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# READ BY USERNAME (untuk login)
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

# UPDATE
def update_user(db: Session, user_id: int, user_update: user.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None
    
    if user_update.username is not None:
        db_user.username = user_update.username
    if user_update.password is not None:
        db_user.password = user_update.password
    if user_update.role is not None:
        db_user.role = user_update.role
    
    db.commit()
    db.refresh(db_user)
    return db_user

# DELETE
def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None
    db.delete(db_user)
    db.commit()
    return db_user

# Tambahkan function ini ke crud/user.py yang sudah ada

def update_user_password(db: Session, user_id: int, new_hashed_password: str):
    """
    Update password user saja
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None
    
    db_user.password = new_hashed_password
    db_user.updated_at = datetime.utcnow()  # Jika ada field updated_at
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_id(db: Session, user_id: int):
    """
    Alias untuk get_user() agar konsisten dengan penamaan
    """
    return get_user(db, user_id)