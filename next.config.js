/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  //output: "standalone",
  // webpack: (config, options) => {
  //   config.module.rules.push({
  //   })
  //   return config
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/',
      },
    ],
  },
}

module.exports = nextConfig
