import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { generatedUiProducts } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch {
      return {};
    }
  });
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("greencart-theme");
    return savedTheme === "dark";
  });

  const clearUserSession = () => {
    setUser(null);
    setIsSeller(false);
    setCartItems({});
    setAddresses([]);
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
  };

  // Fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await api.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  // Fetch user auth status and cart items
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
        localStorage.setItem("token", "authenticated");
        fetchAddresses(data.user._id);
      } else {
        clearUserSession();
      }
    } catch {
      clearUserSession();
    }
  };

  // Fetch all addresses for active user
  const fetchAddresses = async (userIdOverride) => {
    const targetUserId = userIdOverride || user?._id;
    if (!targetUserId) return [];

    setAddressesLoading(true);
    try {
      const { data } = await api.get("/api/address/get");

      if (data.success && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
        return data.addresses;
      }

      return [];
    } catch (error) {
      toast.error(error.message);
      return [];
    } finally {
      setAddressesLoading(false);
    }
  };

  // Add user address and immediately sync in context
  const addUserAddress = async (addressData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowUserLogin(true);
      return { success: false, message: "Please login or register first" };
    }

    try {
      const { data } = await api.post("/api/address/add", {
        address: addressData,
      });

      if (!data.success) {
        return data;
      }

      let targetUserId = user?._id;
      if (!targetUserId) {
        const authData = await api.get("/api/user/is-auth");
        if (authData.data?.success) {
          setUser(authData.data.user);
          targetUserId = authData.data.user?._id;
        }
      }

      const updatedAddresses = targetUserId
        ? await fetchAddresses(targetUserId)
        : addresses;
      const latestAddress = updatedAddresses[updatedAddresses.length - 1] || null;

      return {
        success: true,
        message: "Address added successfully",
        address: latestAddress,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const { data } = await api.get("/api/product/list");
      if (data.success) {
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(generatedUiProducts);
        }
      } else {
        toast.error(data.message);
        setProducts(generatedUiProducts);
      }
    } catch (error) {
      toast.error(error.message);
      setProducts(generatedUiProducts);
    } finally {
      setProductsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Add product to cart
  const addToCart = (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login or register first to add items to cart.");
      setShowUserLogin(true);
      navigate("/");
      return;
    }

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
        const { data } = await api.post("/api/cart/update", {
          userId: user._id,
          cartItems,
        });
        if (!data.success) toast.error(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems, user]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

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

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
      localStorage.setItem("greencart-theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("greencart-theme", "light");
    }
  }, [isDarkMode]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    productsLoading,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    addresses,
    addressesLoading,
    cartArray: getCartArray(), // use function output
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    getCartCount,
    getCartAmount,
    fetchProducts,
    handleQuantityChange,
    setCartItems,
    fetchAddresses,
    addUserAddress,
    clearUserSession,
    fetchUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
