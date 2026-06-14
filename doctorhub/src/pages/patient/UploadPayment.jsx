import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const UploadPayment = () => {
  const { apptId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Screenshot requires a valid image file');
    
    const formData = new FormData();
    formData.append('appointment_id', apptId);
    formData.append('amount', amount);
    formData.append('payment_method', method);
    formData.append('payment_screenshot', file);

    try {
      const res = await api.post('/payments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Payment uploaded. Pending Verification.');
        navigate('/patient/appointments');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Validate Payment</h2>
      <form onSubmit={submitPayment} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Amount Paid (Rs)</label>
          <input type="number" required value={amount} onChange={e=>setAmount(e.target.value)} className="w-full border px-4 py-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500 font-medium" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
          <input type="text" placeholder="E.g. EasyPaisa, JazzCash, Bank" required value={method} onChange={e=>setMethod(e.target.value)} className="w-full border px-4 py-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500 font-medium" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Screenshot Receipt</label>
          <input type="file" required onChange={e=>setFile(e.target.files[0])} className="w-full border px-4 py-3 rounded-lg bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" accept="image/*" />
        </div>
        <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-primary-700 shadow-md">
          Upload Screenshot
        </button>
      </form>
    </div>
  );
};
export default UploadPayment;
