import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
  images: {
    domains: [
      "kayapalat.co",             // ✅ allow your own domain
      "images.unsplash.com",
      "source.unsplash.com",
      "plus.unsplash.com",
      "i.pravatar.cc",
      "placehold.co",
    ],
  },
  experimental: {
    turbo: {
      resolveAlias: {},
      rules: {},
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        mysql2: 'commonjs mysql2',
      });
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // ✅ Add redirects here
  async redirects() {
    return [
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
     
      {
        source: "/blog/false-ceiling-design-for-office",
        destination: "/blogs/false-ceiling-design-for-office",
        permanent: true,
      },
      {
        source: "/how-to-choose-the-perfect-wardrobe.php",
        destination: "/blogs/how-to-choose-the-perfect-wardrobe",
        permanent: true,
      },
     
      {
        source: "/simple-kitchen-design-ideas.php",
        destination: "/blogs/simple-kitchen-design-ideas",
        permanent: true,
      },
      {
        source: "/blog/space-saving-furniture-designs/",
        destination: "/blogs/space-saving-furniture-designs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
