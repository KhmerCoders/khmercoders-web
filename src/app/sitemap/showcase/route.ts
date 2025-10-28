import { getDB } from '@/libs/db';
import { ArticleReviewStatus } from '@/types';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const db = await getDB();

  // Get all approved showcases for sitemap
  const showcases = await db.query.showcase.findMany({
    where: (showcase, { eq }) => eq(showcase.reviewStatus, ArticleReviewStatus.Approved),
    columns: {
      alias: true,
      updatedAt: true,
    },
    orderBy: (showcase, { desc }) => [desc(showcase.updatedAt)],
  });

  const url = showcases
    .map(
      showcase => `<url>
  <loc>${`https://khmercoder.com/showcase/${showcase.alias}`}</loc>
  <lastmod>${showcase.updatedAt.toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`
    )
    .join('\n  ');

  // Add the main showcase page
  const showcaseIndexUrl = `<url>
  <loc>https://khmercoder.com/showcase</loc>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>`;

  const result = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${showcaseIndexUrl}
  ${url}
</urlset>`;

  return new Response(result, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
