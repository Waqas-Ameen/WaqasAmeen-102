import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data.data.sort((a,b) => new Date(b.appointment_date) - new Date(a.appointment_date)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await api.put(`/appointments/${id}/cancel`);
      if (res.data.success) {
        toast.success('Appointment cancelled');
        fetchAppointments();
      }
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <th className="py-4 px-6 font-bold">Doctor & Clinic</th>
                <th className="py-4 px-6 font-bold">Date & Time</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right" style={{ minWidth: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appt => (
                <tr key={appt.id} className="border-b border-gray-50 hover:bg-gray-50/70 transition">
                  <td className="py-5 px-6">
                    <p className="font-extrabold text-gray-900">{appt.Doctor?.User?.name}</p>
                    <p className="text-sm font-semibold text-gray-500 mt-1">{appt.Clinic?.name} &bull; {appt.Clinic?.city}</p>
                  </td>
                  <td className="py-5 px-6">
                    <p className="font-bold text-gray-800">{appt.appointment_date}</p>
                    <p className="text-sm font-semibold text-gray-500 mt-1">{appt.appointment_time}</p>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase
                      ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 
                        appt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        appt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                        appt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-primary-100 text-primary-800'}`}>
                      {appt.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right space-x-2 whitespace-nowrap">
                    {appt.status === 'pending' && (
                      <>
                        <button onClick={() => navigate(`/patient/upload-payment/${appt.id}`)} className="text-xs font-bold bg-primary-100 text-primary-700 px-4 py-2 rounded border border-primary-200 hover:bg-primary-200 transition">
                          PAY NOW
                        </button>
                        <button onClick={() => handleCancel(appt.id)} className="text-xs font-bold bg-white text-red-600 border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 transition">
                          CANCEL
                        </button>
                      </>
                    )}
                    {appt.status === 'completed' && (
                      <button onClick={() => navigate('/patient/history')} className="text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded hover:bg-blue-100 transition">
                        VIEW HISTORY
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500 font-medium">No appointments currently found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyAppointments;
