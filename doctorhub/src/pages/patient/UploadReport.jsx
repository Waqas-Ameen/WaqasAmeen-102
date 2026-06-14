import React, { useState } from 'react';
import api from '../../api/axios';
import { FileUp } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadReport = ({ historyId, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('File required');
    const formData = new FormData();
    formData.append('history_id', historyId);
    formData.append('report_file', file);

    try {
      const res = await api.post('/history/upload-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Report uploaded successfully');
        onSuccess();
      }
    } catch (err) {
      toast.error('Failed to upload report');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Upload Lab Report</h3>
        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Target File</label>
            <input type="file" required onChange={e => setFile(e.target.files[0])} className="w-full border px-4 py-3 rounded-xl bg-gray-50 font-medium text-gray-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-6 py-3 font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-md flex items-center gap-2"><FileUp size={18}/> File Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadReport;
