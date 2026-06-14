import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/forgot-password', data);
      if (res.data.success) {
        toast.success(res.data.message);
        setSubmitted(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process request');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-primary-600 mb-2">Doctor Hub</h2>
        <h3 className="text-lg font-medium text-center mb-8 text-gray-500">Reset Password</h3>
        
        {submitted ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 shadow-sm">
              <p className="font-semibold">Reset Link Sent!</p>
              <p className="text-sm mt-1">If an account exists for that email, a reset password link has been sent.</p>
            </div>
            <Link to="/login" className="text-primary-600 font-bold hover:underline">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <p className="text-sm text-gray-600 mb-2 font-medium">Enter your email address and we'll send you a link to reset your password.</p>
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
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 hover:shadow-lg transition-all mt-2">
              Send Reset Link
            </button>
            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="text-gray-500 font-semibold hover:text-gray-800 transition-colors">Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
