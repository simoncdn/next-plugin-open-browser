export function validatePort(port: number): void {
	if (!Number.isInteger(port)) {
		throw new Error(`Invalid port: ${port}. Port must be an integer.`);
	}

	if (port < 1 || port > 65535) {
		throw new Error(`Invalid port: ${port}. Port must be between 1 and 65535.`);
	}
}

export function validatePath(path: string): void {
	if (typeof path !== 'string') {
		throw new Error(`Invalid path: ${path}. Path must be a string.`);
	}
}
