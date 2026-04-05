import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { isRequired, isValidEmail, sanitizeInput } from '../../utils/validation';

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = {
    ...(isRequired(email) ? {} : { email: 'Email is required' }),
    ...(isRequired(email) && !isValidEmail(email) ? { email: 'Please enter a valid email address' } : {}),
    ...(isRequired(password) ? {} : { password: 'Password is required' }),
  };
  const isFormValid = Object.keys(errors).length === 0;

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const inputClass = (field) => {
    const showError = Boolean(errors[field]) && (submitAttempted || touched[field]);
    return `seller-input mt-1 w-full rounded p-2 outline-primary ${showError ? 'border border-red-500 bg-red-50' : ''}`;
  };

  const onSubmitHandler = async (event) => {
    try{
      event.preventDefault();
      setSubmitAttempted(true);

      if (!isFormValid) {
        toast.error('Please fix form errors before submitting');
        return;
      }

      const {data}= await api.post('/api/seller/login',{
        email: sanitizeInput(email),
        password: sanitizeInput(password),
      })
      if(data.success){
        setIsSeller(true)
        navigate('/seller')
        setSubmitAttempted(false)
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller]);

  return !isSeller && (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-theme-secondary'>
      <div className="seller-form-card flex min-w-80 flex-col items-start gap-5 p-8 py-12 shadow-xl sm:min-w-88 m-auto">
        <p className="m-auto text-2xl font-medium text-theme-primary">
          <span className="text-primary">Seller</span> Login
        </p>

        <div className="w-full">
          <p className='text-theme-primary'>Email</p>
          <input
            placeholder="enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => markTouched('email')}
            className={inputClass('email')}
            type="email"
            required
          />
          {errors.email && (submitAttempted || touched.email) && (
            <p className='mt-1 text-xs text-red-600'>{errors.email}</p>
          )}
        </div>

        <div className="w-full">
          <p className='text-theme-primary'>Password</p>
          <input
            type="password"
            placeholder="enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => markTouched('password')}
            className={inputClass('password')}
            required
          />
          {errors.password && (submitAttempted || touched.password) && (
            <p className='mt-1 text-xs text-red-600'>{errors.password}</p>
          )}
        </div>

        <button
          disabled={!isFormValid}
          className='bg-primary text-white w-full py-2 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default SellerLogin;
