/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { serverComponentsExternalPackages: ['mongodb', 'nodemailer'] },
};
