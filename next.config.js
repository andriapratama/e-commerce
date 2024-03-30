/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.dropbox.com",
      "testing-bottle.s3.ap-southeast-1.amazonaws.com",
      "prod-bottle-time.s3.ap-southeast-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
