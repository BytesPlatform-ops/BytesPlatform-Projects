/**
 * Site identity and routing.
 *
 * The Projects experience is served at https://bytesplatform.com/projects as
 * its own Next.js zone: every page, asset and image of this app lives under
 * `basePath`, and anything that belongs to the main website links out to it.
 */

export const SITE_URL = "https://bytesplatform.com";
export const basePath = "/projects";
export const BRAND = "BytesPlatform";

/** Public URL of this app's root page */
export const PROJECTS_URL = `${SITE_URL}${basePath}`;

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
