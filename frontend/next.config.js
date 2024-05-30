// @ts-check

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  // NOTE: Set to true to enable warnings about conflicting, must be turned on once all useEffects are fixed
  // @link https://reactjs.org/blog/2022/03/29/react-v18.html#new-strict-mode-behaviors
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    loader: "akamai",
    path: "",
  },
};
