import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const PatientDashboard = () => {
  const [stats, setStats] = useState({ upcoming: 0, historyCount: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [apptRes, histRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/history')
        ]);
        
        const appointments = apptRes.data.data || [];
        const history = histRes.data.data || [];

        const upcoming = appointments.filter(a => ['pending', 'payment_uploaded', 'confirmed'].includes(a.status)).length;
        
        setStats({ upcoming, historyCount: history.length });
        
        setRecentAppointments(
          appointments.sort((a,b) => new Date(b.appointment_date) - new Date(a.appointment_date)).slice(0, 5)
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Welcome to Patient Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-600">Upcoming Appointments</h3>
          <p className="text-5xl font-bold text-primary-600 mt-2">{stats.upcoming}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-600">Medical Records</h3>
          <p className="text-5xl font-bold text-primary-600 mt-2">{stats.historyCount}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Appointments</h3>
        {recentAppointments.length === 0 ? (
          <p className="text-gray-500 italic">No recent appointments found.</p>
        ) : (
          <div className="space-y-4">
            {recentAppointments.map(appt => (
              <div key={appt.id} className="p-5 border rounded-xl flex justify-between items-center hover:shadow-md transition">
                <div>
                  <p className="font-bold text-lg text-gray-800">{appt.Doctor?.User?.name || 'Doctor'}</p>
                  <p className="text-sm font-semibold text-gray-500 mt-1">{appt.appointment_date} at {appt.appointment_time}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase
                  ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 
                    appt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                    appt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-primary-100 text-primary-800'}`}>
                  {appt.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
