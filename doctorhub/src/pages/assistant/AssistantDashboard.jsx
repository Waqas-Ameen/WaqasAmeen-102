import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { CircleDollarSign, CheckSquare, Clock } from 'lucide-react';

const AssistantDashboard = () => {
  const [stats, setStats] = useState({ verified: 0, pending: 0, total: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/payments');
        const payments = res.data.data;
        const pending = payments.filter(p => p.status === 'pending').length;
        const verified = payments.filter(p => p.status === 'verified').length;
        setStats({ pending, verified, total: payments.length });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Assistant Nexus</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-[6px] border-t-amber-400 border-gray-100 flex justify-between items-center group hover:shadow-md transition">
          <div>
            <p className="text-gray-400 font-extrabold uppercase tracking-widest text-[11px] mb-2">To Verify</p>
            <p className="text-4xl font-black text-amber-500">{stats.pending}</p>
          </div>
          <Clock className="text-amber-100 group-hover:text-amber-200 transition" size={48} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-[6px] border-t-emerald-400 border-gray-100 flex justify-between items-center group hover:shadow-md transition">
          <div>
            <p className="text-gray-400 font-extrabold uppercase tracking-widest text-[11px] mb-2">Verified Cleared</p>
            <p className="text-4xl font-black text-emerald-500">{stats.verified}</p>
          </div>
          <CheckSquare className="text-emerald-100 group-hover:text-emerald-200 transition" size={48} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-[6px] border-t-blue-400 border-gray-100 flex justify-between items-center group hover:shadow-md transition">
          <div>
            <p className="text-gray-400 font-extrabold uppercase tracking-widest text-[11px] mb-2">System Volume</p>
            <p className="text-4xl font-black text-blue-500">{stats.total}</p>
          </div>
          <CircleDollarSign className="text-blue-100 group-hover:text-blue-200 transition" size={48} />
        </div>
      </div>
      
      <div className="mt-8 flex justify-center border-t pt-8 border-gray-200 border-dashed">
         <button onClick={() => navigate('/assistant/verify-payments')} className="bg-gray-900 text-white font-extrabold px-12 py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-black transition text-lg w-full max-w-sm flex items-center justify-center gap-3">
            Open Control Center <CheckSquare size={20}/>
         </button>
      </div>
    </div>
  );
};
export default AssistantDashboard;
