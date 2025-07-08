import React, { useState, useEffect } from "react";
import ProductSorting from "./ProductSorting";
import ProductFiltering from "./ProductFiltering";
import AddToCartButton from "./AddToCartButton";
import ProductCounter from "./ProductCounter";
import StarRatings from "./StarRatings";
import { ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ITEMS_PER_PAGE = 12;
const INITIAL_PAGE_COUNT = 1;

function ProductGrid({ category }) {
    const [products, setProducts] = useState([]); 
    const [sortedProducts, setSortedProducts] = useState({});
    const [filteredProducts, setFilteredProducts] = useState({});
    const [pageCount, setPageCount] = useState(INITIAL_PAGE_COUNT);
    const [productData, setProductData] = useState({
        products: [],
        isDataLoaded: false,
    });

    const [selectedSize, setSelectedSize] = useState("50ml"); // Default size

    useEffect(() => {
        const fetchPerfumes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/get`);
                const data = await response.json();
                setProductData({ products: data, isDataLoaded: true });
                setProducts(data);
            } catch (error) {
                console.error("Error fetching perfumes:", error);
            }
        };

        fetchPerfumes();
    }, []);

    useEffect(() => {
        validate();
    }, [sortedProducts, filteredProducts, productData, selectedSize]);  // Add selectedSize here to re-validate when it changes

    const getCategoryProducts = () => {
        if (!category) return productData.products;
        return productData.products.filter((product) => product.category === category);
    };  


    const validate = () => {
        if (sortedProducts.isSorted && !filteredProducts.isFiltered) {
            return setProducts(sortedProducts.products);
        }

        if (filteredProducts.isFiltered && !sortedProducts.isSorted) {
            return setProducts(filteredProducts.products);
        }

        if (sortedProducts.isSorted && filteredProducts.isFiltered) {
            return setProducts(
                sortedProducts.products.filter((product) =>
                    filteredProducts.products.some(
                        (filteredProduct) => filteredProduct.id == product.id
                    )
                )
            );
        }

        return setProducts(getCategoryProducts());
    };

    const handleLoadMore = () => {
        setPageCount((prevPageCount) => prevPageCount + 1);
    };

    const getPaginatedData = () => {
        const startIndex = (pageCount - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return products.slice(0, endIndex);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <>
            <div className="max-w-screen-2xl mx-auto p-9 flex flex-col md:flex-col lg:flex-row">
                <div className="flex flex-col relative lg:mr-8 mb-5 lg:mb-0">
                    <ProductFiltering
                        products={getCategoryProducts()}
                        setFilteredProducts={setFilteredProducts}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}  // Pass down selectedSize and setSelectedSize
                    />
                </div>

                <div className="flex flex-col w-full">
                    <div className="flex justify-end sm:justify-between items-center text-sm mb-2">
                        <div className="hidden sm:block">
                            <ProductCounter total={getCategoryProducts().length} />
                        </div>

                        <ProductSorting products={getCategoryProducts()} setSortedProducts={setSortedProducts} />
                    </div>

                    <div className="min-h-[80%]">
                        <ul className="mt-2 mb-12 product-list grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {getPaginatedData().map((product) => {
                                const variant = product.variants?.find((v) => v.size === selectedSize);
                                const displayPrice = variant ? variant.price : product.variants[0]?.price;
                                return (
                                    <li key={product._id} className="flex flex-col product-item justify-between items-center bg-white shadow-md rounded-lg p-4">
                                        <a href={`products/${product._id}`} className="hover:underline flex flex-col items-center">
                                            <LazyLoadImage
                                                effect="blur"
                                                src={product.images}
                                                alt={product.description}
                                                className="w-full h-auto aspect-[1/1] max-w-[80%] mx-auto"
                                            />
                                            <span className="text-base text-center mt-2">{product.title}</span>
                                        </a>

                                        {product.discount ? (
                                            <div className="float-left">
                                                <span className="text-base line-through pr-2">{formatPrice(displayPrice)}</span>
                                                <span className="text-emerald-600 text-lg">{formatPrice(displayPrice - displayPrice * 0.01 * product.discount)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-lg">{formatPrice(displayPrice)}</span>
                                        )}

                                        <AddToCartButton product={product} selectedSize={selectedSize} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="flex justify-center mx-auto">
                        <div className="d-grid text-center">
                            <div className="text-sm p-6">
                                <ProductCounter count={getPaginatedData().length} total={getCategoryProducts().length} />
                            </div>

                            {products.length > pageCount * ITEMS_PER_PAGE && (
                                <button onClick={handleLoadMore} className="text-black border bg-white font-normal py-2 px-8 mb-8">
                                    Load More
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

             
        </>
    );
}

export default ProductGrid;
