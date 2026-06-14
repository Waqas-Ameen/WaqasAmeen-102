import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { ShieldAlert, ShieldCheck, Trash2 } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data.sort((a,b) => b.id - a.id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/status`);
      toast.success(res.data.data.is_active ? 'User Unsilenced' : 'User Suspended');
      fetchUsers();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete permanently? This removes all associated DB linkage. DANGEROUS ENTRY.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User obliterated');
      fetchUsers();
    } catch (err) {
      toast.error('Constrained by sub-relations.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">User Database Moderation</h2>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-8 py-5">Profile Manifest</th>
                <th className="px-8 py-5">Access Matrix</th>
                <th className="px-8 py-5">Global Stance</th>
                <th className="px-8 py-5 text-right w-48">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className={`hover:bg-gray-50 transition ${!u.is_active ? 'bg-red-50/30' : ''}`}>
                  <td className="px-8 py-6">
                    <p className="font-extrabold text-gray-900 text-lg">{u.name}</p>
                    <p className="text-gray-500 font-medium text-sm mt-0.5">{u.email}</p>
                    {u.phone && <p className="text-xs font-bold text-gray-400 mt-2 tracking-wider">{u.phone}</p>}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded font-black text-[10px] tracking-widest uppercase border ${
                      u.role === 'super_admin' ? 'bg-purple-100 border-purple-200 text-purple-700' :
                      u.role === 'admin' ? 'bg-gray-800 border-gray-900 text-white' :
                      'bg-gray-50 border-gray-200 text-gray-600'
                    }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {u.is_active ? 
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-extrabold uppercase tracking-wider"><ShieldCheck size={16}/> Standard</span> : 
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-extrabold uppercase tracking-wider"><ShieldAlert size={16}/> Silenced</span>
                    }
                  </td>
                  <td className="px-8 py-6 space-x-2 flex justify-end">
                    {u.role !== 'super_admin' && (
                      <button onClick={() => toggleStatus(u.id)} className={`px-5 py-2 font-bold rounded-lg border shadow-sm text-xs uppercase tracking-wider transition ${u.is_active ? 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50' : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'}`}>
                        {u.is_active ? 'Silence' : 'Restore'}
                      </button>
                    )}
                    {currentUser.role === 'super_admin' && u.role !== 'super_admin' && (
                      <button onClick={() => deleteUser(u.id)} className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm">
                        <Trash2 size={16}/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ManageUsers;
