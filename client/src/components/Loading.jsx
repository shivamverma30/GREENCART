import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const Loading = () => {

    const {navigate} = useAppContext()
    let {search} = useLocation()
    const query = new URLSearchParams(search)
    const nextUrl = query.get('next');

    useEffect(()=>{
        if(nextUrl){
            setTimeout(()=>{
                navigate(`/${nextUrl}`)
            },4000)
        }
    },[nextUrl])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/30 dark:bg-black/45">
      <div className="loader-shell animate-rise flex w-full max-w-sm flex-col items-center rounded-2xl p-7 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="loader-ring absolute h-20 w-20 rounded-full"></span>
          <span className="loader-ring loader-ring-delay absolute h-14 w-14 rounded-full"></span>
          <span className="loader-dot h-3.5 w-3.5 rounded-full bg-primary"></span>
        </div>
        <p className="mt-5 text-base font-semibold text-theme-primary">Processing Payment</p>
        <p className="mt-1 text-sm text-theme-secondary">Please wait while we confirm your order securely.</p>
      </div>
    </div>
  );
};

export default Loading;
