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

export default router;
