/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Vercel build ke time ESLint ko ignore karega
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
