import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import commonContext from '../../contexts/common/commonContext';
import useForm from '../../hooks/useForm';
import useOutsideClose from '../../hooks/useOutsideClose';
import useScrollDisable from '../../hooks/useScrollDisable';
import {validateLogin, validateSignup } from './formValidator';
import { FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';

const AccountForm = () => {

    const { isFormOpen, toggleForm, formMode, setFormMode } = useContext(commonContext);
    const { inputValues, handleInputValues, handleFormSubmit } = useForm();
    const [errors, setErrors] = useState({});

    const formRef = useRef();

    useOutsideClose(formRef, () => {
        toggleForm(false);
    });

    useScrollDisable(isFormOpen);

    // const [isSignupVisible, setIsSignupVisible] = useState(false);
    const isSignupVisible = formMode === 'signup';

    // // Signup-form visibility toggling
    // const handleIsSignupVisible = () => {
    //     setIsSignupVisible(prevState => !prevState);
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = isSignupVisible
            ? validateSignup(inputValues)
            : validateLogin(inputValues);

        console.log("Validation errors:", validationErrors);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            console.log('Submitting form with:', inputValues);
            handleFormSubmit(isSignupVisible);
        }
    };


    return (
        <>
            {
                isFormOpen && (
                    <div className="backdrop">
                        <div className="modal_centered">
                            <form id="account_form" ref={formRef} onSubmit={handleSubmit}>

                                {/*===== Form-Header =====*/}
                                <div className="form_head">
                                    <h2>{isSignupVisible ? 'Signup' : 'Login'}</h2>
                                    <p>
                                        {isSignupVisible ? 'Already have an account ?' : 'New to LKN Privé ?'}
                                        &nbsp;&nbsp;
                                        <button type="button" onClick={() => setFormMode(isSignupVisible ? 'login' : 'signup')}>
                                            {isSignupVisible ? 'Login' : 'Create an account'}
                                        </button>

                                    </p>
                                </div>

                                {/*===== Form-Body =====*/}
                                <div className="form_body">
                                    {
                                        isSignupVisible && (
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="input_field"
                                                    value={inputValues.name || ''}
                                                    onChange={handleInputValues}
                                                    style={{color:'black'}}
                                                    
                                                />
                                                <label className="input_label">Full Name</label>
                                            </div>
                                        )
                                    }

                                    <div className="input_box">
                                        <input
                                            type="email"
                                            name="email"
                                            className="input_field"
                                            value={inputValues.email || ''}
                                            onChange={handleInputValues}
                                            style={{color:'black'}}
                                            required
                                        />
                                        <label className="input_label">Email</label>
                                    </div>

                                    <div className="input_box">
                                        <input
                                            type="password"
                                            name="password"
                                            className="input_field"
                                            value={inputValues.password || ''}
                                            onChange={handleInputValues}
                                            style={{color:'black'}}
                                            required
                                        />
                                        <label className="input_label">Password</label>
                                    </div>

                                    {
                                        isSignupVisible && (
                                            <div className="input_box">
                                                <input
                                                    type="password"
                                                    name="conf_password"
                                                    className="input_field"
                                                    value={inputValues.conf_password || ''}
                                                    onChange={handleInputValues}
                                                    style={{color:'black'}}
                                                    required
                                                />
                                                <label className="input_label">Confirm Password</label>
                                            </div>
                                        )
                                    }

                                    {Object.keys(errors).length > 0 && (
                                        <div style={{ color: 'red' }}>
                                            {errors.name && <div style={{ marginBottom: '8px' }}>{errors.name}</div>}
                                            {errors.email && <div style={{ marginBottom: '8px' }}>{errors.email}</div>}
                                            {errors.password && <div style={{ marginBottom: '8px' }}>{errors.password}</div>}
                                            {errors.conf_password && <div>{errors.conf_password}</div>}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn login_btn"
                                    >
                                        {isSignupVisible ? 'Signup' : 'Login'}
                                    </button>

                                </div>

                                {/*===== Form-Footer =====*/}
                                <div className="form_foot">
                                    <p style={{ textAlign: 'center' }}>or login with</p>
                                    <div style={{
                                        display: 'flex',
                                        gap: '15px',
                                        justifyContent: 'center',
                                        marginTop: '10px'
                                    }}>
                                        <Link to="/"
                                            style={{
                                                background: '#3b5998',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '18px',
                                                textDecoration: 'none'
                                            }}
                                            title="Login with Facebook"
                                        >
                                            <FaFacebookF />
                                        </Link>

                                        <Link to="/"
                                            style={{
                                                background: '#db4a39',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '18px',
                                                textDecoration: 'none'
                                            }}
                                            title="Login with Google"   
                                        >
                                            <FaGoogle />
                                        </Link>

                                        <Link to="/"
                                            style={{
                                                background: '#1DA1F2',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '18px',
                                                textDecoration: 'none'
                                            }}
                                            title="Login with Twitter"
                                        >
                                            <FaTwitter />
                                        </Link>
                                    </div>
                                </div>

                                {/*===== Form-Close-Btn =====*/}
                                <div
                                    className="close_btn"
                                    title="Close"
                                    style={{background:'white', color: 'black', fontSize:' 30px', marginTop:'10px', marginRight:'10px'}}
                                    onClick={() => toggleForm(false)}
                                >
                                    &times;
                                </div>

                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default AccountForm;