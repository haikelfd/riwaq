import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="font-heading text-6xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-lg text-slate-500 mb-8">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/">
        <Button>Retour à l&apos;accueil</Button>
      </Link>
    </div>
  );
}
