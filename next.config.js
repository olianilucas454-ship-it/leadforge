/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: fontMode(),
  output: process.env.MOBILE_BUILD === 'true' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
};

function fontMode() {
  return true;
}

module.exports = nextConfig;
