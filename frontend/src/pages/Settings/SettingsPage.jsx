import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function SettingsPage() {
  return (
    <>
      <SEO title="Settings" />
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-xl font-bold text-primary-950">Settings</h2>
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
            <form className="mt-4 space-y-4">
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
              <Input label="Confirm Password" type="password" />
              <Button type="button">Update Password</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
