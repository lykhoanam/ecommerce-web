import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import useActive from '../../hooks/useActive';
import productsData from '../../data/productsData';
import ProductCard from './ProductCard';
import { getProducts } from '../../api/productApi';



const TopProducts = () => {

    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const { activeClass, handleActive } = useActive(0);

    useEffect(() => {
    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setAllProducts(data);
            setProducts(data); 
        } catch (error) {
            console.error('Lỗi:', error.message);
        }
    };

    fetchProducts();
  }, []);

    const productsCategory = ['All', ...new Set(allProducts.map(item => item.category))];


    const handleProducts = (category, i) => {
        handleActive(i);
        if (category === 'All') return setProducts(allProducts);

        const filtered = allProducts.filter(item => item.category === category);
        setProducts(filtered);
    };    


    return (
        <>
            <div className="products_filter_tabs">
                <ul className="tabs">
                    {
                        productsCategory.map((item, i) => (
                            <li
                                key={i}
                                className={`tabs_item ${activeClass(i)}`}
                                onClick={() => handleProducts(item, i)}
                            >
                                {item}
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="wrapper products_wrapper">
                {
                    products.slice(0, 11).map(item => (
                        <ProductCard
                            key={item.id}
                            {...item}
                        />
                    ))
                }
                <div className="card products_card browse_card">
                    <Link to="/all-products">
                        Browse All <br /> Products <BsArrowRight />
                    </Link>
                </div>
            </div>
        </>
    );
};

export default TopProducts;