// next.config.js
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// next-intl wraps the config; Sentry wraps the result.
// In development without Sentry env vars, withSentryConfig is a harmless pass-through.
export default withSentryConfig(withNextIntl(nextConfig), {
  silent: true,
});
