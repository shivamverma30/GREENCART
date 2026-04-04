import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import GlassCard from "../../components/ui/GlassCard";
import SectionHeader from "../../components/ui/SectionHeader";

const Dashboard = () => {
  const { products, axios, currency } = useAppContext();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/order/seller");
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch {
        setOrders([]);
      }
    };

    fetchOrders();
  }, [axios]);

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const totalCustomers = new Set(orders.map((order) => order.userId)).size;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      totalCustomers,
    };
  }, [orders, products]);

  const salesByType = useMemo(() => {
    const cod = orders.filter((order) => order.paymentType === "COD").length;
    const online = orders.filter((order) => ["ONLINE", "Online"].includes(order.paymentType)).length;
    const maxValue = Math.max(cod, online, 1);
    return [
      { label: "COD", value: cod, width: `${(cod / maxValue) * 100}%`, color: "bg-amber-400" },
      { label: "Online", value: online, width: `${(online / maxValue) * 100}%`, color: "bg-emerald-500" },
    ];
  }, [orders]);

  return (
    <div className="space-y-6">
      <SectionHeader title="Seller Dashboard" subtitle="Real-time business overview" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <GlassCard className="p-4">
          <p className="text-sm text-muted">Total Products</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.totalProducts}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-muted">Total Orders</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.totalOrders}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-muted">Revenue</p>
          <p className="mt-2 text-2xl font-semibold">{currency}{metrics.totalRevenue.toFixed(2)}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-sm text-muted">Customers</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.totalCustomers}</p>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <h3 className="text-lg font-semibold">Sales Graph (Last Snapshot)</h3>
          <div className="mt-4 space-y-4">
            {salesByType.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2.5 w-full rounded-full border border-theme bg-theme-card">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: item.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-lg font-semibold">Product Distribution</h3>
          <div className="mt-4 space-y-3 text-sm">
            {Object.entries(
              products.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + 1;
                return acc;
              }, {})
            ).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between rounded-lg border border-theme px-3 py-2 text-theme-secondary">
                <span>{category}</span>
                <span className="font-semibold text-theme-primary">{count}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
