import { toast, ToastOptions } from 'react-toastify';

// Default configuration for toasts
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

// Toast notification types
export const notify = {
  success: (message: string, options?: ToastOptions) => 
    toast.success(message, { ...defaultOptions, ...options }),
  
  error: (message: string, options?: ToastOptions) => 
    toast.error(message, { ...defaultOptions, ...options }),
  
  info: (message: string, options?: ToastOptions) => 
    toast.info(message, { ...defaultOptions, ...options }),
  
  warning: (message: string, options?: ToastOptions) => 
    toast.warning(message, { ...defaultOptions, ...options }),
};
