import { useContext, useState } from 'react';
import commonContext from '../contexts/common/commonContext';
import { showSuccess, showError } from '../utils/toastMessage';
import {registerUser, loginUser} from '../api/userApi';

const useForm = () => {
    const { toggleForm, setFormUserInfo } = useContext(commonContext);
    const [inputValues, setInputValues] = useState({});
    const [errors, setErrors] = useState({});

    // handling input-values
    const handleInputValues = (e) => {
        const { name, value } = e.target;
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleFormSubmit = async (isSignup = false) => {
        console.log('Submitting form with:', inputValues);

        try {
            const data = isSignup
                ? await registerUser(inputValues)
                : await loginUser(inputValues);

            showSuccess(isSignup ? 'Đăng ký thành công!' : 'Đăng nhập thành công!');

            localStorage.setItem('token', data.token);

            if (!isSignup && data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setFormUserInfo(data.user.name || data.user.email);
            }

            setInputValues({});
            toggleForm(false);
        } catch (err) {
            console.error('[Form Submit Error]', err);
            showError(err.message || 'Lỗi kết nối máy chủ');
        }
    };


    return { inputValues, handleInputValues, handleFormSubmit, errors };
};

export default useForm;
