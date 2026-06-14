import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await api.get(`/doctors/${docId}`);
        setDoctor(res.data.data);
      } catch (err) {
        toast.error('Doctor not found');
        navigate('/patient/search-doctors');
      }
    };
    fetchDoc();
  }, [docId, navigate]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        doctor_id: parseInt(docId),
        clinic_id: parseInt(data.clinic_id),
        appointment_date: data.date,
        appointment_time: data.time,
        reason: data.reason
      };
      const res = await api.post('/appointments', payload);
      if (res.data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/patient/upload-payment/' + res.data.data.id);
      }
    } catch (err) {
      toast.error('Failed to book appointment');
    }
  };

  if (!doctor) return <div className="text-center py-10 text-gray-500">Loading Doctor Details...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Book an Appointment</h2>
      
      <div className="mb-6 bg-primary-50 p-5 rounded-xl border border-primary-100 flex items-center justify-between">
         <div>
            <p className="font-bold text-xl text-primary-900">{doctor.User?.name}</p>
            <p className="text-sm text-primary-600 font-semibold">{doctor.specialization}</p>
         </div>
         <div className="text-right">
            <p className="text-xs text-primary-600 font-bold uppercase tracking-wide">Consultation Fee</p>
            <p className="text-xl font-bold text-primary-700">Rs. {doctor.consultation_fee}</p>
         </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Select Clinic Location</label>
          <select {...register('clinic_id', { required: 'Clinic is required' })} className="w-full border px-4 py-3 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary-500 transition font-medium">
            <option value="">-- Choose Clinic --</option>
            {doctor.Clinics?.map(c => <option key={c.id} value={c.id}>{c.name} - {c.city}</option>)}
          </select>
          {errors.clinic_id && <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.clinic_id.message}</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Date</label>
            <input type="date" {...register('date', { required: 'Date is required' })} className="w-full border px-4 py-3 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary-500 transition font-medium" />
            {errors.date && <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.date.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Time Slot</label>
            <input type="time" {...register('time', { required: 'Time is required' })} className="w-full border px-4 py-3 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary-500 transition font-medium" />
            {errors.time && <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.time.message}</span>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Visit</label>
          <textarea {...register('reason', { required: 'Reason is required' })} placeholder="Briefly describe your symptoms" className="w-full border px-4 py-3 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary-500 transition" rows="3"></textarea>
          {errors.reason && <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.reason.message}</span>}
        </div>
        <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-primary-700 shadow-md hover:shadow-lg transition-all mt-4">
          Confirm Booking Details
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
