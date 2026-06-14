import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', city: '', phone: '', timings: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchClinics = async () => {
    try {
      const res = await api.get('/clinics');
      setClinics(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, timings: form.timings.split(',').reduce((acc, curr) => {
        let [day, time] = curr.split(':');
        if (day && time) acc[day.trim().toLowerCase()] = time.trim();
        return acc;
      }, {}) };

      if (editingId) {
        await api.put(`/clinics/${editingId}`, payload);
        toast.success('Clinic updated');
      } else {
        await api.post('/clinics', payload);
        toast.success('Clinic added');
      }
      setForm({ name: '', address: '', city: '', phone: '', timings: '' });
      setEditingId(null);
      fetchClinics();
    } catch (err) {
      toast.error('Failed to save clinic');
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    const timingsStr = c.timings ? Object.entries(c.timings).map(([k,v]) => `${k}:${v}`).join(', ') : '';
    setForm({ name: c.name, address: c.address, city: c.city, phone: c.phone || '', timings: timingsStr });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this clinic?')) return;
    try {
      await api.delete(`/clinics/${id}`);
      toast.success('Clinic deleted');
      fetchClinics();
    } catch (err) {
      toast.error('Failed to delete clinic');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manage Clinics</h2>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-extrabold text-gray-900 mb-6">{editingId ? 'Edit Clinic Details' : 'Register New Clinic'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Clinic Name</label>
            <input type="text" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
            <input type="text" required value={form.city} onChange={e=>setForm({...form, city: e.target.value})} className="w-full border px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition font-medium" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Exact Address</label>
            <input type="text" required value={form.address} onChange={e=>setForm({...form, address: e.target.value})} className="w-full border px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
            <input type="text" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full border px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Timings (e.g. monday:09:00-17:00, tuesday:10:00-18:00)</label>
            <input type="text" value={form.timings} onChange={e=>setForm({...form, timings: e.target.value})} className="w-full border px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition font-medium" />
          </div>
          <div className="md:col-span-2 flex justify-end mt-4 pt-4 border-t border-gray-100">
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', address: '', city: '', phone: '', timings: '' }); }} className="mr-3 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50">Cancel Edit</button>}
            <button type="submit" className="flex items-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 shadow-md transition">
              {editingId ? <Edit2 size={18} /> : <Plus size={18} />} {editingId ? 'Update Configurations' : 'Add Clinic'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-primary-900">
              <Plus size={64}/>
            </div>
            <h4 className="text-xl font-extrabold text-primary-600 z-10">{c.name}</h4>
            <p className="text-sm font-bold tracking-widest uppercase text-gray-400 mt-1 z-10">{c.city}</p>
            <div className="mt-5 flex-1 text-sm text-gray-700 space-y-2 z-10">
              <p><span className="font-bold">Address:</span> {c.address}</p>
              <p><span className="font-bold">Phone:</span> {c.phone || 'N/A'}</p>
              <p className="bg-gray-50 p-2 rounded-lg border font-mono text-xs"><span className="font-bold font-sans text-sm">Schedule:</span> <br/>{c.timings ? Object.entries(c.timings).map(([k,v]) => `${k.toUpperCase()}: ${v}`).join(' | ') : 'N/A'}</p>
            </div>
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 z-10">
              <button title="Edit" onClick={() => handleEdit(c)} className="p-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-700 hover:border-primary-300 transition shadow-sm"><Edit2 size={18}/></button>
              <button title="Delete" onClick={() => handleDelete(c.id)} className="p-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition shadow-sm"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
        {clinics.length === 0 && <p className="text-gray-500 font-medium italic col-span-full">No clinics configured. Please add one above.</p>}
      </div>
    </div>
  );
};
export default ManageClinics;
