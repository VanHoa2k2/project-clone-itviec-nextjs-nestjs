/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, {}) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8088",
        pathname: "/images/company/**",
      },
      {
        protocol: "https",
        hostname: "project-clone-itviec-nestjs.onrender.com",
        port: "",
        pathname: "/images/company/**",
      },
    ],
    domains: ["localhost"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
