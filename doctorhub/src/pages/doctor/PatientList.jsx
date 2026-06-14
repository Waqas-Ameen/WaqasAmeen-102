import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/appointments');
        const validAppts = res.data.data.filter(a => ['confirmed', 'completed'].includes(a.status));
        
        const uniquePatientsMap = new Map();
        validAppts.forEach(appt => {
          if (appt.Patient) {
            uniquePatientsMap.set(appt.Patient.id, { patient: appt.Patient, apptId: appt.id });
          }
        });
        
        setPatients(Array.from(uniquePatientsMap.values()));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-gray-900">My Patients Roster</h2>
      <p className="text-gray-500 font-medium">Patients appear in this ledger only if they have had at least one confirmed or completed appointment.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(({patient, apptId}) => (
          <div key={patient.id} className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative">
            <h3 className="text-2xl font-extrabold text-gray-900">{patient.User?.name}</h3>
            <p className="text-sm font-bold tracking-widest uppercase text-primary-500 mt-1 mb-5">{patient.gender} &bull; {patient.blood_group || 'N/R'} &bull; DOB: {patient.date_of_birth}</p>
            
            <div className="flex-1 text-sm text-gray-600 space-y-2 font-medium">
              <p><span className="font-bold text-gray-800">Email:</span> {patient.User?.email}</p>
              <p><span className="font-bold text-gray-800">Phone:</span> {patient.User?.phone}</p>
              <p><span className="font-bold text-gray-800">Emergency Contact:</span> {patient.emergency_contact || 'N/A'}</p>
            </div>
            
            <div className="mt-8 flex flex-col pt-4 border-t border-gray-100">
              <button 
                onClick={() => navigate(`/doctor/add-prescription/${patient.id}/${apptId}`)}
                className="w-full flex items-center justify-center gap-2 bg-white text-primary-700 font-bold py-3 rounded-xl border-2 border-primary-100 hover:bg-primary-50 hover:border-primary-200 transition shadow-sm"
              >
                <PlusCircle size={20} /> Generate Medical Record
              </button>
            </div>
          </div>
        ))}
        {patients.length === 0 && (
          <div className="bg-white p-10 border border-dashed border-gray-300 rounded-2xl col-span-full">
             <p className="text-gray-500 font-medium text-center">No active patient linkages established yet. As your appointments are confirmed they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
