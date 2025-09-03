import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'integrare-os-minio.nyr4mj.easypanel.host',
        pathname: '/sigas/**'
      }
    ]
  }
};

export default nextConfig;
