import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
          { key: "Content-Security-Policy", value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' js.stripe.com cdnjs.cloudflare.com",
            "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
            "font-src 'self' fonts.gstatic.com",
            "img-src 'self' images.unsplash.com *.supabase.co data: blob:",
            "connect-src 'self' api.stripe.com api.anthropic.com api.openai.com api.replicate.com",
            "frame-ancestors 'none'",
          ].join('; ') },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  serverExternalPackages: ['@resvg/resvg-js'],
};

export default nextConfig;
