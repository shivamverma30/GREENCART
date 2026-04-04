import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';

const Orders = () => {
  const { currency ,axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
  try {
    const {data} = await axios.get('/api/order/seller');
    if(data.success){
      setOrders(data.orders)
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
      <div className="md:p-10 p-4 space-y-4">
        <SectionHeader title='Order Management' subtitle='Track recent customer orders and payment status' />

        {orders.length === 0 && (
          <GlassCard className='p-4 text-sm text-muted'>No orders found.</GlassCard>
        )}

        {orders.map((order, index) => (
          <GlassCard key={index} className="flex flex-col md:grid md:grid-cols-4 gap-5 p-5 max-w-4xl rounded-xl">
            <div className="flex gap-5 max-w-80">
              <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
              <div>
                {order.items.map((item, idx) => (
                  <p key={idx} className="font-medium">
                    {item.product.name} <span className="text-primary">x {item.quantity}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="text-sm md:text-base text-theme-secondary">
              <p className='text-theme-primary'>{order.address.firstName} {order.address.lastName}</p>
              <p>{order.address.street}, {order.address.city}</p>
              <p>{order.address.state}, {order.address.pinCode}, {order.address.country}</p>
              <p>{order.address.phone}</p>
            </div>

            <p className="my-auto text-lg font-semibold text-theme-primary">{currency}{order.amount}</p>

            <div className="flex flex-col text-sm md:text-base text-theme-secondary">
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Orders;
