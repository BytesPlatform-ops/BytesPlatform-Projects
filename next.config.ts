import type { NextConfig } from "next";

/** Case studies with a PDF in public/case-studies/<slug>.pdf */
const CASE_STUDIES = "quantiva-hq|intellimaint-ai|aegis-creek|team-smith-logistics|the-benavente-group";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 430, 640, 768, 1024, 1280, 1440, 1920, 2560],
    // Every quality passed to next/image: showcase frames (90) and the viewer (92)
    qualities: [75, 90, 92],
  },
  async redirects() {
    return [{ source: "/", destination: "/projects", permanent: false }];
  },
  // Case studies live on our own domain: /case-studies/<slug> serves
  // public/case-studies/<slug>.pdf, opened in the browser's PDF viewer
  async rewrites() {
    return [{ source: `/case-studies/:slug(${CASE_STUDIES})`, destination: "/case-studies/:slug.pdf" }];
  },
  async headers() {
    return [
      {
        source: `/case-studies/:slug(${CASE_STUDIES})`,
        headers: [{ key: "Content-Disposition", value: 'inline; filename="BytesPak-:slug-case-study.pdf"' }],
      },
    ];
  },
};

export default nextConfig;
