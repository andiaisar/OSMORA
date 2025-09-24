import React, { useState } from "react";
import { frame } from "../libs/produk";

const Checkout = () => {
    const [quantity, setQuantity] = useState(1);

    const decreaseQuantity = () => {
        setQuantity((prevState) => (prevState > 1 ? prevState - 1 : 1));
    };

    const increaseQuantity = () => {
        setQuantity((prevState) => prevState + 1);
    };

    const checkout = async () => {
        const data = {
            id: frame.id,
            productName: frame.name,
            amount: quantity,
            price: frame.price,
        }

        const response = await fetch("/api/tokenizer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        window.snap.pay(result.token)
    };
    
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex sm:gap-4">
                    <button
                        className="transition-all hover:opacity-75"
                        onClick={decreaseQuantity}
                    >
                        ➖
                    </button>

                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        className="h-10 w-16 text-black border-transparent text-center"
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />

                    <button
                        className="transition-all hover:opacity-75"
                        onClick={increaseQuantity}
                    >
                        ➕
                    </button>
                </div>
                <button
                    className="rounded bg-indigo-500 p-4 text-sm font-medium transition hover:scale-105"
                    onClick={checkout}
                >
                    Checkout
                </button>
            </div>
        </>
    );
};

export default Checkout;