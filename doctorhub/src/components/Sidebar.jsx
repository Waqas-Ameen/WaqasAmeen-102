import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Calendar, Users, ClipboardList, Shield, Building, FileText, Search } from 'lucide-react';

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return null;

  let links = [];

  switch (currentUser.role) {
    case 'patient':
      links = [
        { path: '/patient/dashboard', icon:  <Home size={20} />, label: 'Dashboard' },
        { path: '/patient/search-doctors', icon: <Search size={20} />, label: 'Find Doctors' },
        { path: '/patient/appointments', icon: <Calendar size={20} />, label: 'My Appointments' },
        { path: '/patient/history', icon: <ClipboardList size={20} />, label: 'Medical History' },
      ];
      break;
    case 'doctor':
      links = [
        { path: '/doctor/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
        { path: '/doctor/schedule', icon: <Calendar size={20} />, label: 'Manage Schedule' },
        { path: '/doctor/clinics', icon: <Building size={20} />, label: 'My Clinics' },
        { path: '/doctor/patients', icon: <Users size={20} />, label: 'My Patients' },
      ];
      break;
    case 'assistant':
      links = [
        { path: '/assistant/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
        { path: '/assistant/verify-payments', icon: <FileText size={20} />, label: 'Verify Payments' },
      ];
      break;
    case 'admin':
      links = [
        { path: '/admin/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Manage Users' },
        { path: '/admin/doctors', icon: <Shield size={20} />, label: 'Verify Doctors' },
      ];
      break;
    case 'super_admin':
      links = [
        { path: '/superadmin/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Manage Users' },
        { path: '/admin/doctors', icon: <Shield size={20} />, label: 'Verify Doctors' },
      ];
      break;
    default:
      break;
  }

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-[calc(100vh-65px)] pt-4 flex flex-col">
      <nav className="flex flex-col gap-1 px-3 mt-4 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span className="font-medium tracking-wide">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-6 text-xs text-gray-500 text-center border-t border-gray-800">
        Doctor Hub Portal &copy; 2024
      </div>
    </aside>
  );
};

export default Sidebar;
