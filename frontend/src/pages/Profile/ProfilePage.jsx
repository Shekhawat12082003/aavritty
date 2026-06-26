import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/store';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { userService } from '@/services';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  const profileMutation = useMutation({
    mutationFn: (data) => userService.updateProfile(user.id, data),
    onSuccess: () => {
      setSuccess(true);
      setError('');
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data) => {
    profileMutation.mutate(data);
  };

  return (
    <>
      <SEO title="Profile" />
      <div className="container-app py-8">
        <h1 className="section-title">My Profile</h1>

        {success && (
          <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="card p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
              {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
            </div>
            <h2 className="mt-4 font-semibold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-slate-400">{user?.email || 'demo@aavritty.com'}</p>
            <span className="badge mt-2 bg-primary-50 text-primary-700">{user?.role || 'CUSTOMER'}</span>
          </div>

          <div className="card p-6 lg:col-span-2">
            <h3 className="font-semibold">Personal Information</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" error={errors.firstName?.message} {...register('firstName', { required: 'Required' })} />
                <Input label="Last Name" error={errors.lastName?.message} {...register('lastName', { required: 'Required' })} />
              </div>
              <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Required' })} />
              <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
              <Button type="submit" loading={profileMutation.isPending}>Save Changes</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
