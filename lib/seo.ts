import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  schemaMarkup?: object;
  noindex?: boolean;
}

export const useSEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://www.taleem360.online/logo.png',
  schemaMarkup,
  noindex = false,
}: SEOProps) => {
  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.toLowerCase().includes('taleem') 
      ? title 
      : `${title} | Taleem 360 Unified Education Suite`;
    document.title = fullTitle;

    // Helper to query or create meta tags
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Set basic meta tags
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // 3. Set Robots tag (noindex for legal/admin pages, aggressive indexing for commercial pages)
    setMetaTag(
      'name',
      'robots',
      noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // 4. Set OpenGraph tags
    const normalizedUrl = canonicalUrl || `https://www.taleem360.online${window.location.pathname}${window.location.search}`;
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', normalizedUrl);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'Taleem 360');

    // 5. Set Twitter Card tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. Set Canonical tag (enforcing www. domain to prevent GSC impression splitting)
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', normalizedUrl);

    // 7. Handle JSON-LD Schema markup injection
    let schemaScript = document.getElementById('dynamic-json-ld');
    if (schemaMarkup) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('id', 'dynamic-json-ld');
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      const schemaData = ('@context' in schemaMarkup)
        ? schemaMarkup
        : { '@context': 'https://schema.org', ...schemaMarkup };
      schemaScript.innerHTML = JSON.stringify(schemaData);
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }

    // Clean up on unmount or change if necessary
    return () => {
      const currentSchema = document.getElementById('dynamic-json-ld');
      if (currentSchema) {
        currentSchema.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogType, ogImage, schemaMarkup, noindex]);
};
