/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.103",
        port: "8005",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8005",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8005",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "backend.logicraftit.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/public/upload/:path*",
        destination: "/upload/:path*",
      },
    ];
  },

  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
