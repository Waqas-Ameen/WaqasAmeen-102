import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { UserCheck, UserX, Award } from 'lucide-react';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  const fetchDocs = async () => {
    try {
      const res = await api.get('/admin/doctors');
      setDoctors(res.data.data.sort((a,b) => b.id - a.id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const toggleVerify = async (id) => {
    try {
      await api.put(`/admin/doctors/${id}/verify`);
      toast.success('Registration state inverted successfully.');
      fetchDocs();
    } catch (err) {
      toast.error('Validation bridge failed.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900">Physician Licensing</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {doctors.map(d => (
          <div key={d.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 flex flex-col overflow-hidden hover:shadow-lg transition relative">
            {d.is_verified && <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Award size={120} /></div>}
            
            <div className={`p-6 border-b flex-1 ${d.is_verified ? 'bg-emerald-50/30' : 'bg-gray-50'}`}>
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-xl leading-tight">{d.User?.name}</h3>
                    <p className="text-xs font-black text-gray-400 mt-1 uppercase tracking-widest">{d.User?.email}</p>
                  </div>
                  {d.is_verified ? <div className="bg-emerald-100 p-2.5 rounded-full"><UserCheck className="text-emerald-600" size={20}/></div> : <div className="bg-amber-100 p-2.5 rounded-full"><UserX className="text-amber-600" size={20}/></div>}
               </div>
               
               <div className="my-5 border-y border-gray-100 py-4">
                 <p className="text-[11px] font-black text-primary-500 uppercase tracking-widest">{d.specialization}</p>
                 <p className="text-xl font-black text-gray-700 mt-0.5">{d.treatment_type} Approach</p>
               </div>
               
               <div className="space-y-3 text-sm font-semibold text-gray-600">
                  <div className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center"><Award size={14} className="mr-1.5"/> Exp</span> 
                     <span className="text-gray-900 text-base">{d.experience_years || 0} Yrs</span>
                  </div>
                  <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm leading-relaxed text-xs">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Declared Expertise</span> 
                     {d.diseases_treated ? (Array.isArray(d.diseases_treated) ? d.diseases_treated.join(', ') : d.diseases_treated) : 'None Inputted'}
                  </div>
               </div>
            </div>
            
            <div className="p-4 bg-white flex">
               <button 
                  onClick={() => toggleVerify(d.id)}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-xs border shadow-sm transition hover:shadow-md ${d.is_verified ? 'bg-white text-red-600 border-red-200 hover:bg-red-50' : 'bg-gray-900 border-transparent text-white hover:bg-black'}`}
               >
                 {d.is_verified ? 'Revoke Legitimacy Mark' : 'Approve Global Visibility'}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ManageDoctors;
