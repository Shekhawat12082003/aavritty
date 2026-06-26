import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/store';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <SEO title="Profile" />
      <div className="container-app py-8">
        <h1 className="section-title">My Profile</h1>

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
            <form className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" defaultValue={user?.firstName || ''} />
                <Input label="Last Name" defaultValue={user?.lastName || ''} />
              </div>
              <Input label="Email" type="email" defaultValue={user?.email || ''} />
              <Input label="Phone" defaultValue="" />
              <Button type="button">Save Changes</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
