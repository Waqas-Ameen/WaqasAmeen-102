import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ today: 0, pending: 0, total: 0 });

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      const allAppts = res.data.data;
      
      const today = new Date().toISOString().split('T')[0];
      const todaysAppts = allAppts.filter(a => a.appointment_date === today);
      const pendingAppts = allAppts.filter(a => a.status === 'pending');
      
      setStats({ today: todaysAppts.length, pending: pendingAppts.length, total: allAppts.length });
      setAppointments(todaysAppts.sort((a,b) => a.appointment_time.localeCompare(b.appointment_time)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleComplete = async (id) => {
    try {
      const res = await api.put(`/appointments/${id}/complete`);
      if (res.data.success) {
        toast.success('Appointment marked as completed');
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete appointment');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary-100 flex flex-col justify-center items-center">
          <p className="text-gray-500 font-semibold mb-2 uppercase tracking-wide text-sm">Today's Appointments</p>
          <p className="text-5xl font-black text-primary-600">{stats.today}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex flex-col justify-center items-center">
          <p className="text-gray-500 font-semibold mb-2 uppercase tracking-wide text-sm">Pending Bookings</p>
          <p className="text-5xl font-black text-amber-500">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-center items-center">
          <p className="text-gray-500 font-semibold mb-2 uppercase tracking-wide text-sm">Total Historic Visits</p>
          <p className="text-5xl font-black text-emerald-600">{stats.total}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-extrabold text-gray-900">Today's Schedule</h3>
        </div>
        
        {appointments.length === 0 ? (
          <p className="p-10 text-center text-gray-500 font-medium italic">No appointments scheduled for today.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {appointments.map(appt => (
              <div key={appt.id} className="p-6 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 transition">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{appt.Patient?.User?.name}</h4>
                  <p className="text-sm font-semibold text-gray-500 mt-1">{appt.appointment_time} &bull; {appt.Clinic?.name}</p>
                  <p className="text-sm text-gray-700 mt-2"><span className="font-bold text-gray-900">Reason:</span> {appt.reason}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase
                    ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 
                      appt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      appt.status === 'payment_uploaded' ? 'bg-indigo-100 text-indigo-800' :
                      appt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {appt.status.replace('_', ' ')}
                  </span>
                  
                  {appt.status === 'confirmed' && (
                    <button onClick={() => handleComplete(appt.id)} className="bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-lg border border-emerald-600 hover:bg-emerald-600 shadow-sm hover:shadow-md transition">
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default DoctorDashboard;
