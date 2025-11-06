
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.bookmyumrahtrip.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hajjumrahplanner.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
