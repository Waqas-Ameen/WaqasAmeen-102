import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save } from 'lucide-react';

const AddPrescription = () => {
  const { patId, apptId } = useParams();
  const navigate = useNavigate();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { medications: [{ name: '', dosage: '', frequency: '', duration: '' }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'medications' });
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [prescNotes, setPrescNotes] = useState('');

  const onSubmit = async (data) => {
    if (!diagnosis) return toast.error('Primary Diagnosis is strictly required');
    try {
      // 1. Create immutable Medical History block
      const histRes = await api.post('/history', {
        patient_id: parseInt(patId),
        appointment_id: parseInt(apptId),
        diagnosis,
        notes
      });
      const historyId = histRes.data.data.id;

      // 2. Add Prescription linked to Medical History
      if (data.medications.length > 0 && data.medications[0].name !== '') {
        await api.post('/prescriptions', {
          medical_history_id: historyId,
          patient_id: parseInt(patId),
          medications: data.medications,
          instructions: prescNotes
        });
      }

      toast.success('Medical record & prescription registered immutably!');
      navigate('/doctor/patients');
    } catch (err) {
      toast.error('Failed to process medical insertion.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl mt-4 border border-gray-100">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Create Immutable Medical Record</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
          <h3 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
             <div className="w-2 h-6 bg-blue-600 rounded"></div> Core Diagnosis
          </h3>
          <div className="space-y-5">
            <div>
               <label className="block text-sm font-bold text-gray-800 mb-2">Primary Diagnosis Overview *</label>
               <input type="text" required value={diagnosis} onChange={e=>setDiagnosis(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-sm transition" placeholder="e.g. Acute Bronchitis" />
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-800 mb-2">Clinical Differential Notes (Optional)</label>
               <textarea rows="4" value={notes} onChange={e=>setNotes(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 font-medium shadow-sm transition" placeholder="Document symptoms, vitals, or procedural observations..." />
            </div>
          </div>
        </div>

        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
             <h3 className="text-xl font-black text-emerald-900 flex items-center gap-2">
               <div className="w-2 h-6 bg-emerald-600 rounded"></div> Digital Prescription Details
             </h3>
             <button type="button" onClick={() => append({ name: '', dosage: '', frequency: '', duration: '' })} className="mt-4 md:mt-0 flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-50 shadow-sm border border-emerald-200 transition">
                <Plus size={18} /> Add Medication
             </button>
          </div>
          
          <div className="space-y-5">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-xl shadow-sm border border-emerald-100 relative group transition-all hover:border-emerald-300">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Medicine Name</label>
                  <input type="text" {...register(`medications.${index}.name`, { required: true })} className="w-full border-b-2 border-gray-200 focus:border-emerald-500 py-2 outline-none font-bold text-gray-900 transition-colors" placeholder="E.g. Panadol 500mg" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Dosage</label>
                  <input type="text" {...register(`medications.${index}.dosage`)} className="w-full border-b-2 border-gray-200 focus:border-emerald-500 py-2 outline-none font-semibold text-gray-700 transition-colors" placeholder="1 tablet" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Frequency</label>
                  <input type="text" {...register(`medications.${index}.frequency`)} className="w-full border-b-2 border-gray-200 focus:border-emerald-500 py-2 outline-none font-semibold text-gray-700 transition-colors" placeholder="Twice a day" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Duration</label>
                  <input type="text" {...register(`medications.${index}.duration`)} className="w-full border-b-2 border-gray-200 focus:border-emerald-500 py-2 outline-none font-semibold text-gray-700 transition-colors" placeholder="5 days" />
                </div>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="absolute -right-3 -top-3 bg-white border border-red-200 text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            
            <div className="pt-6">
               <label className="block text-sm font-bold text-gray-800 mb-2">General Prescription Instructions</label>
               <input type="text" value={prescNotes} onChange={e=>setPrescNotes(e.target.value)} className="w-full border border-gray-200 px-4 py-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm font-medium transition" placeholder="E.g. Take after meals, isolate until fever drops" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-8 border-t border-gray-200">
          <button type="button" onClick={() => navigate('/doctor/patients')} className="mr-4 px-8 py-3.5 font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-sm transition">Discard Entry</button>
          <button type="submit" className="flex items-center gap-2 bg-gray-900 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-black shadow-lg hover:shadow-xl transition"><Save size={20} /> Seal & Finalize Record</button>
        </div>
        <p className="text-center text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 py-3 rounded-lg border border-red-100">
          WARNING: Records and prescriptions are permanently sealed and immutable once saved
        </p>
      </form>
    </div>
  );
};
export default AddPrescription;
