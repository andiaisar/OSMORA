from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import auth  # Import schema auth yang sudah dibuat
from app.crud import user as user_crud
from app.models import RoleEnum
import bcrypt

router = APIRouter(prefix="/auth", tags=["Authentication"])

# REGISTER - menggunakan create_user_with_booth dan create_user
@router.post("/register", response_model=auth.RegisterResponse)
def register_user(
    user_data: auth.RegisterRequest,
    db: Session = Depends(get_db),
):
    """
    Register user baru (hanya admin yang bisa)
    Jika role = booth, wajib include booth_data
    """
    
    # Validasi: jika role booth, booth_data wajib ada
    if user_data.role == RoleEnum.booth and not user_data.booth_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data booth wajib diisi untuk akun dengan role booth"
        )
    
    # Validasi: jika role admin, booth_data tidak boleh ada
    if user_data.role == RoleEnum.admin and user_data.booth_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Akun admin tidak memerlukan data booth"
        )
    
    # Check apakah username sudah ada - menggunakan function existing
    existing_user = user_crud.get_user_by_username(db, user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username sudah terdaftar"
        )
    
    # Hash password
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    user_data.password = hashed_password.decode('utf-8')
    
    try:
        # Buat user menggunakan function CRUD existing
        if user_data.role == RoleEnum.booth:
            db_user = user_crud.create_user_with_booth(db, user_data)
        else:
            db_user = user_crud.create_user(db, user_data)
            
        return auth.RegisterResponse(
            message="Akun berhasil dibuat",
            user={
                "id": db_user.id,
                "username": db_user.username,
                "role": db_user.role
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat membuat akun: {str(e)}"
        )

# LOGIN - menggunakan get_user_by_username existing
@router.post("/login", response_model=auth.LoginResponse)
def login(
    login_data: auth.LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login user (booth atau admin)
    """
    # Cari user berdasarkan username - menggunakan function existing
    user = user_crud.get_user_by_username(db, login_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username atau password salah"
        )
    
    # Verify password
    if not bcrypt.checkpw(login_data.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username atau password salah"
        )
    
    return auth.LoginResponse(
        message="Login berhasil",
        user={
            "id": user.id,
            "username": user.username,
            "role": user.role
        }
    )

# CHANGE PASSWORD - menggunakan function CRUD baru
@router.put("/change-password", response_model=auth.ChangePasswordResponse)
def change_password(
    password_data: auth.ChangePasswordRequest,
    user_id: int,  # Bisa dari query parameter atau path parameter
    db: Session = Depends(get_db)
):
    """
    Ubah password user
    """
    # Validasi konfirmasi password
    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password baru dan konfirmasi password tidak sama"
        )
    
    # Get user - menggunakan function existing
    user = user_crud.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User tidak ditemukan"
        )
    
    # Verify current password
    if not bcrypt.checkpw(password_data.current_password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password lama tidak benar"
        )
    
    # Hash new password
    hashed_new_password = bcrypt.hashpw(password_data.new_password.encode('utf-8'), bcrypt.gensalt())
    
    try:
        # Update password - menggunakan function CRUD baru
        updated_user = user_crud.update_user_password(db, user_id, hashed_new_password.decode('utf-8'))
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User tidak ditemukan"
            )
        
        return auth.ChangePasswordResponse(message="Password berhasil diubah")
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat mengubah password: {str(e)}"
        )

# DELETE ACCOUNT - menggunakan delete_user existing
@router.delete("/delete-account/{user_id}", response_model=auth.DeleteAccountResponse)
def delete_account(
    user_id: int,
    db: Session = Depends(get_db)
    # current_user: = Depends(get_current_admin_user)  # Uncomment jika perlu auth admin
):
    """
    Hapus akun user (hanya admin yang bisa menghapus akun)
    """
    # Get user yang akan dihapus - menggunakan function existing
    user_to_delete = user_crud.get_user(db, user_id)
    if not user_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User tidak ditemukan"
        )
    
    try:
        # Simpan info user sebelum dihapus untuk response
        deleted_user_info = {
            "id": user_to_delete.id,
            "username": user_to_delete.username,
            "role": user_to_delete.role
        }
        
        # Hapus user - menggunakan function existing
        deleted_user = user_crud.delete_user(db, user_id)
        if not deleted_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User tidak ditemukan"
            )
        
        return auth.DeleteAccountResponse(
            message="Akun berhasil dihapus",
            deleted_user=deleted_user_info
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat menghapus akun: {str(e)}"
        )

# GET USER INFO - menggunakan get_user_with_booth existing
@router.get("/me")
def get_current_user_info(
    user_id: int,  # Dari query parameter atau path parameter
    db: Session = Depends(get_db)
):
    """
    Get informasi user yang sedang login beserta info booth jika ada
    """
    # Menggunakan function existing yang sudah include booth info
    user = user_crud.get_user_with_booth(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User tidak ditemukan"
        )
    
    user_info = {
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "created_at": user.created_at if hasattr(user, 'created_at') else None
    }
    
    # Jika user punya booth, tambahkan info booth
    if hasattr(user, 'booth') and user.booth:
        user_info["booth"] = {
            "id": user.booth.id,
            "name": user.booth.name,
            "location": user.booth.location,
            "status": user.booth.status
        }
    
    return {"user": user_info}

# GET ALL USERS - menggunakan get_users existing
@router.get("/users")
def get_all_users(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
    # current_user: = Depends(get_current_admin_user)  # Uncomment jika perlu auth admin
):
    """
    Get daftar semua user (hanya admin)
    """
    users = user_crud.get_users(db, skip=skip, limit=limit)
    return {
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "role": user.role,
                "created_at": user.created_at if hasattr(user, 'created_at') else None
            }
            for user in users
        ],
        "total": len(users),
        "skip": skip,
        "limit": limit
    }