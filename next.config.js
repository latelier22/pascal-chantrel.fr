/** @type {import('next').NextConfig} */
const nextConfig = process.env.NEXT_BUILD_SINGLE_CPU === "1"
  ? { experimental: { cpus: 1 } }
  : {};

module.exports = nextConfig;
