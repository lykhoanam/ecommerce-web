import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Success message
export const showSuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    theme: 'colored',
  });
};

// Error message
export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    theme: 'colored',
  });
};

// Info message
export const showInfo = (message) => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 3000,
    theme: 'colored',
  });
};
