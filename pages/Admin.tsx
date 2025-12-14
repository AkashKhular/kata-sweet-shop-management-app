import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Sweet } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { CATEGORIES } from '../constants';
import { Plus, Edit2, Trash2, TrendingUp, Package, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Admin = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Sweet>>({
    name: '',
    category: CATEGORIES[0],
    price: 0,
    quantity: 0,
    description: '',
    imageUrl: `https://loremflickr.com/400/300/candy?lock=${Date.now()}`
  });

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const data = await api.sweets.getAll();
      setSweets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleOpenModal = (sweet?: Sweet) => {
    if (sweet) {
      setEditingSweet(sweet);
      setFormData(sweet);
    } else {
      setEditingSweet(null);
      setFormData({
        name: '',
        category: CATEGORIES[0],
        price: 0,
        quantity: 0,
        description: '',
        imageUrl: `https://loremflickr.com/400/300/candy?lock=${Date.now()}`
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingSweet) {
        await api.sweets.update(editingSweet.id, formData);
      } else {
        await api.sweets.create(formData as Omit<Sweet, 'id'>);
      }
      setIsModalOpen(false);
      fetchSweets();
    } catch (error) {
      alert('Failed to save sweet');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await api.sweets.delete(id);
        fetchSweets();
      } catch (error) {
        alert('Failed to delete sweet');
      }
    }
  };

  const handleRestock = async (id: string) => {
    const amount = prompt('Enter quantity to add:', '10');
    if (amount) {
      try {
        // We simulate restock by getting, updating locally, then saving
        // A real API would have a specific endpoint or we use UPDATE
        const sweet = sweets.find(s => s.id === id);
        if (sweet) {
          await api.sweets.update(id, { quantity: sweet.quantity + parseInt(amount) });
          fetchSweets();
        }
      } catch (error) {
        alert('Failed to restock');
      }
    }
  };

  // Stats
  const totalValue = sweets.reduce((acc, s) => acc + (s.price * s.quantity), 0);
  const lowStockCount = sweets.filter(s => s.quantity < 10).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500">Manage your sweet shop's stock and products.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Sweet
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Products</p>
              <h3 className="text-2xl font-bold text-slate-900">{sweets.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Inventory Value</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{totalValue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-slate-900">{lowStockCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80 hidden md:block">
        <h3 className="text-lg font-semibold mb-4">Stock Levels by Product</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sweets}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sweets.map((sweet) => (
                <tr key={sweet.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={sweet.imageUrl} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{sweet.name}</div>
                        <div className="text-sm text-slate-500 truncate max-w-xs">{sweet.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge>{sweet.category}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    ₹{sweet.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center gap-2">
                      <Badge color={sweet.quantity < 10 ? 'red' : 'green'}>{sweet.quantity}</Badge>
                      <button onClick={() => handleRestock(sweet.id)} className="text-xs text-brand-600 hover:text-brand-800 font-medium">+ Add</button>
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleOpenModal(sweet)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(sweet.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
      >
        <div className="space-y-4">
          <Input 
            label="Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select 
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm border px-3 py-2"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Price (₹)" 
              type="number" 
              step="1"
              value={formData.price} 
              onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
            />
            <Input 
              label="Quantity" 
              type="number" 
              value={formData.quantity} 
              onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm border px-3 py-2"
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <Input 
            label="Image URL" 
            value={formData.imageUrl} 
            onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Admin;