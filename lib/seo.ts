import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  schemaMarkup?: object;
}

export const useSEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  schemaMarkup,
}: SEOProps) => {
  useEffect(() => {
    // 1. Update document title
    const fullTitle = `${title} | Taleem360 Unified Education Suite`;
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

    // 3. Set OpenGraph tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', canonicalUrl || window.location.href);
    setMetaTag('property', 'og:image', 'https://www.taleem360.online/logo.png');

    // 4. Set Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl || window.location.href);

    // 5. Handle JSON-LD Schema markup injection
    let schemaScript = document.getElementById('dynamic-json-ld');
    if (schemaMarkup) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('id', 'dynamic-json-ld');
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.innerHTML = JSON.stringify({
        '@context': 'https://schema.org',
        ...schemaMarkup,
      });
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }

    // Clean up on unmount or change if necessary
    return () => {
      // Keep main tags but remove dynamic schema to avoid leaks
      const currentSchema = document.getElementById('dynamic-json-ld');
      if (currentSchema) {
        currentSchema.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogType, schemaMarkup]);
};
