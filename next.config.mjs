/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["cloudinary"],
  experimental: {
    serverActionsBodySizeLimit: "10mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.firebaseapp.com https://js.paystack.co",
              "connect-src 'self' https://*.googleapis.com https://*.firebase.googleapis.com https://*.firebaseio.com https://firebaseinstallations.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebaseapp.com https://*.cloudinary.com https://api.paystack.co https://js.paystack.co https://checkout.paystack.com wss://*.firebaseio.com",
              "img-src 'self' data: blob: https://*.googleapis.com https://*.googleusercontent.com https://res.cloudinary.com https://images.unsplash.com",
              "media-src 'self' data: blob:",
              "frame-src 'self' https://*.firebaseapp.com https://*.firebase.google.com https://js.paystack.co https://checkout.paystack.com",
              "font-src 'self' https://fonts.gstatic.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
