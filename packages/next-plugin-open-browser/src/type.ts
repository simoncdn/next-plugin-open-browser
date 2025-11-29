/**
 * Configuration options for the OpenBrowserPlugin
 */
export interface OpenBrowserPluginOptions {
	/**
	 * Port number where the Next.js dev server is running
	 * @default 3000 or process.env.PORT
	 * @example 3000
	 */
	port?: number;

	/**
	 * Base path of the application to open
	 * @default '/'
	 * @example '/dashboard'
	 */
	path?: string;

	/**
	 * Open the browser in the background without focusing it
	 * @default false
	 */
	background?: boolean;

	/**
	 * Specific browser to open
	 * @default System default browser
	 * @example 'chrome'
	 */
	browser?: Browser;
}

/**
 * Supported browser names
 */
export type Browser = 'chrome' | 'firefox' | 'edge' | 'brave' | 'browser'
