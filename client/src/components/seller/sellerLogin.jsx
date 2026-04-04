import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate,axios} = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    try{
      event.preventDefault();
      const {data}= await axios.post('/api/seller/login',{email,password})
      if(data.success){
        setIsSeller(true)
        navigate('/seller')
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
            className="seller-input mt-1 w-full rounded p-2 outline-primary"
            required
          />
        </div>

        <div className="w-full">
          <p className='text-theme-primary'>Password</p>
          <input
            type="password"
            placeholder="enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="seller-input mt-1 w-full rounded p-2 outline-primary"
            required
          />
        </div>

        <button className='bg-primary text-white w-full py-2 rounded-md cursor-pointer'>
          Login
        </button>
      </div>
    </form>
  );
};

export default SellerLogin;
