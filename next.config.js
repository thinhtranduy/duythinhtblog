/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        serverComponentsExternalPackages: [
          '@aws-sdk/client-s3',
          '@aws-sdk/s3-request-presigner',
        ],
      },
};

export default config;
