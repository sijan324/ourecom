import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function AdminOrders() {
  const { user } = useSelector(state => state.user);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrders(res.data);
    };
    fetchOrders();
  }, [user]);
  const handleStatus = async (id, status) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    window.location.reload();
  };
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      <div className="flex flex-col gap-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">Order #{order._id}</div>
            <div>User: {order.user?.name || order.user}</div>
            <div>Status: <span className="font-bold">{order.status}</span></div>
            <div>Total: <span className="font-bold">${order.totalPrice}</span></div>
            <div>Paid: {order.isPaid ? 'Yes' : 'No'}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleStatus(order._id, 'Processing')} className="bg-blue-500 text-white px-2 py-1 rounded">Processing</button>
              <button onClick={() => handleStatus(order._id, 'Delivered')} className="bg-green-600 text-white px-2 py-1 rounded">Delivered</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;
