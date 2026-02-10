import { Metadata } from 'next';
import PostListingForm from '@/components/forms/PostListingForm';
import { getCategories, getLocations } from '@/lib/queries/categories';

export const metadata: Metadata = {
  title: 'Déposer une annonce',
  description: 'Publiez votre annonce de matériel professionnel de restaurant ou café en Tunisie gratuitement.',
};

export default async function PostListingPage() {
  const [categories, locations] = await Promise.all([
    getCategories(),
    getLocations(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-slate-900 mb-2 text-center">
        Déposer une annonce
      </h1>
      <p className="text-slate-500 text-center mb-8">
        Publiez votre matériel en quelques minutes. C&apos;est gratuit.
      </p>

      <PostListingForm categories={categories} locations={locations} />
    </div>
  );
}
