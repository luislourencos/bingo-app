/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'i.ibb.co',
              pathname: '**',
            },
            {
              protocol: 'https',
              hostname: 'cdn.jsdelivr.net',
              pathname: '**',
            },
            {
              protocol: 'https',
              hostname: 'cataas.com',
              pathname: '**',
            },
          ],
    },
}

module.exports = nextConfig
