/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
        protocol: "https",
        hostname: "img.ophim.live",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "project3-soranoharu.netlify.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
