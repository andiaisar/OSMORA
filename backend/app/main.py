# from fastapi import Depends, FastAPI
# from sqlalchemy.orm import Session
# from . import models, database
# from app.routes import user, booth, frame, transaction, photo, auth
# from app.api import tokenizer
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # buat tabel di database
# models.Base.metadata.create_all(bind=database.engine)

# # ✅ PRODUCTION CORS (Lebih Aman)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",      # Vite dev server
#         "http://127.0.0.1:5173",     # Alternative localhost
#         "http://localhost:3000",      # React dev server
#         "http://127.0.0.1:3000"      # Alternative
#         # "https://your-frontend-domain.com",  # Production domain
#     ],
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#     allow_headers=[
#         "Accept",
#         "Accept-Language", 
#         "Content-Language",
#         "Content-Type",
#         "Authorization"
#     ],
# )

# # daftar router
# app.include_router(auth.router)
# app.include_router(user.router)
# app.include_router(booth.router)
# app.include_router(frame.router)
# app.include_router(transaction.router)
# app.include_router(photo.router)
# app.include_router(tokenizer.router)

# # @app.get("/users/")
# # def read_users(db: Session = Depends(database.get_db)):
# #     return db.query(models.User).all()


from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from . import models
from . import database
from app.routes import user, booth, frame, transaction, photo, auth
from app.api import tokenizer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Perbaikan di sini: Panggil Base langsung dari models
models.Base.metadata.create_all(bind=database.engine)

# ✅ PRODUCTION CORS (Lebih Aman)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite dev server
        "http://127.0.0.01:5173",     # Alternative localhost
        "http://localhost:3000",      # React dev server
        "http://127.0.0.1:3000"      # Alternative
        # "https://your-frontend-domain.com",  # Production domain
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language", 
        "Content-Language",
        "Content-Type",
        "Authorization"
    ],
)

# daftar router
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(booth.router)
app.include_router(frame.router)
app.include_router(transaction.router)
app.include_router(photo.router)
app.include_router(tokenizer.router)

@app.get("/users/")
def read_users(db: Session = Depends(database.get_db)):
    return db.query(models.User).all()