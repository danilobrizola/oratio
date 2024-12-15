/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}
module.exports = {
  typescript: {
    ignoreBuildErrors: true, // Ignora erros de tipo durante o build
  },
}

module.exports = nextConfig
