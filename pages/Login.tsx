import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { MOCK_ADMIN_USER, MOCK_CUSTOMER_USER } from '../constants';
import { Candy } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // In this mock, login and register effectively do the same thing: return a token and user
      // Ideally, register would just create user, then require login. 
      // For simplicity/demo:
      const response = await api.auth.login(formData.username, formData.password);
      login(response.user, response.token);
      navigate(response.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCreds = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      setFormData({ username: MOCK_ADMIN_USER.username, password: MOCK_ADMIN_USER.password });
    } else {
      setFormData({ username: MOCK_CUSTOMER_USER.username, password: MOCK_CUSTOMER_USER.password });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="bg-brand-500 p-3 rounded-xl shadow-lg">
                <Candy className="h-10 w-10 text-white" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {isRegistering ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            {isRegistering ? 'sign in to existing account' : 'create a new account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            />

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                {isRegistering ? 'Register' : 'Sign in'}
              </Button>
            </div>
          </form>

          {!isRegistering && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-slate-500">Demo Credentials</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" onClick={() => fillDemoCreds('admin')}>
                  Admin
                </Button>
                <Button variant="outline" size="sm" onClick={() => fillDemoCreds('customer')}>
                  Customer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;