/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.module.rules.push({
			test: /\.gql|.graphql$/,
			// This is the asset module.
			type: 'asset/source',
		});
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL).hostname,
				port: '',
				pathname: '/sites/default/files/**',
			},
			{
				protocol: 'https',
				hostname: 'api.liveugconthub.uoguelph.dev',
				port: '',
				pathname: '/sites/default/files/**',
			},
		],
	},
};
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
