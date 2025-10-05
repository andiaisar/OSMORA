#!/usr/bin/env python3
"""
Script untuk membuat user admin default
Jalankan dengan: python create_admin.py
"""

import sys
import os

# Add the parent directory to the path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import User, RoleEnum
import bcrypt

def create_admin_user():
    """Membuat user admin default jika belum ada"""
    
    # Create database tables if they don't exist
    from app.models import Base
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        # Check if admin user already exists
        existing_admin = db.query(User).filter(
            User.username == "admin",
            User.role == RoleEnum.admin
        ).first()
        
        if existing_admin:
            print("✅ Admin user already exists")
            print(f"   Username: {existing_admin.username}")
            print(f"   Role: {existing_admin.role}")
            return
        
        # Create admin user
        admin_password = "admin123"  # Default password
        hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt())
        
        admin_user = User(
            username="admin",
            password=hashed_password.decode('utf-8'),
            role=RoleEnum.admin
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("🎉 Admin user created successfully!")
        print(f"   Username: {admin_user.username}")
        print(f"   Password: {admin_password}")
        print(f"   Role: {admin_user.role}")
        print(f"   ID: {admin_user.id}")
        print("\n⚠️  Please change the default password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating admin user...")
    create_admin_user()