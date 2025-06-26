import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser} from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { dropdownMenu } from '../../data/headerData';
import commonContext from '../../contexts/common/commonContext';
import cartContext from '../../contexts/cart/cartContext';
import AccountForm from '../form/AccountForm';
import SearchBar from './SearchBar';
import {showSuccess} from '../../utils/toastMessage';

const Header = () => {

    const { formUserInfo, toggleForm, toggleSearch, setFormMode } = useContext(commonContext);
    const { cartItems } = useContext(cartContext);
    const [isSticky, setIsSticky] = useState(false);


    // handle the sticky-header
    useEffect(() => {
        const handleIsSticky = () => window.scrollY >= 50 ? setIsSticky(true) : setIsSticky(false);

        window.addEventListener('scroll', handleIsSticky);

        return () => {
            window.removeEventListener('scroll', handleIsSticky);
        };
    }, [isSticky]);


    const cartQuantity = cartItems.length;


    return (
        <>
            <header id="header" className={isSticky ? 'sticky' : ''}>
                <div className="container">
                    <div className="navbar">
                        <h2 className="nav_logo">
                            <Link to="/">LKN Privé </Link>
                        </h2>
                        <nav className="nav_actions">
                            <div className="search_action">
                                <span onClick={() => toggleSearch(true)}>
                                    <AiOutlineSearch />
                                </span>
                                <div className="tooltip">Search</div>
                            </div>

                            <div className="cart_action">
                                <Link to="/cart">
                                    <AiOutlineShoppingCart />
                                    {
                                        cartQuantity > 0 && (
                                            <span className="badge">{cartQuantity}</span>
                                        )
                                    }
                                </Link>
                                <div className="tooltip">Cart</div>
                            </div>

                            <div className="user_action">
                                <span>
                                {formUserInfo ? (
                                    <span
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: '#f0c040',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textTransform: 'uppercase',
                                            fontSize: '16px',
                                        }}
                                        title={formUserInfo}
                                        >
                                            {formUserInfo.charAt(0)}
                                        </span>
                                    ) : (
                                        <AiOutlineUser style={{ fontSize: '22px', color: '#888' }} title="Account" />
                                    )}
                                </span>

                                    <div
                                        className="dropdown_menu"
                                        style={{
                                            background: '#fff',
                                            borderRadius: '10px',
                                            padding: '15px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            width: '220px',
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            zIndex: 1000,
                                        }}
                                    >

                                    <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '16px', fontWeight: '600' }}>
                                            Hi, {formUserInfo ? formUserInfo : 'Guest'}
                                        </span>
                                        {formUserInfo && (
                                            <FiLogOut
                                            title="Logout"
                                            onClick={() => {
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('user');
                                                showSuccess('Đăng xuất thành công!');
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 500);    
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                color: '#ff4d4f',
                                                fontSize: '18px',
                                            }}
                                            />
                                        )}
                                    </h4>


                                    {formUserInfo ? (
                                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                                        Manage your orders and account
                                    </p>
                                    ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0' }}>
                                        <button
                                        onClick={() => {
                                            toggleForm(true);
                                            setFormMode('login');
                                        }}
                                        style={{
                                            flex: 1,
                                            marginRight: '6px',
                                            border: '1px solid orange',
                                            background: 'white',
                                            padding: '6px 0',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            color: 'orange',
                                            fontWeight: '500',
                                        }}
                                        >
                                        Login
                                        </button>
                                        <button
                                        onClick={() => {
                                            toggleForm(true);
                                            setFormMode('signup');
                                        }}
                                        style={{
                                            flex: 1,
                                            marginLeft: '6px',
                                            border: '1px solid black',
                                            background: 'black',
                                            color: 'white',
                                            padding: '6px 0',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                        }}
                                        >
                                        Sign Up
                                        </button>
                                    </div>
                                    )}        
                                    

                                    <div className="separator"></div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {dropdownMenu.map(({ id, link, path }) => (
                                            <li key={id}>
                                            <Link
                                                to={path}
                                                style={{
                                                display: 'block',
                                                padding: '8px 10px',
                                                color: '#333',
                                                textDecoration: 'none',
                                                borderRadius: '6px',
                                                transition: 'background 0.3s',
                                                }}
                                                onMouseEnter={(e) => (e.target.style.background = '#f5f5f5')}
                                                onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                                            >
                                                {link}
                                            </Link>
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            <SearchBar />
            <AccountForm />
        </>
    );
};

export default Header;