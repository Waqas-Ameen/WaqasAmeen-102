import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import SearchDoctors from './pages/patient/SearchDoctors';
import BookAppointment from './pages/patient/BookAppointment';
import UploadPayment from './pages/patient/UploadPayment';
import MyAppointments from './pages/patient/MyAppointments';
import MedicalHistory from './pages/patient/MedicalHistory';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ManageSchedule from './pages/doctor/ManageSchedule';
import ManageClinics from './pages/doctor/ManageClinics';
import PatientList from './pages/doctor/PatientList';
import AddPrescription from './pages/doctor/AddPrescription';

// Assistant Pages
import AssistantDashboard from './pages/assistant/AssistantDashboard';
import VerifyPayments from './pages/assistant/VerifyPayments';

// Admin / Super Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDoctors from './pages/admin/ManageDoctors';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

// Layout wrapper for authenticated users
const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden text-gray-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar className="z-20" />
        <main className="flex-1 overflow-y-auto p-8 z-10 w-full relative">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-100/60 pointer-events-none"></div>
          <div className="relative max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { fontWeight: 'bold' } }} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes utilizing Layout */}
          <Route element={<DashboardLayout />}>
            
            {/* Patient Routes */}
            <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
            <Route path="/patient/search-doctors" element={<ProtectedRoute allowedRoles={['patient']}><SearchDoctors /></ProtectedRoute>} />
            <Route path="/patient/book-appointment/:docId" element={<ProtectedRoute allowedRoles={['patient']}><BookAppointment /></ProtectedRoute>} />
            <Route path="/patient/upload-payment/:apptId" element={<ProtectedRoute allowedRoles={['patient']}><UploadPayment /></ProtectedRoute>} />
            <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><MyAppointments /></ProtectedRoute>} />
            <Route path="/patient/history" element={<ProtectedRoute allowedRoles={['patient']}><MedicalHistory /></ProtectedRoute>} />

            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/schedule" element={<ProtectedRoute allowedRoles={['doctor']}><ManageSchedule /></ProtectedRoute>} />
            <Route path="/doctor/clinics" element={<ProtectedRoute allowedRoles={['doctor']}><ManageClinics /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={['doctor']}><PatientList /></ProtectedRoute>} />
            <Route path="/doctor/add-prescription/:patId/:apptId" element={<ProtectedRoute allowedRoles={['doctor']}><AddPrescription /></ProtectedRoute>} />

            {/* Assistant Routes */}
            <Route path="/assistant/dashboard" element={<ProtectedRoute allowedRoles={['assistant']}><AssistantDashboard /></ProtectedRoute>} />
            <Route path="/assistant/verify-payments" element={<ProtectedRoute allowedRoles={['assistant']}><VerifyPayments /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ManageUsers /></ProtectedRoute>} />
            <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ManageDoctors /></ProtectedRoute>} />

            {/* Super Admin Route */}
            <Route path="/superadmin/dashboard" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminDashboard /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
