/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Required:
    appDir: true
  },
  env: {
    OPEN_API_KEY: `${process.env.OPEN_API_KEY}`,
    OPEN_API_URL: `${process.env.OPEN_API_URL}`,
    CLOUDFLARE_REDIRECT_URL: `${process.env.CLOUDFLARE_REDIRECT_URL}`
  }
}

module.exports = nextConfig
