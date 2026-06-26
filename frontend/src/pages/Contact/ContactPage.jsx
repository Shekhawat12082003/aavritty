import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { contactService } from '@/services';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const contactMutation = useMutation({
    mutationFn: contactService.submit,
    onSuccess: () => {
      setSent(true);
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    },
  });

  const onSubmit = (data) => {
    contactMutation.mutate(data);
  };

  return (
    <>
      <SEO title="Contact" description="Get in touch with AAVRITTY Business Solutions" />
      <div className="container-app py-8">
        <h1 className="section-title">Contact Us</h1>
        <p className="mt-2 text-slate-500">We'd love to hear from you. Reach out for bulk orders, vendor partnerships, or support.</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            {[
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: Mail, label: 'Email', value: 'support@aavritty.com' },
              { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India' },
              { icon: Clock, label: 'Hours', value: 'Mon - Sat: 9:00 AM - 7:00 PM' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">{item.label}</p>
                  <p className="font-medium text-slate-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-6">
            {sent ? (
              <div className="py-8 text-center">
                <p className="text-lg font-semibold text-green-600">Message Sent!</p>
                <p className="mt-2 text-sm text-slate-500">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-sm text-primary-600 hover:underline">Send another message</button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input label="Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
                  <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
                  <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
                    <textarea
                      className="input-field min-h-[120px] resize-none"
                      {...register('message', { required: 'Message is required' })}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" loading={contactMutation.isPending} className="w-full">Send Message</Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
