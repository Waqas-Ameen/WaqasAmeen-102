import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.success) {
        login(res.data.data.user, res.data.data.token);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-primary-600 mb-2">Doctor Hub</h2>
        <h3 className="text-lg font-medium text-center mb-8 text-gray-500">Sign in to your account</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              {...register('email', { required: 'Email is required' })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all placeholder-gray-400"
              placeholder="Enter your email"
            />
            {errors.email && <span className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</span>}
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
               <label className="block text-sm font-semibold text-gray-700">Password</label>
               <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              {...register('password', { required: 'Password is required' })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all placeholder-gray-400"
              placeholder="Enter your password"
            />
            {errors.password && <span className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</span>}
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 hover:shadow-lg transition-all mt-2">
            Login
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
