import type { Compiler } from 'webpack';
import { red } from './utils/colors.js';
import { Browser, OpenBrowserPluginOptions } from './type.js';
import open, { App, apps, openApp, Options } from 'open';
import os from 'os';

const DEFAULT_PORT = 3000;

export class OpenBrowserPlugin {
	private hasOpened: boolean = false;
	private port: number;
	private path: string;
	private background?: boolean;
	private browser?: string;
	private private?: boolean;

	/**
	 * @param options - Plugin configuration options
	 */
	constructor(options: OpenBrowserPluginOptions = {}) {
		this.port = options.port ?? (Number(process.env.PORT) || DEFAULT_PORT);
		this.path = options.path ?? '/';
		this.background = options.background ?? false;
		this.browser = options.browser;
		this.private = options.private;
	}

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

	getPrivateMode() {
		switch (this.browser) {
			case 'chrome':
			case 'brave':
				return '--incognito';
			case 'firefox':
				return '--private-window'
			case 'edge':
				return '--inPrivate'
			default:
				return '--incognito';
		}
	}

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
							...(this.private && {
								arguments: [this.getPrivateMode()]
							})
						}
					}),
					background: this.background
				});
				// await open('https://sindresorhus.com', { app: { name: apps.browserPrivate } });
				this.hasOpened = true;
			} catch (error) {
				console.error(red('Failed to open browser:'), error);
			}
		});
	}
}
