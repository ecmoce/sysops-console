# 📊 SysOps Console

> **Web Dashboard** — Real-time web UI for SysOps monitoring system

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Related Projects

| Project | Description |
|---------|-------------|
| [sysops-agent](https://github.com/ecmoce/sysops-agent) | Monitoring agent installed on servers |
| [sysops-server](https://github.com/ecmoce/sysops-server) | Central data collection/API server |
| **sysops-console** | Web dashboard UI (current repo) |

## Tech Stack

- **React 19** + **TypeScript 5.9**
- **Vite 7** for build
- **Tailwind CSS 4** for styling
- **Recharts** for data visualization
- **React Router 7** for navigation
- **Lucide React** for icons

## Features

- 📊 Fleet overview dashboard with auto-refresh (30s)
- 🖥️ Host list with grid/table view, search, status filter
- 📈 Per-host CPU/Memory/Disk charts with time range selection
- 🔔 Alert management with severity & status filters
- 📦 Hardware inventory table
- ⚙️ Settings page
- 📱 Responsive layout with mobile hamburger menu
- 🎨 Dark theme with smooth animations
- ⌨️ Keyboard shortcuts (ESC to close)
- 🔄 Skeleton loading states
- 🌐 WebSocket real-time alert stream
- 🎯 Mock data fallback when API is unavailable

## Quick Start

```bash
# Install dependencies
npm install

# Development (with API proxy to localhost:8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker

```bash
docker build -t sysops-console .
docker run -p 80:80 sysops-console
```

The nginx config proxies `/api/` and `/ws/` to `sysops-server:8080`.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Layout.tsx    # App shell with responsive sidebar
│   ├── MetricBar.tsx # Progress bar for metrics
│   ├── StatusDot.tsx # Status indicator with pulse
│   ├── Shimmer.tsx   # Skeleton loading components
│   └── ErrorState.tsx# Error display with retry
├── pages/            # Route pages
│   ├── Dashboard.tsx # Fleet overview
│   ├── Hosts.tsx     # Host list (grid/table)
│   ├── HostDetail.tsx# Per-host metrics & alerts
│   ├── Alerts.tsx    # Global alert management
│   ├── Inventory.tsx # Hardware inventory
│   └── SettingsPage.tsx
├── lib/
│   ├── api.ts        # API client with mock fallback
│   ├── types.ts      # TypeScript interfaces
│   └── utils.ts      # Helper functions
└── mocks/
    └── data.ts       # Realistic mock data
```

## License

MIT — [LICENSE](LICENSE)