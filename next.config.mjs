/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.firebaseapp.com",
              "connect-src 'self' https://*.googleapis.com https://*.firebase.googleapis.com https://*.firebaseio.com https://firebaseinstallations.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebaseapp.com wss://*.firebaseio.com",
              "img-src 'self' data: blob: https://*.googleapis.com https://*.googleusercontent.com",
              "media-src 'self' data: blob:",
              "frame-src 'self' https://*.firebaseapp.com https://*.firebase.google.com",
              "font-src 'self' https://fonts.gstatic.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;