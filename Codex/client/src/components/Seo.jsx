import { Helmet } from "react-helmet-async";
import { siteConfig, toAbsoluteUrl } from "../utils/siteConfig";

export default function Seo({
  title,
  description,
  keywords,
  path = "/",
  image = siteConfig.defaultOgImage,
  type = "website",
  schema = [],
  noIndex = false
}) {
  const pageTitle = title || siteConfig.defaultTitle;
  const pageDescription = description || siteConfig.defaultDescription;
  const pageKeywords = Array.isArray(keywords) ? keywords.join(", ") : siteConfig.defaultKeywords.join(", ");
  const canonicalUrl = toAbsoluteUrl(path);
  const imageUrl = toAbsoluteUrl(image);
  const schemaList = Array.isArray(schema) ? schema : [schema];

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteConfig.siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ? (
        <meta
          name="google-site-verification"
          content={import.meta.env.VITE_GOOGLE_SITE_VERIFICATION}
        />
      ) : null}
      {import.meta.env.VITE_BING_SITE_VERIFICATION ? (
        <meta
          name="msvalidate.01"
          content={import.meta.env.VITE_BING_SITE_VERIFICATION}
        />
      ) : null}

      {schemaList.filter(Boolean).map((item, index) => (
        <script key={`${canonicalUrl}-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
