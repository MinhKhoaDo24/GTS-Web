import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/giai-phap-wifi',
        destination: '/giai-phap/giai-phap-wifi',
        permanent: true,
      },
      {
        source: '/giai-phap-mang',
        destination: '/giai-phap/giai-phap-mang',
        permanent: true,
      },
      {
        source: '/giai-phap-bao-mat',
        destination: '/giai-phap/giai-phap-bao-mat',
        permanent: true,
      },
      {
        source: '/giai-phap-voip',
        destination: '/giai-phap/giai-phap-voip',
        permanent: true,
      },
      {
        source: '/giai-phap-hoi-nghi',
        destination: '/giai-phap/giai-phap-hoi-nghi',
        permanent: true,
      },
      {
        source: '/giai-phap-server',
        destination: '/giai-phap/giai-phap-server',
        permanent: true,
      },
      {
        source: '/dich-vu-tu-van',
        destination: '/dich-vu/dich-vu-tu-van',
        permanent: true,
      },
      {
        source: '/dich-vu-trien-khai',
        destination: '/dich-vu/dich-vu-trien-khai',
        permanent: true,
      },
      {
        source: '/dich-vu-bao-tri',
        destination: '/dich-vu/dich-vu-bao-tri',
        permanent: true,
      },
      {
        source: '/dich-vu-spare-part',
        destination: '/dich-vu/dich-vu-spare-part',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
