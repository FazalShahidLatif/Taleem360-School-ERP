import fs from 'fs';
import path from 'path';
import { BLOG_POSTS_DATA } from '../lib/blogContent';

const BASE_URL = 'https://taleem360.online';

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
console.log(`Sitemap generated successfully with ${corePages.length} core pages and ${BLOG_POSTS_DATA.length} blog posts at ${outputPath}`);
