# Changelog

## [0.1.1] - 2025-11-30

First stable release

### Added
- Initial release
- Automatic browser opening when Next.js dev server starts
- Support for custom port configuration
- Support for custom path configuration
- Browser selection support (Chrome, Firefox, Edge, Brave)
- Background mode option to open browser without stealing focus
- OS-specific browser name normalization (Chrome handling for macOS/Linux/Windows)
- Comprehensive test suite with 17 tests
- Full JSDoc documentation
- TypeScript type definitions

### Features
- Only opens browser once (not on every hot-reload)
- Works with webpack-based Next.js projects only
- Supports Next.js >= 13.0.0
- ESM-based implementation using modern `open` package v11
