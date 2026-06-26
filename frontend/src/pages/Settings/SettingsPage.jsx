import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { userService } from '@/services';
import { useAuthStore } from '@/store';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const passwordMutation = useMutation({
    mutationFn: (data) => userService.changePassword(user.id, data),
    onSuccess: () => {
      setSuccess(true);
      setError('');
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to update password');
    },
  });

  const onPasswordSubmit = (data) => {
    passwordMutation.mutate(data);
  };

  return (
    <>
      <SEO title="Settings" />
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-xl font-bold text-primary-950">Settings</h2>
        
        {success && (
          <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">
            Settings updated successfully!
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold">Notifications</h3>
            <div className="mt-4 space-y-3">
              {['Order updates', 'Promotional emails', 'Price drop alerts', 'New product alerts'].map((item) => (
                <label key={item} className="flex items-center justify-between">
                  <span className="text-sm">{item}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-primary-600" />
                </label>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold">Change Password</h3>
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="mt-4 space-y-4">
              <Input label="Current Password" type="password" error={errors.currentPassword?.message} {...register('currentPassword', { required: 'Required' })} />
              <Input label="New Password" type="password" error={errors.newPassword?.message} {...register('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} />
              <Input label="Confirm Password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword', {
                required: 'Required',
                validate: (value, formValues) => value === formValues.newPassword || 'Passwords do not match'
              })} />
              <Button type="submit" loading={passwordMutation.isPending}>Update Password</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
