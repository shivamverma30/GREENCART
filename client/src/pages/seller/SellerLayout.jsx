import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { Link, NavLink, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import api from '../../utils/api';

const SellerLayout = () => {
  const {navigate, isDarkMode } = useAppContext();

  const sidebarLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: assets.order_icon },
    { name: 'Add Product', path: '/seller/add-product', icon: assets.add_icon },
    { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
    { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
  ];

  const handleLogout = async() => {
    try {
      const {data}=await api.post('/api/seller/logout');
      if(data.success){
        toast.success(data.message)
        navigate('/')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <>
      {/* Topbar */}
      <div className="seller-topbar sticky top-0 z-30 mx-3 mt-3 flex items-center justify-between rounded-2xl px-4 py-3 md:mx-4 md:px-8">
        <Link to="/">
          <span className='logo-wrap'>
            <img src={isDarkMode ? assets.logo_dark : assets.logo} alt="logo" className="cursor-pointer w-34 md:w-38" />
          </span>
        </Link>
        <div className="flex items-center gap-5 text-theme-secondary">
          <p className='font-medium text-theme-primary'>Hi! Admin</p>
          <Button variant='muted' onClick={handleLogout} className="rounded-full text-sm px-4 py-1">
            Logout
          </Button>
        </div>
      </div>

      {/* Sidebar + Main content */}
      <div className="flex gap-3 p-3">
        {/* Sidebar */}
        <div className="seller-sidebar no-scrollbar h-[calc(100vh-98px)] w-16 overflow-y-auto rounded-2xl pt-4 text-base md:w-64">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === '/seller'}
              className={({ isActive }) =>
                `seller-nav-item mx-2 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? 'seller-nav-item-active'
                    : ''
                }`
              }
            >
              <span className="seller-nav-icon-wrap">
                <img src={item.icon} alt={item.name} className="seller-nav-icon w-5 h-5" />
              </span>
              <p className="hidden font-medium md:block">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* Main Content */}
        <div className="seller-main-panel no-scrollbar min-h-[calc(100vh-98px)] flex-1 overflow-y-auto rounded-2xl p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SellerLayout;
