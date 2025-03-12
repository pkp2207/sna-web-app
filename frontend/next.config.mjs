/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    serverRuntimeConfig: {
      port: process.env.PORT || 3000, // Use Render’s assigned port
    },
  };
  
  export default nextConfig;
  