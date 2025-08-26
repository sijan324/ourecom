import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function AdminProducts() {
  const { user } = useSelector(state => state.user);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', countInStock: '', images: [''] });
  const [editing, setEditing] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(res.data.products);
    };
    fetchProducts();
  }, []);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${import.meta.env.VITE_API_URL}/products/${editing}`, form, { headers: { Authorization: `Bearer ${user.token}` } });
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/products`, form, { headers: { Authorization: `Bearer ${user.token}` } });
    }
    window.location.reload();
  };
  const handleEdit = p => {
    setEditing(p._id);
    setForm({ ...p, images: p.images });
  };
  const handleDelete = async id => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
    window.location.reload();
  };
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 flex flex-col gap-2 max-w-md">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="border px-2 py-1 rounded" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="border px-2 py-1 rounded" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" required className="border px-2 py-1 rounded" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required className="border px-2 py-1 rounded" />
        <input name="countInStock" value={form.countInStock} onChange={handleChange} placeholder="Stock" type="number" required className="border px-2 py-1 rounded" />
        <input name="images" value={form.images[0]} onChange={e => setForm({ ...form, images: [e.target.value] })} placeholder="Image URL" required className="border px-2 py-1 rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editing ? 'Update' : 'Add'} Product</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-bold">{p.name}</div>
              <div>${p.price}</div>
              <div>Stock: {p.countInStock}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;
