import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://riwaq.tn';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/gerer/', '/deposer/succes'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
