/**
 * Site identity and routing.
 *
 * The Projects experience is served at the root of its own subdomain,
 * https://portfolio.bytesplatform.com, and anything that belongs to the main
 * website links out to it.
 */

export const SITE_URL = "https://bytesplatform.com";
export const basePath = "";
export const BRAND = "BytesPlatform";

/** Public URL of this app's root page */
export const PROJECTS_URL = "https://portfolio.bytesplatform.com";

/**
 * Prefix a public-folder path with the base path. next/link adds it on its
 * own, but plain <a> tags, next/image `src` and metadata URLs do not.
 */
export const withBase = (path: string) => `${basePath}${path}`;

/** Routes that belong to the main BytesPlatform website */
export const main = {
  home: `${SITE_URL}/`,
  about: `${SITE_URL}/about`,
  contact: `${SITE_URL}/contact`,
  blogs: `${SITE_URL}/blogs`,
  careers: `${SITE_URL}/careers`,
  industries: `${SITE_URL}/industries`,
  privacy: `${SITE_URL}/privacy-policy`,
  terms: `${SITE_URL}/terms-conditions`,
  service: (slug: string) => `${SITE_URL}/services/${slug}`,
};
