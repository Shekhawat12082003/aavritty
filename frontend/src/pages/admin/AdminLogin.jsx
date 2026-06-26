import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, User } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAdminAuthStore } from '@/store';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { login } = useAdminAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    try {
      await login(data.email, data.password);
      console.log('Login successful, navigating to /admin/dashboard');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid admin credentials');
    }
  };

  return (
    <>
      <SEO title="Admin Login" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Panel</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in with your admin credentials</p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                icon={<User className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email', { required: 'Email is required' })}
              />
              <Input
                label="Password"
                type="password"
                icon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="text-center">
            <a href="/" className="text-sm text-primary-600 hover:text-primary-500">
              Back to Customer Site
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
