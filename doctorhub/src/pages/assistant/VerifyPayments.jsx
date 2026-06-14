import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Search } from 'lucide-react';

const VerifyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('pending');

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      const allPayments = res.data.data;
      setPayments(allPayments.filter(p => filter === 'all' ? true : p.status === filter).sort((a,b) => b.id - a.id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const verifyPayment = async (id) => {
    try {
      const res = await api.put(`/payments/${id}/verify`);
      if (res.data.success) {
        toast.success('Payment verified successfully!');
        fetchPayments();
      }
    } catch (err) {
      toast.error('Failed to verify payment');
    }
  };

  const rejectPayment = async (id) => {
    if (!window.confirm('Rejecting this payment will cancel the appointment. Proceed?')) return;
    try {
      const res = await api.put(`/payments/${id}/reject`);
      if (res.data.success) {
        toast.success('Payment rejected');
        fetchPayments();
      }
    } catch (err) {
      toast.error('Failed to reject payment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
           <h2 className="text-3xl font-extrabold text-gray-900">Payment Queue</h2>
           <p className="text-gray-500 font-medium mt-1">Cross-reference uploads against bank receipts.</p>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="mt-4 md:mt-0 px-5 py-3 border border-gray-300 rounded-xl outline-none font-bold text-sm bg-white text-gray-700 shadow-sm focus:border-gray-500 cursor-pointer">
           <option value="pending">Pending Validation</option>
           <option value="verified">Authorized Receipts</option>
           <option value="rejected">Rejected Entries</option>
           <option value="all">Unfiltered View</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mt-4 pt-4 border-t border-gray-100">
        {payments.map(pay => (
          <div key={pay.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition">
            <div className="h-64 bg-gray-100 border-b border-gray-200 relative group cursor-pointer" onClick={() => window.open(`http://localhost:5000/uploads/${pay.payment_screenshot}`)}>
              {pay.payment_screenshot ? (
                 <img src={`http://localhost:5000/uploads/${pay.payment_screenshot}`} alt="Receipt" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              ) : (
                 <div className="flex items-center justify-center h-full text-gray-400 font-bold uppercase tracking-widest text-xs">No Visual Data</div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                 <span className="text-white font-extrabold bg-black/60 px-5 py-2.5 rounded-full flex gap-2 items-center tracking-wide"><Search size={18}/> View Full Size</span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Remitted</p>
                  <span className="text-3xl font-black text-gray-900 tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500">Rs. {pay.amount}</span>
                </div>
                <span className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest shadow-sm ${
                  pay.status === 'verified' ? 'bg-emerald-100 border border-emerald-200 text-emerald-700' :
                  pay.status === 'rejected' ? 'bg-red-100 border border-red-200 text-red-700' :
                  'bg-amber-100 border border-amber-200 text-amber-700'
                }`}>
                  {pay.status}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl text-sm font-semibold text-gray-700 space-y-2 mb-6 border border-gray-100">
                <p className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500 uppercase text-[10px] tracking-widest font-black">Method</span> {pay.payment_method}</p>
                <p className="flex justify-between border-b border-gray-200 pb-2 pt-1"><span className="text-gray-500 uppercase text-[10px] tracking-widest font-black">Source</span> {pay.Patient?.User?.name || 'Unknown'}</p>
                <p className="flex justify-between pt-1"><span className="text-gray-500 uppercase text-[10px] tracking-widest font-black">Invoice #</span> {pay.appointment_id}</p>
              </div>
              
              <div className="mt-auto pt-2 flex gap-3">
                {pay.status === 'pending' ? (
                  <>
                    <button onClick={() => verifyPayment(pay.id)} className="flex-1 flex justify-center items-center gap-2 bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl border border-emerald-600 hover:bg-emerald-600 transition shadow-sm hover:shadow-md"><CheckCircle size={20}/> VERIFY</button>
                    <button onClick={() => rejectPayment(pay.id)} className="flex-1 flex justify-center items-center gap-2 bg-white text-rose-600 border border-rose-200 font-extrabold py-3.5 rounded-xl hover:bg-rose-50 transition shadow-sm hover:shadow-md"><XCircle size={20}/> REJECT</button>
                  </>
                ) : (
                  <div className="w-full text-center py-3 bg-gray-50/50 border border-dashed border-gray-300 text-gray-400 font-black uppercase tracking-widest text-xs rounded-xl">Action Finalized</div>
                )}
              </div>
            </div>
          </div>
        ))}
        {payments.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 bg-gray-50 rounded-3xl">
             <div className="w-16 h-16 bg-white border border-gray-100 mx-auto rounded-2xl flex items-center justify-center text-gray-400 mb-4 transform rotate-12 shadow-sm"><CheckSquare size={32}/></div>
             <p className="text-gray-600 font-extrabold text-xl">Inbox is totally clear</p>
             <p className="text-gray-500 font-medium mt-1">There are no invoices waiting for this queue.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default VerifyPayments;
