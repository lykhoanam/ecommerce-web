import React from "react";
import { useNavigate } from "react-router-dom";

function CheckOutButton() {
    const navigate = useNavigate();

    const handleCheckOut = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const cart = JSON.parse(localStorage.getItem("cart"));
        console.log(cart)
        navigate("/checkout", {
            state: {
                user,
                cart
            }
        });
    };

    return (
        <button
            type="button"
            className="washed-gray-bg hover:bg-gray-700 text-white font-bold py-2 px-4 mb-8 w-48 mt-8"
            onClick={handleCheckOut}  
        >
            Thanh toán
        </button>
    );
}

export default CheckOutButton;
