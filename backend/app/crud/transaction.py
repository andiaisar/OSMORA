from sqlalchemy.orm import Session
from .. import models
from app.schemas import transaction

# CREATE
def create_transaction(db: Session, transaction: transaction.TransactionCreate):
    db_transaction = models.Transaction(
        booth_id=transaction.booth_id,
        total_amount=transaction.total_amount,
        status=transaction.status,
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# READ ALL
def get_transactions(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Transaction).offset(skip).limit(limit).all()

# READ BY ID
def get_transaction(db: Session, transaction_id: int):
    return db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()

# UPDATE
def update_transaction(db: Session, transaction_id: int, transaction_update: transaction.TransactionCreate):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_transaction:
        return None

    db_transaction.booth_id = transaction_update.booth_id
    db_transaction.total_amount = transaction_update.total_amount
    db_transaction.status = transaction_update.status

    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# DELETE
def delete_transaction(db: Session, transaction_id: int):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_transaction:
        return None
    db.delete(db_transaction)
    db.commit()
    return db_transaction
