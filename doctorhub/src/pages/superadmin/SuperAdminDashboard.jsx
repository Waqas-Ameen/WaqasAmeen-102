import React from 'react';
import AdminDashboard from '../admin/AdminDashboard';
import { Skull } from 'lucide-react';

const SuperAdminDashboard = () => {
  return (
    <div className="space-y-6">
       <div className="bg-red-600 p-8 rounded-3xl shadow-xl flex items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
             <Skull size={200} />
          </div>
          <div className="bg-black/20 p-5 rounded-2xl backdrop-blur">
             <Skull size={48} className="text-white" />
          </div>
          <div className="z-10">
            <h2 className="text-white font-black text-3xl uppercase tracking-widest">God Mode Framework</h2>
            <p className="text-red-100 font-bold mt-2 text-lg">Unrestricted global destructive operations are now available to you.</p>
          </div>
       </div>
       
       <AdminDashboard />
    </div>
  );
};
export default SuperAdminDashboard;
