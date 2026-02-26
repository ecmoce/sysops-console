# Changelog

All notable changes to sysops-console will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] - 2024-01-15

### Added
- Fleet overview dashboard with auto-refresh (30s)
- Host list with grid/table view, search, status filter
- Per-host detail page with CPU/Memory/Disk/Network charts and time range selection
- Alert management with severity & status filters, acknowledgment
- Hardware inventory table with CSV export
- LLM-powered health check page with approve/reject/execute workflow
- Settings page (API endpoint, refresh interval, theme)
- WebSocket real-time alert stream
- Responsive layout with mobile hamburger menu
- Dark theme with smooth animations
- Skeleton loading states
- Keyboard shortcuts (ESC to close)
- Mock data fallback when API is unavailable
- Dockerfile with nginx for production serving
- CI workflow with Trivy security scanning

### Fixed
- Server API response format handling
- Health check mock data accuracy
- Inventory N+1 parallel fetch
- Alert timeline chart deterministic rendering (removed Math.random)
- Settings validation and sections
- CONSOLE.md updated with HealthChecks page documentation
