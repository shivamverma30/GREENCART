import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { Link, NavLink, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerLayout = () => {
  const {axios,navigate } = useAppContext();

  const sidebarLinks = [
    { name: 'Add Product', path: '/seller', icon: assets.add_icon },
    { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
    { name: 'Orders', path: '/seller/orders', icon: assets.order_icon }, 
  ];

  const handleLogout = async() => {
    try {
      const {data}=await axios.post('/api/seller/logout');
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
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <img src={assets.logo} alt="logo" className="cursor-pointer w-34 md:w-38" />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button onClick={handleLogout} className="border rounded-full text-sm px-4 py-1">
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar + Main content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col bg-white">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === '/seller'}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 transition-all ${
                  isActive
                    ? 'border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary'
                    : 'hover:bg-gray-100/90 border-white'
                }`
              }
            >
              <img src={item.icon} alt={item.name} className="w-7 h-7" />
              <p className="md:block hidden">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 bg-gray-50 min-h-[95vh]">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SellerLayout;
