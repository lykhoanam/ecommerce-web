import React, { useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../../App";

function CartTable({ cartItems, setCartItems }) {
    const [cartCounter, setCartCounter] = useContext(Context);
    const user = JSON.parse(localStorage.getItem("user"));

    const formatPrice = (price) => new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price || 0);

    const setLocalStorage = (updatedCart) => {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleQuantityChange = async (e, itemId) => {
        const quantity = Math.max(Number(e.target.value), 1);

        const updatedCart = cartItems.map(item =>
            item._id === itemId ? { ...item, quantity } : item
        );

        setCartItems(updatedCart);
        setLocalStorage(updatedCart);

        const currentItem = updatedCart.find(item => item._id === itemId);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${user._id}/update/${currentItem.productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity }),
            });

            if (res.ok) toast.success("Cập nhật số lượng thành công");
            else toast.error("Lỗi khi cập nhật số lượng");
        } catch {
            toast.error("Lỗi kết nối");
        }
    };

    const handleRemove = async (itemId) => {
        const itemToRemove = cartItems.find(item => item._id === itemId);
        const updatedCart = cartItems.filter(item => item._id !== itemId);

        setCartItems(updatedCart);
        setLocalStorage(updatedCart);
        setCartCounter(updatedCart.length);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${user._id}/remove/${itemToRemove.productId}`, {
                method: "DELETE",
            });

            if (res.ok) toast.success("Xóa sản phẩm thành công");
            else toast.error("Lỗi khi xóa sản phẩm");
        } catch {
            toast.error("Lỗi kết nối khi xóa sản phẩm");
        }
    };

    return (
        <table className="w-11/12 md:w-4/5 mx-auto">
            <thead className="border-b">
                <tr className="text-left">
                    <th className="py-3 font-normal">Sản phẩm</th>
                    <th className="py-3 font-normal">Size</th>
                    <th className="py-3 font-normal">Số lượng</th>
                    <th className="py-3 font-normal text-right w-1/4">Tổng</th>
                    <th></th>
                </tr>
            </thead>
            <tbody className="border-b">
                {cartItems.map(item => {
                    const product = item.product || {};
                    const price = item.price || 0;

                    return (
                        <tr key={item._id} className="border-b">
                            <td className="py-10">
                                <div className="flex items-center">
                                    <img
                                        src={product.images}
                                        alt={product.title}
                                        width={100}
                                        height={100}
                                        className="mr-4"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-lg font-medium text-gray-900">{product.title}</span>
                                        <span className="pt-2">{formatPrice(price)}</span>
                                    </div>
                                </div>
                            </td>

                            <td className="py-10">
                                <span className="border px-3 py-1 rounded bg-gray-100">{item.size}</span>
                            </td>

                            <td className="py-10">
                                <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(e, item._id)}
                                    className="border border-gray-300 px-4 py-1 rounded text-center w-16"
                                />
                            </td>

                            <td className="py-10 text-right">
                                <span className="font-medium text-gray-900">
                                    {formatPrice(price * item.quantity)}
                                </span>
                            </td>

                            <td className="py-10 text-right">
                                <button
                                    onClick={() => handleRemove(item._id)}
                                    className="text-red-600 ml-4"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
             
        </table>
    );
}

export default CartTable;
