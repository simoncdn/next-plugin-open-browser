import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenBrowserPlugin } from '../src/plugin.js';
import type { Compiler } from 'webpack';

// Mock dependencies
vi.mock('open', () => ({
	default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../src/utils/colors.js', () => ({
	red: (msg: string) => msg,
}));

vi.mock('os', () => ({
	default: {
		platform: vi.fn().mockReturnValue('darwin'),
	},
}));

describe('OpenBrowserPlugin', () => {
	let mockCompiler: Compiler;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		// Reset mocks
		vi.clearAllMocks();

		// Mock console.error
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

		// Create a mock compiler with hooks
		mockCompiler = {
			hooks: {
				afterEmit: {
					tapPromise: vi.fn(),
				},
			},
		} as unknown as Compiler;
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	describe('constructor', () => {
		it('should initialize with default values when no options provided', () => {
			const plugin = new OpenBrowserPlugin();

			expect(plugin['port']).toBe(3000);
			expect(plugin['path']).toBe('/');
			expect(plugin['background']).toBe(false);
			expect(plugin['browser']).toBeUndefined();
		});

		it('should use provided options', () => {
			const plugin = new OpenBrowserPlugin({
				port: 8080,
				path: '/dashboard',
				background: true,
				browser: 'chrome',
			});

			expect(plugin['port']).toBe(8080);
			expect(plugin['path']).toBe('/dashboard');
			expect(plugin['background']).toBe(true);
			expect(plugin['browser']).toBe('chrome');
		});

		it('should use PORT environment variable if available', () => {
			const originalPort = process.env.PORT;
			process.env.PORT = '4000';

			const plugin = new OpenBrowserPlugin();

			expect(plugin['port']).toBe(4000);

			// Restore original
			if (originalPort === undefined) {
				delete process.env.PORT;
			} else {
				process.env.PORT = originalPort;
			}
		});

		it('should prioritize provided port over environment variable', () => {
			const originalPort = process.env.PORT;
			process.env.PORT = '4000';

			const plugin = new OpenBrowserPlugin({ port: 5000 });

			expect(plugin['port']).toBe(5000);

			// Restore original
			if (originalPort === undefined) {
				delete process.env.PORT;
			} else {
				process.env.PORT = originalPort;
			}
		});
	});

	describe('getBrowser', () => {
		it('should return undefined when no browser is set', () => {
			const plugin = new OpenBrowserPlugin();
			expect(plugin.getBrowser()).toBeUndefined();
		});

		it('should return browser name as-is for non-chrome browsers', () => {
			const plugin = new OpenBrowserPlugin({ browser: 'firefox' });
			expect(plugin.getBrowser()).toBe('firefox');
		});

		it('should normalize chrome to "google chrome" on macOS', async () => {
			const os = await import('os');
			vi.mocked(os.default.platform).mockReturnValue('darwin');

			const plugin = new OpenBrowserPlugin({ browser: 'chrome' });
			expect(plugin.getBrowser()).toBe('google chrome');
		});

		it('should normalize chrome to "google-chrome" on Linux', async () => {
			const os = await import('os');
			vi.mocked(os.default.platform).mockReturnValue('linux');

			const plugin = new OpenBrowserPlugin({ browser: 'chrome' });
			expect(plugin.getBrowser()).toBe('google-chrome');
		});

		it('should keep chrome as "chrome" on Windows', async () => {
			const os = await import('os');
			vi.mocked(os.default.platform).mockReturnValue('win32');

			const plugin = new OpenBrowserPlugin({ browser: 'chrome' });
			expect(plugin.getBrowser()).toBe('chrome');
		});
	});

	describe('apply', () => {
		it('should register afterEmit hook', () => {
			const plugin = new OpenBrowserPlugin();
			plugin.apply(mockCompiler);

			expect(mockCompiler.hooks.afterEmit.tapPromise).toHaveBeenCalledWith(
				'OpenBrowserPlugin',
				expect.any(Function)
			);
		});

		it('should open browser with correct URL on first call', async () => {
			const open = (await import('open')).default;
			const plugin = new OpenBrowserPlugin({ port: 3000, path: '/test' });
			plugin.apply(mockCompiler);

			// Get the registered callback
			const callback = vi.mocked(mockCompiler.hooks.afterEmit.tapPromise).mock.calls[0][1];
			await callback();

			expect(open).toHaveBeenCalledWith(
				'http://localhost:3000/test',
				expect.objectContaining({
					background: false,
				})
			);
		});

		it('should only open browser once', async () => {
			const open = (await import('open')).default;
			const plugin = new OpenBrowserPlugin();
			plugin.apply(mockCompiler);

			const callback = vi.mocked(mockCompiler.hooks.afterEmit.tapPromise).mock.calls[0][1];

			// Call twice
			await callback();
			await callback();

			// Should only be called once
			expect(open).toHaveBeenCalledTimes(1);
		});

		it('should pass browser configuration when browser is specified', async () => {
			const open = (await import('open')).default;
			const plugin = new OpenBrowserPlugin({ browser: 'firefox' });
			plugin.apply(mockCompiler);

			const callback = vi.mocked(mockCompiler.hooks.afterEmit.tapPromise).mock.calls[0][1];
			await callback();

			expect(open).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					app: {
						name: 'firefox',
					},
				})
			);
		});

		it('should pass background option', async () => {
			const open = (await import('open')).default;
			const plugin = new OpenBrowserPlugin({ background: true });
			plugin.apply(mockCompiler);

			const callback = vi.mocked(mockCompiler.hooks.afterEmit.tapPromise).mock.calls[0][1];
			await callback();

			expect(open).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					background: true,
				})
			);
		});

		it('should handle errors gracefully', async () => {
			const open = (await import('open')).default;
			const error = new Error('Failed to open');
			vi.mocked(open).mockRejectedValueOnce(error);

			const plugin = new OpenBrowserPlugin();
			plugin.apply(mockCompiler);

			const callback = vi.mocked(mockCompiler.hooks.afterEmit.tapPromise).mock.calls[0][1];
			await callback();

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Failed to open browser:',
				error
			);
		});

		it('should construct correct URL with default path', async () => {
			const open = (await import('open')).default;
			const plugin = new OpenBrowserPlugin({ port: 4000 });
			plugin.apply(mockCompiler);

			const callback = vi.mocked(mockCompiler.hooks.afterEmit.tapPromise).mock.calls[0][1];
			await callback();

			expect(open).toHaveBeenCalledWith(
				'http://localhost:4000/',
				expect.any(Object)
			);
		});

		it('should construct correct URL with custom path', async () => {
			const open = (await import('open')).default;
			const plugin = new OpenBrowserPlugin({ port: 3000, path: '/admin/dashboard' });
			plugin.apply(mockCompiler);

			const callback = vi.mocked(mockCompiler.hooks.afterEmit.tapPromise).mock.calls[0][1];
			await callback();

			expect(open).toHaveBeenCalledWith(
				'http://localhost:3000/admin/dashboard',
				expect.any(Object)
			);
		});
	});
});
