import React, { useState, useEffect } from "react";

function TotalPrice() {
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Retrieve the cart items from localStorage
        const order = JSON.parse(localStorage.getItem("cart")) || {};
        console.log(order);

        // Calculate total price based on the order
        const total = Object.values(order).reduce((total, item) => {
            return total + (parseFloat(item.price) * parseFloat(item.quantity));
        }, 0);
        
        setTotalPrice(total.toFixed(0)); // Set the calculated total price
    }, []); // Empty dependency array means this effect runs once when the component mounts

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="sticky bottom-0 w-full bg-white p-4 shadow-lg rounded-t-xl">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Tổng cộng:</h2>
                <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
                {/* Additional text or description can go here */}
            </p>
        </div>
    );
}

export default TotalPrice;
