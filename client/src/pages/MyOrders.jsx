import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { getProductImage } from '../utils/image';
import api from '../utils/api';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, user } = useAppContext();

 const fetchMyOrders = async () => {
  try {
  const { data } = await api.get('/api/order/user');
     if (data.success) {
       setMyOrders(data.orders);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if(user){
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className='mt-16 pb-16'>
      <div className='flex flex-col items-end w-max mb-8'>
        <p className='text-2xl font-medium uppercase text-theme-primary'>My Orders</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {myOrders.length === 0 ? (
        <p className='text-theme-secondary'>No orders found.</p>
      ) : (
        myOrders.map((order, index) => (
          <div key={index} className='glass-surface mb-10 max-w-4xl rounded-lg p-4 py-5'>
            <p className='flex justify-between md:items-center text-theme-secondary md:font-medium max-md:flex-col'>
              <span>OrderId: {order._id}</span>
              <span>Payment: {String(order.paymentType || order.paymentMethod || 'COD').toUpperCase()}</span>
              <span>Payment Status: {String(order.paymentStatus || (order.isPaid ? 'PAID' : order.status === 'FAILED' ? 'FAILED' : 'PENDING')).toUpperCase()}</span>
              <span>Total Amount: {currency}{order.amount}</span>
            </p>

            {order.items.map((item, idx) => (
              <div key={idx} className={`relative mt-2 text-theme-secondary ${order.items.length !== idx+1 && "border-b"} border-theme flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>
                <div className='flex items-center mb-4'>
                  <div className='border border-theme bg-theme-card p-4 rounded-lg'>
                    <img
                      src={getProductImage(item.product, assets.upload_area)}
                      alt={item.product.name}
                      className='w-16 h-16 object-cover rounded'
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = assets.upload_area;
                      }}
                    />
                  </div>
                  <div className='ml-4'>
                    <h2 className='text-xl font-medium text-theme-primary'>{item.product.name}</h2>
                    <p>Category: {item.product.category}</p>
                  </div>
                </div>

                <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                  <p>Quantity: {item.quantity || '1'}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <p className='text-primary text-lg font-medium'>
                  Amount: {currency}{item.product.offerPrice * (item.quantity || 1)}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
