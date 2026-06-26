import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { authService } from '@/services';
import { useAuthStore } from '@/store';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(data);
      login(res.data.data.user, res.data.data.accessToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try demo: demo@aavritty.com / Demo@1234');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = () => {
    login(
      { id: 'demo', email: 'demo@aavritty.com', firstName: 'Demo', lastName: 'User', role: 'CUSTOMER' },
      'demo-token',
    );
    navigate('/');
  };

  return (
    <>
      <SEO title="Login" />
      <div className="w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-primary-950">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to your AAVRITTY account</p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
          <Input label="Password" type="password" error={errors.password?.message} {...register('password', { required: 'Password is required' })} />

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">Forgot password?</Link>
          </div>

          <Button type="submit" loading={loading} className="w-full">Sign In</Button>
        </form>

        <button onClick={demoLogin} className="btn-secondary mt-3 w-full">
          Continue as Demo User
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:underline">Register</Link>
        </p>
      </div>
    </>
  );
}
