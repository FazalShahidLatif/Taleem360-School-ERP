// routes/freeResourcesRoutes.ts
import express from 'express';
import { FreeResourcesRepository, FreeResource } from '../repository/freeResources.ts';

const router = express.Router();
const repo = new FreeResourcesRepository();

/**
 * Helper to generate valid JSON-LD SEO schema based on Educational Standards
 */
export function generateJsonLdSchema(resource: FreeResource, baseUrl: string = 'https://taleem360.online'): Record<string, any> {
  const resourceUrl = `${baseUrl}/free-resources/${resource.slug}`;
  const common = {
    "@context": "https://schema.org",
    "name": resource.seo?.metaTitle || resource.title,
    "description": resource.seo?.metaDescription || resource.description,
    "url": resourceUrl,
    "inLanguage": "en",
    "publisher": {
      "@type": "Organization",
      "name": "Taleem360",
      "url": "https://taleem360.online"
    }
  };

  const schemaType = resource.seo?.structuredDataType || 'DigitalDocument';

  if (schemaType === 'Course') {
    return {
      ...common,
      "@type": "Course",
      "provider": {
        "@type": "Organization",
        "name": "Taleem360",
        "sameAs": "https://taleem360.online"
      },
      "educationalLevel": resource.framework?.gradeLevel,
      "about": resource.framework?.standardCode || resource.framework?.syllabusCode
    };
  }

  if (schemaType === 'DigitalDocument') {
    return {
      ...common,
      "@type": "DigitalDocument",
      "fileFormat": resource.payload?.cdnPdfUrl ? "application/pdf" : "text/html",
      "educationalAlignment": {
        "@type": "AlignmentObject",
        "alignmentType": "educationalLevel",
        "educationalFramework": resource.framework?.frameworkName,
        "targetName": resource.framework?.gradeLevel
      }
    };
  }

  // InteractiveReview or CreativeWork fallback
  return {
    ...common,
    "@type": "CreativeWork",
    "learningResourceType": schemaType,
    "educationalAlignment": {
      "@type": "AlignmentObject",
      "alignmentType": "educationalLevel",
      "educationalFramework": resource.framework?.frameworkName,
      "targetName": resource.framework?.gradeLevel,
      "targetUrl": resource.framework?.standardCode ? `https://standards.org/${resource.framework.standardCode}` : undefined
    }
  };
}

/**
 * 1. GET /api/free-resources
 * Retrieves all public global resources
 */
router.get('/api/free-resources', async (req, res) => {
  try {
    const resources = await repo.getAllActiveResources();
    const mapped = resources.map(resource => ({
      ...resource,
      jsonLd: generateJsonLdSchema(resource, `${req.protocol}://${req.get('host')}`)
    }));
    return res.status(200).json(mapped);
  } catch (err) {
    console.error('[API Error] Fetching free-resources failed:', err);
    return res.status(500).json({ error: 'Failed to fetch free educational resources.' });
  }
});

/**
 * 2. GET /api/free-resources/framework/:framework
 * Retrieves resources aligned with standard curriculums (Cambridge, EYFS, etc)
 */
router.get('/api/free-resources/framework/:framework', async (req, res) => {
  const { framework } = req.params;
  const grade = req.query.grade as string | undefined;

  try {
    const resources = await repo.getResourcesByFramework(framework, grade);
    const mapped = resources.map(resource => ({
      ...resource,
      jsonLd: generateJsonLdSchema(resource, `${req.protocol}://${req.get('host')}`)
    }));
    return res.status(200).json(mapped);
  } catch (err) {
    console.error('[API Error] Fetching free-resources by framework failed:', err);
    return res.status(500).json({ error: 'Failed to filter free resources by curriculum standard.' });
  }
});

/**
 * 3. GET /api/free-resources/slug/:slug
 * Retrieves detailed resource including dynamic server-rendered schema.org string
 */
