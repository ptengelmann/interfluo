/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    typedRoutes: false,
  },
  transpilePackages: ['@interfluo/core', '@interfluo/sdk'],
};

export default nextConfig;
