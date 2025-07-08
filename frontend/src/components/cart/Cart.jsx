import React, { useState, useEffect } from "react";
import TotalPrice from "./TotalPrice";
import CartTable from "./CartTable";
import CheckOutButton from "./CheckOutButton.jsx";
import TitleMessage from "./TitleMessage";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchCartData = async () => {
            if (!user || !user._id) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${user._id}`);
                if (!res.ok) throw new Error("Failed to fetch cart");

                const cartData = await res.json();
                const items = cartData.items || [];

                const enriched = await Promise.all(items.map(async (item) => {
                    try {
                        const prodRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${item.productId}`);
                        if (!prodRes.ok) throw new Error("Product not found");
                        const product = await prodRes.json();

                        // Get variant price by size
                        const selectedVariant = product.variants?.find(v => v.size === item.size);
                        const price = selectedVariant ? selectedVariant.price : 0;

                        return {
                            ...item,
                            product,
                            price: price,
                        };
                    } catch (err) {
                        console.error("Error fetching product:", err);
                        return item;
                    }
                }));

                setCartItems(enriched);
                localStorage.setItem("cart", JSON.stringify(enriched));
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchCartData();
    }, [user]);

    return (
        <div className="max-w-screen-2xl mx-auto p-9 flex-col pt-24">
            <TitleMessage />
            {cartItems.length > 0 ? (
                <>
                    <CartTable cartItems={cartItems} setCartItems={setCartItems} />
                    <div className="flex flex-col items-end justify-between text-right w-11/12 md:w-4/5 mx-auto">
                        <TotalPrice cartItems={cartItems} />
                        <CheckOutButton cartItems={cartItems} />
                    </div>
                </>
            ) : (
                <p className="text-center mb-32">Your cart is empty. Please add items to the cart.</p>
            )}
        </div>
    );
}

export default Cart;
