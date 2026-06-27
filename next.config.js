/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Ideal for simple static/preview setups, can toggle in production
  }
}

module.exports = nextConfig
