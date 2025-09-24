from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import transaction as transaction_crud
from ..database import get_db

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# CREATE
@router.post("/", response_model=schemas.transaction.TransactionResponse)
def create_transaction(data: schemas.transaction.TransactionCreate, db: Session = Depends(get_db)):
    return transaction_crud.create_transaction(db, data)

# READ ALL
@router.get("/", response_model=list[schemas.transaction.TransactionResponse])
def read_transactions(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return transaction_crud.get_transactions(db, skip, limit)

# READ BY ID
@router.get("/{transaction_id}", response_model=schemas.transaction.TransactionResponse)
def read_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = transaction_crud.get_transaction(db, transaction_id)
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

# UPDATE
@router.put("/{transaction_id}", response_model=schemas.transaction.TransactionResponse)
def update_transaction(transaction_id: int, data: schemas.transaction.TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = transaction_crud.update_transaction(db, transaction_id, data)
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

# DELETE
@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = transaction_crud.delete_transaction(db, transaction_id)
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}
