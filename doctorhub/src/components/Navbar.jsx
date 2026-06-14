import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  if (!currentUser) return null;

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center">
        <Link to={`/${currentUser.role === 'super_admin'? 'superadmin' : currentUser.role}/dashboard`} className="text-xl font-bold text-primary-600 flex items-center gap-2">
          <span>Doctor Hub</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border">
          <User className="text-gray-500" size={18} />
          <span className="font-semibold text-gray-800 text-sm">{currentUser.name}</span>
          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full uppercase ml-1 font-bold">
            {currentUser.role.replace('_', ' ')}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded transition-colors font-medium border border-transparent hover:border-red-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
