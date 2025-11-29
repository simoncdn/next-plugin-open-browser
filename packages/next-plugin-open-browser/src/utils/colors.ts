/**
 * Wraps a string with red ANSI color codes
 */
export function red(str: string): string {
	return `\x1b[31m${str}\x1b[0m`;
}
