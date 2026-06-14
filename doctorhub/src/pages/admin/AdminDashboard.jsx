import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, Shield, Calendar, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Platform Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Users</p>
            <p className="text-4xl font-black text-gray-900">{stats.usersCount || 0}</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform"><Users size={32}/></div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Registered Doctors</p>
            <p className="text-4xl font-black text-gray-900">{stats.doctorsCount || 0}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform"><Shield size={32}/></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Appointments Created</p>
            <p className="text-4xl font-black text-gray-900">{stats.appointmentsCount || 0}</p>
          </div>
          <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl text-sky-600 group-hover:scale-110 transition-transform"><Calendar size={32}/></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pending Invoices</p>
            <p className="text-4xl font-black text-amber-500">{stats.pendingPaymentsCount || 0}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-600 group-hover:scale-110 transition-transform"><CreditCard size={32}/></div>
        </div>
      </div>
      
      <div className="mt-10 bg-gray-900 text-white rounded-3xl p-12 lg:p-16 text-center shadow-xl bg-cover bg-center overflow-hidden relative" style={{ backgroundImage: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2000')" }}>
         
         <div className="relative z-10">
           <h3 className="text-4xl font-black mb-4 tracking-tight">Doctor Hub Administration</h3>
           <p className="text-gray-300 font-medium text-lg max-w-2xl mx-auto leading-relaxed">System-wide monitoring enabled. You have access to user moderation, practitioner licensing verification, and core business telemetry tracking.</p>
         </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
