import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'a.espncdn.com' },
      { protocol: 'https', hostname: 'a1.espncdn.com' },
      { protocol: 'https', hostname: 'a2.espncdn.com' },
      { protocol: 'https', hostname: 'a3.espncdn.com' },
      { protocol: 'https', hostname: 'a4.espncdn.com' },
      { protocol: 'https', hostname: 'a5.espncdn.com' },
      { protocol: 'https', hostname: 'a6.espncdn.com' },
      { protocol: 'https', hostname: 'a7.espncdn.com' },
      { protocol: 'https', hostname: 'a8.espncdn.com' },
      { protocol: 'https', hostname: 'a9.espncdn.com' }
    ]
  },
};

export default nextConfig;
