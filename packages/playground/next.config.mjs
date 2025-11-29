import { OpenBrowserPlugin } from "next-plugin-open-browser";

const nextConfig = {
	/* config options here */
	webpack: (config, { dev, isServer }) => {
		if (dev && !isServer) {
			config.plugins.push(new OpenBrowserPlugin({
				browser: 'firefox',
				private: true,
			}));
		}

		return config;
	},
};

export default nextConfig;
