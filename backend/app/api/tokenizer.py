from fastapi import APIRouter
from pydantic import BaseModel
import midtransclient
import os
from dotenv import load_dotenv

load_dotenv()

SECRET = os.getenv("MIDTRANS_SECRET")
NEXT_PUBLIC_CLIENT = os.getenv("MIDTRANS_CLIENT")

snap = midtransclient.Snap(
    is_production=False,
    server_key=SECRET,
    client_key=NEXT_PUBLIC_CLIENT
)

class TransactionRequest(BaseModel):
    order_id: str
    totalAmount: int
    username: str

router = APIRouter(prefix="/payment", tags=["Payment"])

@router.post("/create-transaction")
def create_transaction(request: TransactionRequest):
    try:
        param = {
            "transaction_details": {
                "order_id": request.order_id,
                "gross_amount": request.totalAmount
            },
            "customer_details": {
                "first_name": request.username,
            }
        }

        transaction = snap.create_transaction(param)
        return {
            "snap_token": transaction["token"],
            "redirect_url": transaction["redirect_url"]
        }
    except Exception as e:
        return {"error": str(e)}