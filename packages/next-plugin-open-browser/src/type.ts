export interface OpenBrowserPluginOptions {
	port?: number;
	/**
	 * Base path of the application (e.g., '/app')
	 * @default ''
	 */
	path?: string;
	background?: boolean;
	browser?: Browser;
	private?: boolean;
}

export type Browser = 'chrome' | 'firefox' | 'edge' | 'brave' | 'browser'


// chrome - Web browser
// firefox - Web browser
// edge - Web browser
// brave - Web browser
// browser - Default web browser
// browserPrivate - Default web browser in incognito mode
