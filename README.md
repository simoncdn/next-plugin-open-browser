# next-plugin-open-browser

Automatically open browser when Next.js dev server starts.

This plugin works with **webpack only**.

## Installation

```bash
npm install --save-dev next-plugin-open-browser
```

## Usage

Add the plugin to your `next.config.ts`:

```typescript
import type { NextConfig } from "next";
import { OpenBrowserPlugin } from "next-plugin-open-browser";

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    // only applies in dev mode
    if (dev && !isServer) {
      config.plugins.push(new OpenBrowserPlugin());
    }
    return config;
  },
};

export default nextConfig;
```

Start your dev server:

```bash
npm run dev
```

Your default browser will automatically open to `http://localhost:3000`

https://github.com/user-attachments/assets/44f57d2d-4427-4751-9ed2-7a06541e8ce3

## Configuration

You can pass options to customize the behavior:

```typescript
new OpenBrowserPlugin({
  port: 3000,           // custom port (default: process.env.PORT or 3000)
  path: '/',            // custom path (default: '/')
  browser: 'chrome',    // specific browser (default: system default)
  background: true     // open in background without focus (default: false)
})
```

## Supported Browsers

The plugin automatically handles browser names across different operating systems:

- **Chrome**: Works on Windows, macOS, and Linux
- **Firefox**: Cross-platform support
- **Edge**: Windows and macOS
- **Brave**: Cross-platform support
- **Browser**: Uses system default browser

## Development

Commands for maintainers:

```bash
pnpm install
pnpm build
pnpm test
pnpm playground
```

## License

[MIT](./LICENSE)
