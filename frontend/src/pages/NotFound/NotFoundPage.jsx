import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Button from '@/components/common/Button';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" />
      <div className="container-app flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="font-display text-8xl font-bold text-primary-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Page Not Found</h1>
        <p className="mt-2 text-slate-500">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="mt-8">
          <Button><Home className="h-4 w-4" /> Back to Home</Button>
        </Link>
      </div>
    </>
  );
}
