import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import Button from './ui/Button';
import api from '../utils/api';

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const closeTimeoutRef = React.useRef(null);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    getCartCount
  } = useAppContext();

  const logout = async () => {
    try {
      const {data} = await api.get('/api/user/logout')
      if (data.success) {
        toast.success(data.message)
         setUser(null);
         navigate('/');
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products');
    }
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const openProfileMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const closeProfileMenuWithDelay = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  };

  return (
    <nav className="navbar-shell sticky top-0 z-40 flex items-center justify-between px-6 py-4 md:px-16 lg:px-24 xl:px-32 transition-all">
      <NavLink to='/' onClick={() => setOpen(false)}>
        <span className='logo-wrap'>
          <img className="h-9" src={isDarkMode ? assets.logo_dark : assets.logo} alt="GreenCart logo" />
        </span>
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8 text-theme-primary">
        <NavLink to='/' className={({ isActive }) => isActive ? 'text-primary font-medium nav-link-theme' : 'nav-link-theme'}>Home</NavLink>
        <NavLink to='/products' className={({ isActive }) => isActive ? 'text-primary font-medium nav-link-theme' : 'nav-link-theme'}>All Product</NavLink>
        <NavLink to='/' className='nav-link-theme'>Contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-white/25 px-3 rounded-full bg-white/60 dark:bg-white/5 w-72">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none text-theme-primary placeholder:text-theme-secondary"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className='icon-theme w-4 h-4' />
        </div>

        <Button variant='muted' onClick={toggleDarkMode} className='rounded-full px-3 py-1.5 text-xs'>
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </Button>

        <div onClick={() => navigate("/cart")} className="cart-icon-shell relative cursor-pointer">
          <img src={isDarkMode ? assets.nav_cart_icon_dark : assets.nav_cart_icon} alt="cart" className='w-6' />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full shadow">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div
            className='profile-dropdown-wrap relative'
            onMouseEnter={openProfileMenu}
            onMouseLeave={closeProfileMenuWithDelay}
          >
            <img src={assets.profile_icon} className='w-10' alt="profile" />
            <span className='profile-menu-bridge' aria-hidden='true'></span>
            <ul className={`profile-menu ${dropdownOpen ? 'profile-menu-open' : ''}`}>
              <li onClick={() => navigate("my-orders")} className='profile-menu-item'>
                My orders
              </li>
              <li onClick={logout} className='profile-menu-item'>
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile - Cart + Menu Button */}
      <div className='flex items-center gap-6 sm:hidden'>
        <div onClick={() => navigate("/cart")} className="cart-icon-shell relative cursor-pointer">
          <img src={isDarkMode ? assets.nav_cart_icon_dark : assets.nav_cart_icon} alt="cart" className='w-6' />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img src={assets.menu_icon} alt="menu" className='icon-theme w-6 h-6' />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="glass-surface absolute top-[60px] left-0 w-full shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden">
          <div className="flex items-center text-sm gap-2 border border-white/20 px-3 rounded-full bg-white/60 dark:bg-white/5 w-full mb-1">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 w-full bg-transparent outline-none text-theme-primary placeholder:text-theme-secondary"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className='icon-theme w-4 h-4' />
          </div>
          <Button variant='muted' onClick={toggleDarkMode} className='rounded-full px-3 py-1.5 text-xs'>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </Button>
          <NavLink to='/' onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to='/products' onClick={() => setOpen(false)}>All Product</NavLink>
          {user && (
            <NavLink to='/my-orders' onClick={() => setOpen(false)}>My Orders</NavLink>
          )}
          <NavLink to='/contact' onClick={() => setOpen(false)}>Contact</NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
