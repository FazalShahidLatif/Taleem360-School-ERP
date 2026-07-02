import React, { useEffect } from 'react';

export interface ResourceSEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  slug?: string;
  category?: string;
  subject?: string;
  ageGroup?: string;
  keywords?: string[];
  structuredDataType?: string;
  isHubPage?: boolean;
  itemList?: { name: string; slug: string }[];
}

export const ResourceSEOHead: React.FC<ResourceSEOHeadProps> = ({
  title,
  description,
  image,
  slug,
  category = 'mathematics',
  subject = 'all',
  ageGroup = 'all',
  keywords = [],
  structuredDataType = 'DigitalDocument',
  isHubPage = false,
  itemList = []
}) => {
  const baseUrl = 'https://taleem360.online';
  const finalTitle = title || `Free Educational Resources Hub | Taleem360`;
  const finalDescription = description || `Access thousands of curriculum-aligned free educational resources, lesson planners, interactive quizzes, exam mocks, and tracing guides.`;
  
  // High-CTR educational og:image fallback
  const finalImage = image || `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&h=630&q=80`;
  const currentUrl = slug ? `${baseUrl}/free-resources/${category}/${subject}/${ageGroup}?resource=${slug}` : `${baseUrl}/free-resources/${category}/${subject}/${ageGroup}`;

  useEffect(() => {
    // Helper to dynamically set or create meta tags in the head
    const setMetaTag = (attribute: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 1. Dynamic document title
    document.title = finalTitle;

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', finalDescription);
    if (keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '));
    }

    // 3. Open Graph Tags (Optimized for Pinterest, WhatsApp, and educational forums)
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', isHubPage ? 'website' : 'article');
    setMetaTag('property', 'og:site_name', 'Taleem360');

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:image', finalImage);

    // 5. Schema.org JSON-LD Serialization
    const oldSchema = document.getElementById('taleem360-seo-schema');
    if (oldSchema) {
      oldSchema.remove();
    }

    let schemaObject: Record<string, any> = {};

    if (isHubPage) {
      schemaObject = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": finalTitle,
        "description": finalDescription,
        "url": currentUrl,
        "publisher": {
          "@type": "Organization",
          "name": "Taleem360",
          "url": baseUrl
        },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": itemList.length,
          "itemListElement": itemList.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${baseUrl}/free-resources/${category}/${subject}/${ageGroup}?resource=${item.slug}`,
            "name": item.name
          }))
        }
      };
    } else {
      schemaObject = {
        "@context": "https://schema.org",
        "@type": structuredDataType || 'DigitalDocument',
        "name": finalTitle,
        "description": finalDescription,
        "url": currentUrl,
        "inLanguage": "en",
        "publisher": {
          "@type": "Organization",
          "name": "Taleem360",
          "url": baseUrl
        }
      };
    }

    const script = document.createElement('script');
    script.id = 'taleem360-seo-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject, null, 2);
    document.head.appendChild(script);

    return () => {
      // Graceful cleanup on component unmount
      const schemaToClean = document.getElementById('taleem360-seo-schema');
      if (schemaToClean) {
        schemaToClean.remove();
      }
    };
  }, [finalTitle, finalDescription, finalImage, currentUrl, isHubPage, itemList, keywords, structuredDataType, category, subject, ageGroup]);

  return null;
};
