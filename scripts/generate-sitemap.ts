import fs from 'fs';
import path from 'path';
import { BLOG_POSTS_DATA } from '../lib/blogContent';

const BASE_URL = 'https://taleem360.online';

/**
 * Brand images shown on every page, referenced in the <image:image> blocks of
 * the sitemap so each page URL can be matched to its images. Two images:
 *  - og-image.png  : the 1200x630 share card used as the page hero
 *  - taleem_logo.png: the brand mark shown in the header and footer
 *
 * Both are real files in public/, both have alt text on the pages that consume
 * them, and neither relies on the removed/stock hero.jpg.
 */
const SITE_IMAGES = [
  { url: 'https://taleem360.online/og-image.png',
    title: 'Taleem360 — school cloud ERP and LMS suite' },
  { url: 'https://taleem360.online/taleem_logo.png',
    title: 'Taleem360 brand mark' },
];

/** Render the <image:image> block for every page URL. Both images are brand
 *  images served from the same origin as every page: og-image.png (the 1200x630
 *  share card used as each page's hero) and taleem_logo.png (the mark shown in
 *  the header and footer). Absolute URLs are used because image:loc must be a
 *  full, crawlable image URL, not a relative path. */
function imageEntries(): string {
  return SITE_IMAGES.map(
    (img) => `
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${img.title}</image:title>
    </image:image>`
  ).join('');
}

const corePages = [
  { url: '/', changefreq: 'daily', priority: '1.0', lastmod: '2026-06-21' },
  { url: '/blog', changefreq: 'daily', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/free-resources', changefreq: 'daily', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/pricing', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/daycare', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/skills-academy', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/private-tutors', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/madrasa', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/white-label', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/api', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/compare', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/biometric-attendance', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/ai-resource-studio', changefreq: 'weekly', priority: '0.7', lastmod: '2026-06-21' },
  { url: '/nigeria', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/bangladesh', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/uae', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/karachi', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/lahore', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/islamabad', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/rawalpindi', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/peshawar', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/faisalabad', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/multan', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/quetta', changefreq: 'weekly', priority: '0.8', lastmod: '2026-06-21' },
  { url: '/about', changefreq: 'monthly', priority: '0.6', lastmod: '2026-06-21' },
  { url: '/contact', changefreq: 'monthly', priority: '0.6', lastmod: '2026-06-21' },
  { url: '/faq', changefreq: 'weekly', priority: '0.6', lastmod: '2026-06-21' },
  { url: '/support', changefreq: 'monthly', priority: '0.5', lastmod: '2026-06-21' },
  { url: '/privacy', changefreq: 'monthly', priority: '0.4', lastmod: '2026-06-21' },
  { url: '/terms', changefreq: 'monthly', priority: '0.4', lastmod: '2026-06-21' },
  { url: '/cookies', changefreq: 'monthly', priority: '0.4', lastmod: '2026-06-21' },
  { url: '/refund-policy', changefreq: 'monthly', priority: '0.4', lastmod: '2026-06-21' }
];

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

sitemap += '  <!-- Core Public-Facing Pages -->\n';
for (const page of corePages) {
  sitemap += '  <url>\n';
  sitemap += `    <loc>${BASE_URL}${page.url}</loc>\n`;
  sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
  sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
  sitemap += `    <priority>${page.priority}</priority>\n`;
  sitemap += imageEntries();
  sitemap += '  </url>\n';
}

sitemap += '\n  <!-- Dynamic Blog Posts -->\n';
for (const post of BLOG_POSTS_DATA) {
  if (!post.is_published) continue;
  sitemap += '  <url>\n';
  sitemap += `    <loc>${BASE_URL}/blog/${post.slug}</loc>\n`;
  sitemap += `    <lastmod>${post.published_at}</lastmod>\n`;
  sitemap += `    <changefreq>weekly</changefreq>\n`;
  sitemap += `    <priority>0.8</priority>\n`;
  sitemap += imageEntries();
  sitemap += '  </url>\n';
}

sitemap += '</urlset>\n';

const outputPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf8');
console.log(`Sitemap generated successfully with ${corePages.length} core pages and ${BLOG_POSTS_DATA.length} blog posts at ${outputPath}`);
