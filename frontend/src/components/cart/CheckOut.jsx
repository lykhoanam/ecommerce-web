import React, { useState, useEffect } from "react";
import { useLocation, useNavigate  } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CheckOut() {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        paymentMethod: "COD",
    });
    const [currentStep, setCurrentStep] = useState(1); // Track the current step
    const [shippingMethod, setShippingMethod] = useState("Tiết kiệm"); // Default shipping method
    const [shippingCost, setShippingCost] = useState(20000); // Default shipping cost

    // Retrieve user and cart data passed via location state
    const location = useLocation();
    const { user: userData, cart: cartData } = location.state || {};  // Destructure user and cart data

    useEffect(() => {
        if (userData) {
            setUser(userData);
            setFormData({
                name: userData.name || "",
                address: userData.address || "",
                phone: userData.phone || "",
                email: userData.email || "",
                paymentMethod: "COD", // default payment method
            });
        }

        if (cartData) {
            // Convert cartData object to an array for proper rendering
            const cartArray = Object.values(cartData);
            console.log(cartArray)
            setCartItems(cartArray);
        }
    }, [userData, cartData]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleShippingChange = (e) => {
        const method = e.target.value;
        setShippingMethod(method);

        // Update shipping cost based on selected method
        const cost = method === "Nhanh" ? 40000 : 20000; // Example costs
        setShippingCost(cost);
    };

    const calculateTotal = () => {
        const itemsTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        return itemsTotal + shippingCost;
    };

    const submitOrder = async (orderData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit order');
            }
    
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error submitting order:', error);
            throw error; // Re-throw the error if needed
        }
    };
    

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        // Prepare the order data
        const orderData = {
            user: {
                fullName: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
            },
            paymentMethod: formData.paymentMethod,
            shippingMethod,
            shippingCost,
            cartItems: cartItems.map(item => ({
                image:item.image,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                selectedSize: item.selectedSize,
            })),
            total: calculateTotal(),
        };
    
        try {
            // Call the API to submit the order
            const result = await submitOrder(orderData);
            console.log('Order submitted successfully:', result);
            
            toast.success("Đặt hàng thành công!")

            localStorage.removeItem('cart');  // This will remove the cart data from localStorage
            localStorage.removeItem('order');
            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 2000);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xác nhận đơn hàng');
        }
    };
    
    
    

    const goToNextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const goToPreviousStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h2 className="text-3xl font-semibold text-center mb-8">Thanh toán</h2>

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Customer Information / Shipping & Payment Information */}
                <div className="customer-info col-span-1 bg-gray-50 p-6 rounded-lg shadow-md">
                    {/* Step 1: Customer Info */}
                    {currentStep === 1 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>

                            {/* Full Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${userData ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    required
                                    disabled={!!userData}
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${userData ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    required
                                    disabled={!!userData}
                                />
                            </div>

                            {/* Phone */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleFormChange}
                                    className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${userData ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    required
                                    disabled={!!userData}
                                />
                            </div>

                            {/* Next Button */}
                            <div className="text-center mt-8">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-black py-3 px-6 rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={goToNextStep}
                                >
                                    Tiếp theo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Shipping & Payment Info */}
                    {currentStep === 2 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Địa chỉ và Phương thức thanh toán</h3>

                            {/* Address */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Hình thức thanh toán</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Cash">Tiền mặt</option>
                                    <option value="Momo">Momo</option>
                                </select>
                            </div>

                            {/* Shipping Method */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Phương thức vận chuyển</label>
                                <select
                                    name="shippingMethod"
                                    value={shippingMethod}
                                    onChange={handleShippingChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Tiết kiệm">Tiết kiệm (20,000 VND)</option>
                                    <option value="Nhanh">Nhanh (40,000 VND)</option>
                                </select>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-3 px-6 rounded-md shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    onClick={goToPreviousStep}
                                >
                                    Quay lại
                                </button>
                                <button
                                    type="button"
                                    className="bg-orange-500 text-black py-3 px-6 rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={goToNextStep}
                                >
                                    Tiếp theo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review and Confirm Order */}
                    {currentStep === 3 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Xác nhận đơn hàng</h3>

                            <div className="mb-4">
                                <h4 className="font-semibold">Thông tin khách hàng</h4>
                                <p>Họ tên: {formData.name}</p>
                                <p>Email: {formData.email}</p>
                                <p>Số điện thoại: {formData.phone}</p>
                                <p>Địa chỉ: {formData.address}</p>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold">Phương thức thanh toán</h4>
                                <p>{formData.paymentMethod}</p>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold">Phương thức vận chuyển</h4>
                                <p>{shippingMethod} - {formatPrice(shippingCost)}</p>
                            </div>

                            <div className="text-center mt-8">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-black py-3 px-6 rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Xác nhận đơn hàng
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div className="order-summary col-span-1 bg-gray-50 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h3>
                    {cartItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                            <img src={item.product.images} alt={item.product.title} className="w-16 h-16 object-cover mr-4" />

                            <div className="flex-1">
                                <span className="font-medium">{item.product.title} x {item.quantity}</span>
                                {/* Display selectedSize if it exists */}
                                {item.selectedSize && <div className="text-sm text-gray-500">Size: {item.selectedSize}</div>}
                            </div>

                            <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                    ))}


                    <div className="flex justify-between mb-4">
                        <span>Phí vận chuyển</span>
                        <span>{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Tổng cộng</span>
                        <span>{formatPrice(calculateTotal())}</span>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CheckOut;
