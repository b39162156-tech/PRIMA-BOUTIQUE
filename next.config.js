/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Remplacez par le domaine de votre projet Supabase, ex: abcdefgh.supabase.co
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
