import React, { useState, useEffect } from "react";

const ProductFiltering = ({ products, setFilteredProducts, selectedSize, setSelectedSize }) => {
    const [price, setPrice] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // 👉 Tự động lọc mỗi khi có thay đổi
    useEffect(() => {
        validate();
    }, [price, searchTerm, selectedSize, products]);

    // 👉 Lọc dữ liệu dựa trên search, price, size
    const validate = () => {
        let filtered = products;

        // Lọc theo tên
        if (searchTerm.trim()) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc theo size
        if (selectedSize) {
            filtered = filtered.filter(product =>
                product.variants?.some(variant => variant.size === selectedSize)
            );
        }

        // Lọc theo giá
        if (price.minValue != null && price.maxValue != null) {
            filtered = filtered.filter(product => {
                const variant = product.variants?.find(v => v.size === selectedSize) ||
                                product.variants?.[0];
                const productPrice = variant?.price || 0;
                return productPrice >= price.minValue && productPrice <= price.maxValue;
            });
        }

        setFilteredProducts({
            products: filtered,
            isFiltered: filtered.length < products.length,
        });
    };

    // 👉 Lấy danh sách size duy nhất
    const getAvailableSizes = () => {
        const sizes = products
            .flatMap(product => product.variants?.map(variant => variant.size))
            .filter(Boolean);
        return [...new Set(sizes)];
    };

    // 👉 Lấy toàn bộ giá để tìm min/max
    const getPrices = () => {
        return products.flatMap(product =>
            product.variants?.map(variant => variant.price) || []
        );
    };

    const getMinProductPrice = () => {
        const prices = getPrices();
        return prices.length ? Math.min(...prices) : 0;
    };

    const getMaxProductPrice = () => {
        const prices = getPrices();
        return prices.length ? Math.max(...prices) : 0;
    };

    // 👉 Format giá hiển thị
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    // 👉 Handler
    const handlePriceFilter = (event) => {
        setPrice({
            ...price,
            [event.target.name]: Number(event.target.value),
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSizeFilter = (event) => {
        setSelectedSize(event.target.value);
    };

    return (
        <div className="sticky top-36 z-9">
            <div className="flex justify-between">
                <h2 className="text-2xl lg:text-4xl font-light mb-6">Tìm kiếm</h2>
                <div className="block lg:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400">
                        <svg className={`w-5 h-5 text-gray-800 ${isOpen ? "hidden" : "block"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1" />
                        </svg>
                        <svg className={`fill-current h-5 w-5 ${isOpen ? "block" : "hidden"}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={`lg:flex lg:flex-col ${isOpen ? "block" : "hidden"}`}>
                <div className="border-t border-gray-200 p-3 pt-5 pb-5">

                    {/* FILTER THEO GIÁ */}
                    <span>Theo giá:</span>
                    <div className="mb-4 mt-4 grid gap-4 grid-flow-col md:w-60">
                        <div className="md:w-28">
                            <span className="block text-sm mb-2">Từ</span>
                            <input
                                type="number"
                                placeholder={formatPrice(getMinProductPrice())}
                                className="border border-black w-full p-2 text-sm"
                                name="minValue"
                                onChange={handlePriceFilter}
                            />
                        </div>
                        <div className="md:w-28">
                            <span className="block text-sm mb-2">Đến</span>
                            <input
                                type="number"
                                placeholder={formatPrice(getMaxProductPrice())}
                                className="border border-black w-full p-2 text-sm"
                                name="maxValue"
                                onChange={handlePriceFilter}
                            />
                        </div>
                    </div>

                    {/* FILTER THEO TÊN */}
                    <span>Theo tên:</span>
                    <div className="mt-4 mb-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Tìm theo tên..."
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 transition-all duration-300"
                        />
                    </div>

                    {/* FILTER THEO SIZE */}
                    <label className="block text-sm font-medium mb-2">Theo kích thước:</label>
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                    >
                    <option value="">-- Tất cả --</option>
                        {getAvailableSizes().map((size) => (
                            <option key={size} value={size}>
                            {size}
                            </option>
                        ))}
                    </select>   


                </div>
            </div>
        </div>
    );
};

export default ProductFiltering;
