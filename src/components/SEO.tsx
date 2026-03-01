import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: object;
}

const BASE_TITLE = 'Akanexus';
const DEFAULT_DESCRIPTION = '100% Free industrial tools, React components, and templates. Build stunning interfaces faster with Akanexus.';
const DEFAULT_OG_IMAGE = 'https://lovable.dev/opengraph-image-p98pqg.png';

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  jsonLd,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} - Free Industrial Tools & Premium Frontend Solutions`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update keywords if provided
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Update canonical URL
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.setAttribute('href', canonicalUrl);
      }
    }

    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
    ];

    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      }
    });

    // Update Twitter tags
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', ogImage);
    }

    // Add JSON-LD structured data
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    // Cleanup
    return () => {
      const ldScript = document.querySelector('script[type="application/ld+json"]');
      if (ldScript) {
        ldScript.remove();
      }
    };
  }, [fullTitle, description, keywords, canonicalUrl, ogImage, ogType, jsonLd]);

  return null;
}
