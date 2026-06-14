import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchParams, setSearchParams] = useState({ disease: '', type: '', city: '' });
  const navigate = useNavigate();

  const fetchDoctors = async (query = '') => {
    try {
      const res = await api.get(`/doctors/search${query}`);
      setDoctors(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.disease) params.append('disease', searchParams.disease);
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.city) params.append('city', searchParams.city);
    fetchDoctors('?' + params.toString());
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Find Doctors</h2>
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <input 
          type="text" placeholder="Search by disease..." value={searchParams.disease}
          onChange={(e) => setSearchParams({...searchParams, disease: e.target.value})}
          className="flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
        />
        <select 
          value={searchParams.type} onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
          className="px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 font-medium"
        >
          <option value="">Any Treatment Type</option>
          <option value="Allopathic">Allopathic</option>
          <option value="Homeopathic">Homeopathic</option>
          <option value="Herbal">Herbal</option>
        </select>
        <input 
          type="text" placeholder="City" value={searchParams.city}
          onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
          className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-32"
        />
        <button type="submit" className="bg-primary-600 text-white px-8 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-700 shadow-md">
          <Search size={18} /> Search
        </button>
      </form>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {doctors.map(doc => (
          <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col relative hover:shadow-lg transition group border-t-4 border-t-primary-500">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">{doc.User?.name}</h3>
            <p className="text-sm font-semibold text-primary-500 mb-4">{doc.specialization} &bull; {doc.treatment_type}</p>
            <div className="text-sm text-gray-600 space-y-2 flex-1">
              <p><span className="font-semibold text-gray-800">Experience:</span> {doc.experience_years} years</p>
              <p><span className="font-semibold text-gray-800">Consultation Fee:</span> Rs. {doc.consultation_fee}</p>
              <p className="line-clamp-2" title={JSON.stringify(doc.diseases_treated)}>
                <span className="font-semibold text-gray-800">Expertise:</span> {Array.isArray(doc.diseases_treated) ? doc.diseases_treated.join(', ') : 'Various'}
              </p>
            </div>
            <button 
              onClick={() => navigate(`/patient/book-appointment/${doc.id}`)}
              className="mt-6 w-full bg-gray-50 border border-gray-200 text-primary-700 font-bold py-2.5 rounded-lg hover:bg-primary-600 hover:text-white transition"
            >
              Book Appointment
            </button>
          </div>
        ))}
        {doctors.length === 0 && <p className="text-gray-500 col-span-2 text-center py-10 font-medium">No doctors found matching your criteria.</p>}
      </div>
    </div>
  );
};

export default SearchDoctors;
