import React, { useEffect, useMemo, useState } from 'react';
import { useAppContext } from "../context/AppContext";
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { getProductImage } from '../utils/image';

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const Cart = () => {
  const {
    user,
    cartArray,
    navigate,
    currency,
    getCartAmount,
    getCartCount,
    removeFromCart,
    handleQuantityChange,
    setCartItems,
    axios,
    addresses,
    addressesLoading,
    fetchAddresses,
  } = useAppContext();
  const location = useLocation();

  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const cartSubTotal = getCartAmount();
  const cartTax = cartSubTotal * 0.02;
  const cartTotalINR = cartSubTotal + cartTax;

  const selectedAddressText = useMemo(() => {
    if (!selectedAddress) return "No address selected";
    return `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`;
  }, [selectedAddress]);

  const placeOrder = async () => {
    if (isPlacingOrder) return;

    try {
      if (!user) {
        return toast.error("Please login to place an order");
      }

      if (!cartArray.length) {
        return toast.error("Your cart is empty");
      }

      if (!selectedAddress) {
        return toast.error("Please select an address")
      }

      if (!["COD", "ONLINE"].includes(paymentOption)) {
        return toast.error("Invalid payment option selected");
      }

      setIsPlacingOrder(true);

      if (paymentOption === "COD") {
        const { data } = await axios.post('/api/order/cod', {
          userId: user._id,
          items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
          address: selectedAddress._id,
          paymentMethod: "COD",
        })
        if (data.success) {
          toast.success(data.message)
          setCartItems({})
          navigate('/my-orders')
        } else {
          toast.error(data.message)
        }
      } else {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error('Unable to load Razorpay checkout. Please try again.');
          return;
        }

        const { data } = await axios.post('/api/payment/create-order', {
          userId: user._id,
          items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
          address: selectedAddress._id,
          paymentMethod: "ONLINE",
          orderAmount: Number(cartTotalINR.toFixed(2)),
        })

        if (data.success) {
          const options = {
            key: data.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency || 'INR',
            name: 'GreenCart',
            description: 'Order Payment',
            order_id: data.order_id,
            handler: async (response) => {
              try {
                const verifyResponse = await axios.post('/api/payment/verify', {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                });

                if (verifyResponse.data.success) {
                  toast.success('Payment successful');
                  setCartItems({});
                  navigate('/my-orders');
                } else {
                  toast.error(verifyResponse.data.message || 'Payment verification failed');
                }
              } catch (verifyError) {
                toast.error(verifyError.message || 'Payment verification failed');
              }
            },
            modal: {
              ondismiss: () => {
                toast('Payment popup closed.');
              },
            },
            theme: {
              color: '#22c55e',
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.on('payment.failed', () => {
            toast.error('Payment failed. Please try again.');
          });
          razorpay.open();
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  useEffect(() => {
    if (!addresses.length) {
      setSelectedAddress(null);
      return;
    }

    const selectedFromState = location.state?.selectedAddressId;
    if (selectedFromState) {
      const matched = addresses.find((item) => item._id === selectedFromState);
      if (matched) {
        setSelectedAddress(matched);
        return;
      }
    }

    setSelectedAddress((prev) => {
      if (prev && addresses.some((item) => item._id === prev._id)) {
        return prev;
      }
      return addresses[addresses.length - 1];
    });
  }, [addresses, location.state]);

  if (!cartArray.length) {
    return (
      <EmptyState
        title='Your cart is empty'
        description='Start shopping and add products to continue checkout.'
        actionLabel='Continue Shopping'
        onAction={() => navigate('/products')}
      />
    );
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className='flex-1'>
        <h1 className="text-3xl font-semibold mb-6 text-theme-primary">
          Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-theme-secondary text-base font-medium pb-3 px-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div key={index} className="glass-surface animate-rise mb-3 grid grid-cols-[2fr_1fr_1fr] items-center gap-2 rounded-xl p-3 text-sm md:text-base font-medium text-theme-secondary">
            <div className="flex items-center md:gap-6 gap-3">
              <div onClick={() => {
                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                scrollTo(0, 0);
              }} className="cursor-pointer h-28 w-28 overflow-hidden rounded-lg border border-theme bg-theme-card p-1">
                <img
                  loading='lazy'
                  className="h-full w-full object-cover rounded-md"
                  src={getProductImage(product, assets.upload_area)}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = assets.upload_area;
                  }}
                />
              </div>
              <div>
                <p className="font-semibold text-theme-primary">{product.name}</p>
                <p className='text-xs mt-1 text-theme-secondary'>{product.category}</p>
                <div className="font-normal text-theme-secondary mt-2">
                  <p>Weight: <span>{product.weight || "N/A"}</span></p>
                  <div className='mt-1 flex items-center'>
                    <p>Qty:</p>
                    <select
                      className="ml-2 rounded-md border border-theme bg-theme-card px-2 py-1 outline-none"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(e, product._id)}
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center font-semibold text-theme-primary">{currency}{(product.offerPrice * product.quantity).toFixed(2)}</p>
            <button onClick={() => removeFromCart(product._id)} className="mx-auto inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-red-300 bg-red-100/80 hover:bg-red-200/80 dark:border-red-300/30 dark:bg-red-300/15 dark:hover:bg-red-300/25 transition">
              <img src={assets.remove_icon} alt="remove" className='inline-block w-4 h-4' />
            </button>
          </div>
        ))}

        <button onClick={() => { navigate("/products"); scrollTo(0, 0); }} className="group cursor-pointer flex items-center mt-6 gap-2 text-primary font-medium">
          <img className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow" />
          Continue Shopping
        </button>
      </div>

      {/* Right: Order Summary */}
      <div className="glass-surface h-max w-full rounded-2xl p-5 lg:sticky lg:top-24 isolate">
        <h2 className="text-xl md:text-xl font-semibold text-theme-primary">Order Summary</h2>
        <hr className="my-5 border-theme" />

        <div className="mb-6">
          <p className="text-sm font-semibold uppercase text-theme-primary">Delivery Address</p>
          <div className="relative mt-2">
            <div className='flex items-start justify-between gap-3'>
              <p className="flex-1 text-theme-secondary text-sm leading-5">{addressesLoading ? 'Loading addresses...' : selectedAddressText}</p>
              <button onClick={() => setShowAddress(!showAddress)} className="shrink-0 text-primary hover:underline cursor-pointer">
                Change
              </button>
            </div>
            {showAddress && (
              <div className="surface-card absolute left-0 right-0 top-full mt-2 max-h-52 overflow-auto py-1 text-sm z-30 rounded-lg">
                {addresses.map((address, index) => (
                  <p key={index} onClick={() => {
                    setSelectedAddress(address);
                    setShowAddress(false);
                  }} className="text-theme-secondary p-2 hover:bg-white/35 dark:hover:bg-white/10 cursor-pointer">
                    {address.city}, {address.state}, {address.street}, {address.country}
                  </p>
                ))}
                <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-semibold uppercase mt-6 text-theme-primary">Payment Method</p>
          <select
            value={paymentOption}
            onChange={e => setPaymentOption(e.target.value)}
            className="w-full rounded-lg border border-theme px-3 py-2 mt-2 outline-none"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <option value="COD" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              Cash On Delivery
            </option>
            <option value="ONLINE" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              Online Payment
            </option>
          </select>

          {paymentOption === "ONLINE" && (
            <div className="mt-2 text-sm text-theme-secondary">
              <p>* Online payments are processed securely via Razorpay in INR.</p>
              <p>* You will be charged <b>{currency}{cartTotalINR.toFixed(2)}</b> for this order.</p>
            </div>
          )}
        </div>

        <hr className="border-theme" />

        <div className="mt-4 space-y-3 text-theme-secondary">
          <p className="flex justify-between">
            <span>Subtotal</span><span>{currency}{cartSubTotal.toFixed(2)}</span>
          </p>
          <div className='border-t border-theme'></div>
          <p className="flex justify-between">
            <span>Shipping Fee</span><span className="text-green-600">Free</span>
          </p>
          <div className='border-t border-theme'></div>
          <p className="flex justify-between">
            <span>Tax (2%)</span><span>{currency}{cartTax.toFixed(2)}</span>
          </p>
          <div className='border-t border-theme'></div>
          <p className="flex justify-between text-lg font-semibold mt-1 text-theme-primary">
            <span>Total</span><span>{currency}{cartTotalINR.toFixed(2)}</span>
          </p>
        </div>

        <Button
          disabled={isPlacingOrder || !selectedAddress}
          onClick={placeOrder}
          className="mt-6 w-full rounded-xl py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPlacingOrder ? 'Processing...' : paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </Button>
      </div>
    </div>
  );
};

export default Cart;
