import fs from 'fs';
import path from 'path';
import { BLOG_POSTS_DATA } from '../lib/blogContent';

const BASE_URL = 'https://www.taleem360.online';

const corePages = [
  { url: '/', changefreq: 'daily', priority: '1.0', lastmod: '2026-06-21' },
  { url: '/pricing', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/daycare', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/madrasa', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/skills-academy', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/private-tutors', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/white-label', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/free-resources', changefreq: 'daily', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/compare', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/blog', changefreq: 'daily', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/api', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-21' },
  { url: '/about', changefreq: 'monthly', priority: '0.6', lastmod: '2026-06-21' },
  { url: '/contact', changefreq: 'monthly', priority: '0.6', lastmod: '2026-06-21' },
  { url: '/faq', changefreq: 'weekly', priority: '0.6', lastmod: '2026-06-21' },
  { url: '/support', changefreq: 'monthly', priority: '0.5', lastmod: '2026-06-21' },
  { url: '/onboarding', changefreq: 'monthly', priority: '0.7', lastmod: '2026-06-21' },
  { url: '/privacy', changefreq: 'yearly', priority: '0.2', lastmod: '2026-06-21' },
  { url: '/terms', changefreq: 'yearly', priority: '0.2', lastmod: '2026-06-21' },
  { url: '/cookies', changefreq: 'yearly', priority: '0.2', lastmod: '2026-06-21' },
  { url: '/refund-policy', changefreq: 'yearly', priority: '0.2', lastmod: '2026-06-21' }
];

const CITIES = [
  'karachi',
  'lahore',
  'islamabad',
  'rawalpindi',
  'faisalabad',
  'multan',
  'peshawar',
  'quetta',
  'sialkot',
  'gujranwala',
  'hyderabad',
  'bahawalpur',
  'sargodha',
  'sukkur',
  'abbottabad',
  'nigeria',
  'bangladesh',
  'dhaka',
  'chittagong',
  'sylhet',
  'rajshahi',
  'uae'
];

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

sitemap += '  <!-- Core Public-Facing Pages -->\n';
for (const page of corePages) {
  sitemap += '  <url>\n';
  sitemap += `    <loc>${BASE_URL}${page.url}</loc>\n`;
  sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
  sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
  sitemap += `    <priority>${page.priority}</priority>\n`;
  sitemap += '  </url>\n';
}

sitemap += '\n  <!-- Regional & City Landing Pages -->\n';
for (const city of CITIES) {
  // Shorthand route: e.g. /lahore or /bangladesh
  sitemap += '  <url>\n';
  sitemap += `    <loc>${BASE_URL}/${city}</loc>\n`;
  sitemap += `    <lastmod>2026-06-21</lastmod>\n`;
  sitemap += `    <changefreq>weekly</changefreq>\n`;
  sitemap += `    <priority>0.8</priority>\n`;
  sitemap += '  </url>\n';

  // Canonical Location path: /location/:city
  sitemap += '  <url>\n';
  sitemap += `    <loc>${BASE_URL}/location/${city}</loc>\n`;
  sitemap += `    <lastmod>2026-06-21</lastmod>\n`;
  sitemap += `    <changefreq>weekly</changefreq>\n`;
  sitemap += `    <priority>0.8</priority>\n`;
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
  sitemap += '  </url>\n';
}

sitemap += '</urlset>\n';

const outputPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf8');
console.log(`Sitemap generated successfully with ${corePages.length} core pages, ${CITIES.length * 2} regional city pages, and ${BLOG_POSTS_DATA.length} blog posts at ${outputPath}`);