router.get('/api/free-resources/slug/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const resource = await repo.getGlobalResourceBySlug(slug);
    if (!resource) {
      return res.status(404).json({ error: 'Free educational resource not found.' });
    }

    const jsonLd = generateJsonLdSchema(resource, `${req.protocol}://${req.get('host')}`);

    return res.status(200).json({
      ...resource,
      jsonLd,
      jsonLdString: JSON.stringify(jsonLd, null, 2)
    });
  } catch (err) {
    console.error('[API Error] Fetching resource by slug failed:', err);
    return res.status(500).json({ error: 'Failed to retrieve educational content detail.' });
  }
});

/**
 * 4. GET /sitemap-resources.xml
 * Dynamic XML sitemap endpoint strictly located at taleem360.online/sitemap-resources.xml
 * compliant with Sitemaps.org, with Edge caching headers & stale-while-revalidate.
 */
router.get('/sitemap-resources.xml', async (req, res) => {
  try {
    const resources = await repo.getAllActiveResources();
    const baseUrl = 'https://taleem360.online';

    // Build XML string conforming to Sitemaps.org protocols
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Static landing pages
    const todayStr = new Date().toISOString().split('T')[0];
    const staticUrls = [
      { path: '/free-resources', priority: '1.0', changefreq: 'daily' },
      { path: '/free-resources/mathematics/all/all', priority: '0.9', changefreq: 'daily' },
      { path: '/free-resources/languages/all/all', priority: '0.9', changefreq: 'daily' },
      { path: '/free-resources/sciences/all/all', priority: '0.9', changefreq: 'daily' },
    ];

    for (const urlInfo of staticUrls) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${urlInfo.path}</loc>\n`;
      xml += `    <lastmod>${todayStr}</lastmod>\n`;
      xml += `    <changefreq>${urlInfo.changefreq}</changefreq>\n`;
      xml += `    <priority>${urlInfo.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // 2. Dynamic resources mapping
    for (const r of resources) {
      // Clean slug or use encoded string
      const cleanSlug = encodeURIComponent(r.slug);
      
      const categoryPath = r.framework.frameworkName.toLowerCase().includes('math') ? 'mathematics' :
                           r.framework.frameworkName.toLowerCase().includes('eyfs') || r.framework.frameworkName.toLowerCase().includes('literacy') ? 'languages' : 'sciences';
      const subjectPath = r.slug.includes('phonics') ? 'phonics' :
                          r.slug.includes('grammar') ? 'grammar' :
                          r.slug.includes('fraction') || r.slug.includes('percentage') ? 'fractions' :
                          r.slug.includes('algebra') || r.slug.includes('linear') ? 'algebra' :
                          r.slug.includes('trigonometry') ? 'trigonometry' :
                          r.slug.includes('biology') || r.slug.includes('cell') || r.slug.includes('anatomy') ? 'biology' : 'physics';
      const agePath = r.framework.gradeLevel.toLowerCase().includes('nursery') ? 'nursery' :
                      r.framework.gradeLevel.toLowerCase().includes('grade 2') || r.framework.gradeLevel.toLowerCase().includes('grade-2') || r.framework.gradeLevel.toLowerCase().includes('1-3') ? 'grade-2' :
                      r.framework.gradeLevel.toLowerCase().includes('grade 5') || r.framework.gradeLevel.toLowerCase().includes('grade-5') || r.framework.gradeLevel.toLowerCase().includes('4-6') ? 'grade-5' :
                      r.framework.gradeLevel.toLowerCase().includes('grade 8') || r.framework.gradeLevel.toLowerCase().includes('grade-8') || r.framework.gradeLevel.toLowerCase().includes('7-8') ? 'grade-8' : 'grade-10';

      const detailUrl = `${baseUrl}/free-resources/${categoryPath}/${subjectPath}/${agePath}?resource=${cleanSlug}`;
      const lastMod = (r.updatedAt || r.createdAt || new Date()).toISOString().split('T')[0];

      xml += `  <url>\n`;
      xml += `    <loc>${detailUrl}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    // Configure cache headers: 1 hour max-age, 1 day stale-while-revalidate
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(xml);
  } catch (err) {
    console.error('[Sitemap Error] Generation failed:', err);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Internal Server Error</error>');
  }
});

export default router;
