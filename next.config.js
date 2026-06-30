/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/bingo',
                permanent: false,
            },
        ];
    },
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
            {
              protocol: 'https',
              hostname: 'img.magnific.com',
              pathname: '**',
            },
          ],
    },
}

module.exports = nextConfig
