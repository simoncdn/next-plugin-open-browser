import type { Compiler } from 'webpack';
import { red } from './utils/colors.js';
import { OpenBrowserPluginOptions } from './type.js';
import open from 'open';
import os from 'os';

const DEFAULT_PORT = 3000;

/**
 * Next.js webpack plugin that automatically opens a browser when the dev server starts
 *
 * @example
 * ```ts
 * // next.config.js
 * import { OpenBrowserPlugin } from 'next-plugin-open-browser';
 *
 * export default {
 *   webpack: (config, { dev, isServer }) => {
 *     if (dev && !isServer) {
 *       config.plugins.push(new OpenBrowserPlugin({
 *         browser: 'chrome',
 *         path: '/dashboard'
 *       }));
 *     }
 *     return config;
 *   }
 * };
 * ```
 */
export class OpenBrowserPlugin {
	private hasOpened: boolean = false;
	private port: number;
	private path: string;
	private background?: boolean;
	private browser?: string;

	/**
	 * Creates an instance of OpenBrowserPlugin
	 * @param options - Plugin configuration options
	 */
	constructor(options: OpenBrowserPluginOptions = {}) {
		this.port = options.port ?? (Number(process.env.PORT) || DEFAULT_PORT);
		this.path = options.path ?? '/';
		this.background = options.background ?? false;
		this.browser = options.browser;
	}

	/**
	 * Normalizes browser name based on the current operating system
	 * @returns The normalized browser name or undefined
	 * @private
	 */
	getBrowser() {
		if (this.browser === 'chrome') {
			const currentOS = os.platform();
			switch (currentOS) {
				case 'linux':
					return this.browser = 'google-chrome';
				case 'darwin':
					return this.browser = 'google chrome'
				case 'win32':
				default:
					return this.browser = 'chrome';
			}
		}

		return this.browser;
	}

	/**
	 * Applies the plugin to the webpack compiler
	 * Hooks into the afterEmit phase to open the browser once compilation is complete
	 * @param compiler - The webpack compiler instance
	 */
	apply(compiler: Compiler): void {
		compiler.hooks.afterEmit.tapPromise('OpenBrowserPlugin', async () => {

			if (this.hasOpened) {
				return;
			}

			try {
				const url = `http://localhost:${this.port}${this.path}`;
				const browser = this.getBrowser();


				await open(url, {
					...(browser && {
						app: {
							name: browser,
						}
					}),
					background: this.background
				});
				this.hasOpened = true;
			} catch (error) {
				console.error(red('Failed to open browser:'), error);
			}
		});
	}
}
