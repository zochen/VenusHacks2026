/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@quietspace/shared-types',
    '@quietspace/shared-ui',
    '@quietspace/shared-lib',
  ],
};

module.exports = nextConfig;
