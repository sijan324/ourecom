import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function AdminDashboard() {
  const { user } = useSelector(state => state.user);
  const [stats, setStats] = useState(null);
  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStats(res.data);
    };
    fetchStats();
  }, [user]);
  if (!stats) return <p>Loading...</p>;
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">Orders: <span className="font-bold">{stats.totalOrders}</span></div>
        <div className="bg-white p-4 rounded shadow">Revenue: <span className="font-bold">${stats.totalRevenue}</span></div>
        <div className="bg-white p-4 rounded shadow">Users: <span className="font-bold">{stats.totalUsers}</span></div>
        <div className="bg-white p-4 rounded shadow">Products: <span className="font-bold">{stats.totalProducts}</span></div>
      </div>
    </div>
  );
}

export default AdminDashboard;
