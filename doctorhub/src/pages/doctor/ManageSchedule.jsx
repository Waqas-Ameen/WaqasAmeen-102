import React from 'react';
import ManageClinics from './ManageClinics';

const ManageSchedule = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2 border-b pb-4">Manage Schedule & Locales</h2>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-blue-900 font-medium">
         Schedule timings are inherently managed at the Clinic association level in our architecture. Please configure your availability rules per clinic configuration below.
      </div>
      <ManageClinics />
    </div>
  );
};

export default ManageSchedule;
