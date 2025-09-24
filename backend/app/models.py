from sqlalchemy import Column, Integer,Numeric, String, Enum, DateTime, ForeignKey, Text, Date, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base
import enum
from datetime import datetime

class RoleEnum(str , enum.Enum):
    booth = "Booth"
    admin = "Admin"
    
class StatusBoothEnum(str, enum.Enum):
    activate = "activate"
    deactivate = "deactivate"
    
class StatusTransactionEnum(str, enum.Enum):
    paid = "paid"
    pending = "pending"
    failed = "failed"
    
class LocationEnum(str, enum.Enum):
    aceh = "Aceh"
    sumatera_utara = "Sumatera Utara"
    sumatera_barat = "Sumatera Barat"
    riau = "Riau"
    kepulauan_riau = "Kepulauan Riau"
    jambi = "Jambi"
    sumatera_selatan = "Sumatera Selatan"
    bangka_belitung = "Kepulauan Bangka Belitung"
    bengkulu = "Bengkulu"
    lampung = "Lampung"

    dki_jakarta = "DKI Jakarta"
    jawa_barat = "Jawa Barat"
    banten = "Banten"
    jawa_tengah = "Jawa Tengah"
    yogyakarta = "DI Yogyakarta"
    jawa_timur = "Jawa Timur"

    bali = "Bali"
    nusa_tenggara_barat = "Nusa Tenggara Barat"
    nusa_tenggara_timur = "Nusa Tenggara Timur"

    kalimantan_barat = "Kalimantan Barat"
    kalimantan_tengah = "Kalimantan Tengah"
    kalimantan_selatan = "Kalimantan Selatan"
    kalimantan_timur = "Kalimantan Timur"
    kalimantan_utara = "Kalimantan Utara"

    sulawesi_utara = "Sulawesi Utara"
    gorontalo = "Gorontalo"
    sulawesi_tengah = "Sulawesi Tengah"
    sulawesi_barat = "Sulawesi Barat"
    sulawesi_selatan = "Sulawesi Selatan"
    sulawesi_tenggara = "Sulawesi Tenggara"

    maluku = "Maluku"
    maluku_utara = "Maluku Utara"

    papua = "Papua"
    papua_barat = "Papua Barat"
    papua_barat_daya = "Papua Barat Daya"
    papua_tengah = "Papua Tengah"
    papua_pegunungan = "Papua Pegunungan"
    papua_selatan = "Papua Selatan"
    

# User Table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.booth)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    booths = relationship("Booth", back_populates="user", cascade="all, delete-orphan") 



# Booth Table
class Booth(Base):
    __tablename__ = "booths"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name = Column(String)
    location = Column(Enum(LocationEnum), nullable=False)
    status = Column(Enum(StatusBoothEnum), default=StatusBoothEnum.deactivate)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="booths")
    # frames = relationship("Frame", back_populates="booth")
    transactions = relationship("Transaction", back_populates="booth")

    
    
# Frame Table
class Frame(Base):
    __tablename__ = "frames"
    
    id = Column(Integer, primary_key=True, index=True)
    # booth_id = Column(Integer, ForeignKey("booths.id"), index=True)
    name = Column(String)
    file_path = Column(String)
    preview_image = Column(String)
    photo_in_frame = Column(Integer)
    photo_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # booth = relationship("Booth", back_populates="frames")



    
    
# Transaction Table
class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    booth_id = Column(Integer, ForeignKey("booths.id"), index=True)
    total_amount = Column(Numeric(10,2))
    status = Column(Enum(StatusTransactionEnum), default=StatusTransactionEnum.pending)
    taken_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    booth = relationship("Booth", back_populates="transactions")
    photos = relationship("Photo", back_populates="transaction")

    

# Photo Table
class Photo(Base):
    __tablename__ = "photos"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"), index=True)
    file_path = Column(String)
    drive_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    transaction = relationship("Transaction", back_populates="photos")


# Voucher Token

