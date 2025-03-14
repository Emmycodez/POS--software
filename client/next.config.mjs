/** @type {import('next').NextConfig} */
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add resolver plugin to handle case sensitivity
    config.resolve = {
      ...config.resolve,
      symlinks: false,
    };

    // Use the built-in case sensitive paths plugin
    config.plugins.push(new CaseSensitivePathsPlugin());

    return config;
  },
};

export default nextConfig;
