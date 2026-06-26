import { useForm } from 'react-hook-form';
import { useState } from 'react';
import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useMutation } from '@tanstack/react-query';
import { supportService } from '@/services';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [ticketId, setTicketId] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const ticketMutation = useMutation({
    mutationFn: supportService.submitTicket,
    onSuccess: (data) => {
      setTicketId(data.id ? `TKT-${data.id.slice(0, 6)}` : `TKT-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to submit ticket. Please try again.');
    },
  });

  const onSubmit = (data) => {
    ticketMutation.mutate(data);
  };

  const handleReset = () => {
    setSubmitted(false);
    setError('');
    setTicketId('');
  };

  return (
    <>
      <SEO title="Support" />
      <div className="container-app max-w-2xl py-8">
        <h1 className="section-title">Support Center</h1>
        <p className="mt-2 text-slate-500">Submit a ticket and our team will respond within 24 hours</p>

        {submitted ? (
          <div className="card mt-8 p-8 text-center">
            <p className="text-lg font-semibold text-green-600">Ticket Submitted!</p>
            <p className="mt-2 text-sm text-slate-500">Ticket #{ticketId} — We'll respond soon.</p>
            <button onClick={handleReset} className="mt-4 text-sm text-primary-600 hover:underline">Submit another ticket</button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="card mt-8 space-y-4 p-6">
              <Input label="Subject" error={errors.subject?.message} {...register('subject', { required: 'Required' })} />
              <div>
                <label className="mb-1.5 block text-sm font-medium">Priority</label>
                <select className="input-field" {...register('priority')}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Message</label>
                <textarea className="input-field min-h-[150px]" {...register('message', { required: 'Required' })} />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>
              <Button type="submit" loading={ticketMutation.isPending} className="w-full">Submit Ticket</Button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
