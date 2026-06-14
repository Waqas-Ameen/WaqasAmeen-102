import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      data.role = 'patient'; // Public registration limits to patient
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        toast.success('Registration successful. You are now logged in.');
        login(res.data.data.user, res.data.data.token);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-primary-600 mb-2">Doctor Hub</h2>
        <h3 className="text-lg font-medium text-center mb-8 text-gray-500">Create a Patient Account</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              {...register('name', { required: 'Name is required' })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all placeholder-gray-400"
              placeholder="Your full name"
            />
            {errors.name && <span className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              {...register('email', { required: 'Email is required' })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all placeholder-gray-400"
              placeholder="Your email address"
            />
            {errors.email && <span className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input 
              type="text" 
              {...register('phone', { required: 'Phone is required' })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all placeholder-gray-400"
              placeholder="Your phone number"
            />
            {errors.phone && <span className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all placeholder-gray-400"
              placeholder="Create a password"
            />
            {errors.password && <span className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</span>}
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 hover:shadow-lg transition-all mt-2">
            Register Account
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Log In here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
