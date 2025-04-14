/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Remove trailing slash to ensure proper routing
  trailingSlash: false,
  // Ensure proper base path for static exports
  basePath: '',
};

module.exports = nextConfig;