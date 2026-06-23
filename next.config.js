/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  images: {
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
