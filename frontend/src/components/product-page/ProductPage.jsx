import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";

import { ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function ProductPage() {
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [comment, setComment] = useState("");
    const [starRating, setStarRating] = useState(0); // Track the star rating
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
                const data = await response.json();
                setProduct(data);
                setSelectedVariant(data.variants[0]);
            } catch (error) {
                console.log("Problem with API connectivity", error);
            }
        };
        fetchProductData();
    }, [id]);

    const handleVariantChange = (variant) => {
        setSelectedVariant(variant);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.user.email) {
            return alert("Bạn phải đăng nhập để gửi bình luận!");
        }
        if (!comment.trim()) {
            return alert("Vui lòng nhập nội dung bình luận!");
        }
        if (starRating === 0) {
            return alert("Vui lòng chọn số sao!");
        }

        const newComment = { email: user.user.email, comment, star: starRating };

        try {
            const updatedProduct = {
                ...product,
                comments: [...(product.comments || []), newComment],
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct),
            });

            if (response.ok) {
                const data = await response.json();
                setProduct(data);
                setComment("");
                setStarRating(0); // Reset the star rating after submission
            } else {
                console.error("Failed to submit comment");
            }
        } catch (error) {
            console.error("Error submitting comment", error);
        }
    };

    const handleStarClick = (rating) => {
        setStarRating(rating);
    };

    return (
        <>
            <div className="max-w-screen-2xl mx-auto p-9 flex flex-col lg:flex-row mt-6 mb-8">
                {product ? (
                    <div className="flex flex-col lg:flex-row w-full gap-x-24 justify-center" key={product.id}>
                        <div className="flex justify-center">
                            <LazyLoadImage
                                effect="blur"
                                src={product.images}
                                alt={product.description}
                                width={400}
                                height={400}
                            />
                        </div>

                        <div className="flex flex-col w-full lg:max-w-lg">
                            <h1 className="text-3xl mb-1">{product.title}</h1>

                            {product.discount ? (
                                <div className="float-left pt-3 pb-3 border-b mb-2">
                                    <span className="line-through pr-2 text-lg">
                                        {formatPrice(selectedVariant.price)}
                                    </span>

                                    <span className="text-emerald-600 text-xl">
                                        {formatPrice(
                                            selectedVariant.price - selectedVariant.price * 0.01 * product.discount
                                        )}
                                    </span>
                                </div>
                            ) : (
                                <span className="pt-3 pb-3 border-b mb-2 text-xl">
                                    {formatPrice(selectedVariant.price)}
                                </span>
                            )}

                            <p className="pt-3 pb-3 w-full text-base">{product.description}</p>

                            <div className="pt-3 pb-3">
                                <label className="text-lg mr-2">Size:</label>
                                <select
                                    onChange={(e) =>
                                        handleVariantChange(
                                            product.variants.find(
                                                (variant) => variant.size === e.target.value
                                            )
                                        )
                                    }
                                    value={selectedVariant ? selectedVariant.size : ""}
                                    className="border p-2"
                                >
                                    {product.variants.map((variant) => (
                                        <option key={variant.size} value={variant.size}>
                                            {variant.size}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <AddToCartButton product={product} variant={selectedVariant} />
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}

                 
            </div>

            <div className="max-w-screen-lg mx-auto mt-10 px-4 md:px-0">
                <h2 className="text-2xl font-semibold mb-6">Bình luận</h2>
                <form onSubmit={handleCommentSubmit} className="mb-8">
                    {user && user.email ? (
                        <div className="flex items-center mb-4">
                            <img
                                src="https://i.ibb.co/sthmNhK/avatar-4.png"
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <p className="font-semibold text-lg">{user.email}</p>
                        </div>
                    ) : (
                        <p className="font-semibold mb-4 text-red-500">
                            Vui lòng đăng nhập để bình luận.
                        </p>
                    )}

                    <div className="flex flex-col mb-6">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Nhập bình luận của bạn..."
                            className="w-full border rounded-lg p-4 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!user || !user.email}
                            rows={4}
                        />
                        
                        {/* Star Rating UI */}
                        <div className="flex mb-4">
                        <label className="mr-4">Đánh giá:</label>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    onClick={() => handleStarClick(star)}
                                    className={`w-6 h-6 cursor-pointer ${star <= starRating ? "text-yellow-500" : "text-gray-300"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ))}
                        </div>


                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                                disabled={!user || !user.email || !comment.trim() || starRating === 0}
                            >
                                Gửi bình luận
                            </button>
                        </div>
                    </div>
                </form>

                <div className="space-y-6 mb-10">
                    {product?.comments?.length > 0 ? (
                        product.comments.map((cmt, index) => (
                            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-100 rounded-xl shadow-md">
                                <img
                                    src="https://i.ibb.co/sthmNhK/avatar-4.png"
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg">{cmt.email}</p>
                                        <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    {/* Star ratings of existing comment */}
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-6 h-6 ${star <= cmt.star ? "text-yellow-500" : "text-gray-300"}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-gray-700">{cmt.comment}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center">
                            <p className="text-gray-500">Chưa có bình luận nào.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProductPage;
