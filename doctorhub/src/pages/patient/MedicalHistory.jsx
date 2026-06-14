import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FileUp, FileText } from 'lucide-react';
import UploadReport from './UploadReport';

const MedicalHistory = () => {
  const [history, setHistory] = useState([]);
  const [uploadModal, setUploadModal] = useState({ show: false, historyId: null });

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history');
      setHistory(res.data.data.sort((a,b) => b.id - a.id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Medical Timeline</h2>
      
      <div className="relative border-l-[3px] border-primary-200 ml-4 py-4 pl-10 space-y-10">
        {history.map(record => (
          <div key={record.id} className="relative bg-white p-7 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="absolute -left-[49px] top-8 h-6 w-6 rounded-full bg-primary-600 border-[5px] border-white shadow-lg"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm font-black tracking-widest uppercase text-primary-500">{new Date(record.created_at).toLocaleDateString()}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-2">{record.diagnosis}</h3>
              </div>
              <div>
                {record.report_file ? (
                  <a href={`http://localhost:5000/uploads/${record.report_file}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2.5 rounded-lg font-bold hover:bg-blue-100 transition text-sm shadow-sm border border-blue-100">
                    <FileText size={16} /> View Lab Report
                  </a>
                ) : (
                  <button onClick={() => setUploadModal({ show: true, historyId: record.id })} className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition text-sm shadow-sm ring-inset hover:border-gray-300">
                    <FileUp size={16} /> Upload Result
                  </button>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-100">
              <p className="text-sm font-bold tracking-wide text-gray-800 mb-2 uppercase">Physician Notes</p>
              <p className="text-gray-600 font-medium whitespace-pre-wrap leading-relaxed">{record.notes || 'No extensive notes provided.'}</p>
            </div>
            
            {record.Prescriptions && record.Prescriptions.length > 0 && (
              <div>
                <h4 className="font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center gap-2">
                   <div className="h-6 w-1 rounded bg-primary-600"></div> Prescribed Medications
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {record.Prescriptions.map(presc => (
                    <div key={presc.id} className="bg-primary-50/50 p-5 rounded-xl border border-primary-100">
                      <p className="text-sm text-gray-800 mb-4 font-medium"><span className="font-bold uppercase tracking-wider text-primary-700 mr-2 text-xs">Guidelines:</span> {presc.instructions}</p>
                      <div className="space-y-3">
                        {Array.isArray(presc.medications) && presc.medications.map((med, idx) => (
                          <div key={idx} className="flex flex-col text-sm bg-white p-3 border border-primary-100 shadow-sm rounded-lg">
                            <span className="font-extrabold text-gray-900 text-[15px]">{med.name}</span>
                            <span className="text-gray-500 font-semibold mt-1 flex items-center divide-x divide-gray-300">
                               <span className="pr-2">{med.dosage}</span>
                               <span className="px-2">{med.frequency}</span>
                               <span className="pl-2 line-clamp-1">{med.duration}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        ))}
        {history.length === 0 && <div className="text-gray-500 font-semibold italic text-lg ml-6">No medical records generated yet.</div>}
      </div>

      {uploadModal.show && (
        <UploadReport 
          historyId={uploadModal.historyId} 
          onClose={() => setUploadModal({ show: false, historyId: null })}
          onSuccess={() => { setUploadModal({ show: false, historyId: null }); fetchHistory(); }}
        />
      )}
    </div>
  );
};
export default MedicalHistory;
