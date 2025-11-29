import os from 'os';

export function getLocalIP(): string | null {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name] ?? []) {
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address;
			}
		}
	}

	return null;
}

export function buildURL(ip: string, port: number, path: string): string {
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	const url = `http://${ip}:${port}${path ? normalizedPath : ''}`;

	return url;
}
