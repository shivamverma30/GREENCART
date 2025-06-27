import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // Fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  // Fetch user auth status and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    } catch {
      setUser(null);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  // Remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success("Removed from Cart");
  };

  // Get total cart item count
const getCartCount = () => {
  return Object.values(cartItems).reduce((sum, qty) => {
    // If it's an object with a quantity field, use it; otherwise use the number
    return sum + (typeof qty === "object" ? qty.quantity || 0 : qty);
  }, 0);
};


  // Get total cart amount
  const getCartAmount = () => {
    return Math.floor(
      Object.entries(cartItems).reduce((total, [id, qty]) => {
        const item = products.find((p) => p._id === id);
        return item ? total + item.offerPrice * qty : total;
      }, 0) * 100
    ) / 100;
  };

  // Update DB when cart changes
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", {
          userId: user._id,
          cartItems,
        });
        if (!data.success) toast.error(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user && Object.keys(cartItems).length > 0) {
      updateCart();
    }
  }, [cartItems, user]);

  // Quantity dropdown handler
  const handleQuantityChange = (e, productId) => {
    const newQty = parseInt(e.target.value);
    setCartItems((prev) => ({
      ...prev,
      [productId]: newQty,
    }));
    toast.success(`Quantity updated to ${newQty}`);
  };

  // Build cart array (for UI)
  const getCartArray = () => {
    return Object.keys(cartItems).map((itemId) => {
      const product = products.find((p) => p._id === itemId);
      return product
        ? { ...product, quantity: cartItems[itemId] }
        : null;
    }).filter(Boolean);
  };

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    cartArray: getCartArray(), // use function output
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    handleQuantityChange,
    setCartItems,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
