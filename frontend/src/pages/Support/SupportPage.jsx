import { useForm } from 'react-hook-form';
import { useState } from 'react';
import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <>
      <SEO title="Support" />
      <div className="container-app max-w-2xl py-8">
        <h1 className="section-title">Support Center</h1>
        <p className="mt-2 text-slate-500">Submit a ticket and our team will respond within 24 hours</p>

        {submitted ? (
          <div className="card mt-8 p-8 text-center">
            <p className="text-lg font-semibold text-green-600">Ticket Submitted!</p>
            <p className="mt-2 text-sm text-slate-500">Ticket #TKT-{Date.now().toString().slice(-6)} — We'll respond soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(() => setSubmitted(true))} className="card mt-8 space-y-4 p-6">
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
            </div>
            <Button type="submit" className="w-full">Submit Ticket</Button>
          </form>
        )}
      </div>
    </>
  );
}
