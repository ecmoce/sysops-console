# 📊 SysOps Console — Web Dashboard

> Real-time infrastructure monitoring dashboard utilizing SysOps Server's REST/WebSocket API

---

## Table of Contents

- [Overview](#-overview)
- [Screen Layout](#-screen-layout)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Supported Features](#-supported-features)
- [API Integration](#-api-integration)
- [Mock Data](#-mock-data)
- [Deployment](#-deployment)
- [Configuration](#-configuration)

---

## 🔍 Overview

SysOps Console is a web dashboard that provides an at-a-glance view of metrics, alerts, and inventory from SysOps Agents running on thousands of servers. Built with a professional UI based on dark theme, it delivers readability and information density at the level of Datadog/Grafana.

```
┌─────────────────────────────────────────────────────────┐
│  SysOps Console                                          │
│                                                          │
│  ┌─────────┐   ┌─────────────────────────────────────┐  │
│  │ Sidebar │   │                                      │  │
│  │         │   │         Main Content Area             │  │
│  │ 📊 Dash │   │                                      │  │
│  │ 🖥 Hosts│   │   Charts, Tables, Cards, Alerts      │  │
│  │ ⚠ Alert │   │                                      │  │
│  │ 📦 Inv  │   │                                      │  │
│  │ ⚙ Set  │   │                                      │  │
│  │         │   │                                      │  │
│  └─────────┘   └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Key Features

| Feature | Description |
|---------|-------------|
| 🌙 **Dark Theme** | Slate-900 based, minimizes eye strain |
| 📈 **Real-time Charts** | Recharts-based time series charts (CPU, Memory, Disk, GPU) |
| 🔴 **Real-time Alerts** | Immediate alert reception via WebSocket |
| 📱 **Responsive** | Mobile/Tablet/Desktop support |
| 🎯 **Mock Fallback** | Automatic mock data switch when API is unavailable |
| ⚡ **SPA** | React Router, no-refresh page transitions |

---

## 🖥 Screen Layout

### 1. Dashboard (`/`)

Summarizes the entire fleet status on a single screen.

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                                   │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 🟢 247   │ │ 🔴  3    │ │ 🟡 12    │ │ ⚠️  8    │       │
│  │ Online   │ │ Offline  │ │ Degraded │ │ Alerts   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  ┌── Active Alerts ─────────────────────────────────────┐   │
│  │  🔴 gpu-server-03   GPU Temp 92°C           2m ago  │   │
│  │  🔴 db-server-01    Disk Usage 95%           5m ago  │   │
│  │  🟡 web-12          Memory Leak             15m ago  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌── Host Status Map ──────┐ ┌── Alert Timeline (24h) ──┐  │
│  │  ●●●●●●●●●●●●●●●●●●●● │ │  ▁▂▃▅▇█▅▃▂▁▁▂▃▄▅▃▂▁▁   │  │
│  │  ●●●●●●●●●●●●●●●●●●●● │ │  ━ critical  ━ warning    │  │
│  │  green=ok  red=alert    │ │                           │  │
│  └─────────────────────────┘ └───────────────────────────┘  │
│                                                              │
│  ┌── Host Table ────────────────────────────────────────┐   │
│  │  hostname       status   CPU    MEM    Disk   last   │   │
│  │  web-server-01  🟢       ████░  ████░  ████░  10s    │   │
│  │  gpu-server-03  🔴       ████░  ██░░░  ██░░░  2m     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Included Components:**
- Host count cards by status (Online / Offline / Degraded / Active Alerts)
- Active alerts list (sorted by severity, with timestamps)
- Host status map (color-coded dot grid)
- Alert timeline chart (24 hours, Critical/Warning area chart)
- Host table (with CPU/Memory/Disk progress bars)

---

### 2. Hosts (`/hosts`)

Displays all hosts in card view.

```
┌─────────────────────────────────────────────────────────────┐
│  Hosts                          🔍 Search...   [All ▾]      │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐  │
│  │ web-server-01   │  │ gpu-server-03   │  │ db-01      │  │
│  │ 🟢 Online       │  │ 🔴 Critical     │  │ 🟢 Online  │  │
│  │                 │  │                  │  │            │  │
│  │ CPU  ████████░░ │  │ CPU  ██████████ │  │ CPU  ████░ │  │
│  │ MEM  ██████░░░░ │  │ MEM  ████░░░░░░ │  │ MEM  ████░ │  │
│  │ DISK ███████░░░ │  │ DISK ███░░░░░░░ │  │ DISK ████░ │  │
│  │                 │  │                  │  │            │  │
│  │ Ubuntu 22.04    │  │ Rocky 9          │  │ Ubuntu 24  │  │
│  │ 10.0.1.5        │  │ 10.0.2.30        │  │ 10.0.1.10  │  │
│  └─────────────────┘  └─────────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Text search (hostname, IP, OS)
- Status filter (All / Online / Critical / Degraded / Offline)
- Card click → Navigate to Host Detail page
- CPU/Memory/Disk progress bars per host
- Display OS, IP, last heartbeat

---

### 3. Host Detail (`/hosts/:hostname`) ⭐ Core Page

Presents all information for a specific host on a single page.

```
┌─────────────────────────────────────────────────────────────┐
│  ← Hosts  /  web-server-01                      🟢 Online   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌── System Info ───────────────────────────────────────┐   │
│  │  🖥 Ubuntu 22.04 LTS  │  Kernel 5.15.0-91           │   │
│  │  💻 Intel Xeon Gold 6348 (2 Socket, 56C, 112T)       │   │
│  │  🧠 512 GB DDR4-3200 ECC (16 DIMMs)                  │   │
│  │  🎮 4× NVIDIA A100-SXM4-80GB                         │   │
│  │  🔗 eno1 25Gbps  │  IP: 10.0.1.5  │  Agent: v0.1.0  │   │
│  │  ⏱ Uptime: 142 days                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [Overview] [CPU] [Memory] [Disk] [Network] [Alerts]         │
│  ─────────────────────────────────────────────────────       │
│                                                              │
│  ┌── CPU Usage ─────── [1h] [6h] [24h] [7d] ───────────┐   │
│  │                                                       │   │
│  │  100%│                                                │   │
│  │      │        ╭──╮                                    │   │
│  │   50%│───╮╭──╯  ╰──╮                                 │   │
│  │      │   ╰╯        ╰──────                           │   │
│  │    0%│                                                │   │
│  │      └──────────────────────────────────── time       │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │ ◔ 78%    │  │ ◔ 25%    │  │ ◔ 45.2   │            │   │
│  │  │ Socket 0 │  │ Socket 1 │  │ Load Avg │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌── Memory ─────────────────┐ ┌── Storage ──────────────┐  │
│  │                            │ │                          │  │
│  │  ◔ 75%  384 / 512 GB     │ │  /       ████████░░ 78%  │  │
│  │                            │ │  /data   █████░░░░ 52%  │  │
│  │  Buffers:  64 GB          │ │  /tmp    ██░░░░░░░ 15%  │  │
│  │  Cached:  128 GB          │ │  /var    ██████░░░ 65%  │  │
│  │  Swap:   0 / 32 GB       │ │                          │  │
│  └────────────────────────────┘ └──────────────────────────┘  │
│                                                              │
│  ┌── Active Alerts (3) ─────────────────────────────────┐   │
│  │  🔴 CRITICAL  GPU 0 Temp: 92°C (>85°C)       2m ago │   │
│  │  🟡 WARNING   Memory leak: java +50MB/h      15m ago │   │
│  │  🟡 WARNING   Load avg 48.2 > 44.8           30m ago │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Tab Layout:**

| Tab | Content |
|-----|---------|
| **Overview** | CPU/Memory/Disk summary + charts + alerts |
| **CPU** | CPU usage chart, per-socket usage, core count, Load Average |
| **Memory** | Memory usage chart, Used/Buffers/Cached/Swap breakdown |
| **Disk** | Per-device usage bars, I/O charts |
| **Network** | rx/tx charts, interface list |
| **Alerts** | Alert history for this host |

**Chart Features:**
- Time range selection: 1h / 6h / 24h / 7d
- Hover tooltip: Precise values + visual indicators
- SVG Progress Ring: Per-socket CPU, memory usage visualization
- Responsive: Clean display on mobile devices

---

### 4. Alerts (`/alerts`)

Manages alerts for the entire system.

```
┌─────────────────────────────────────────────────────────────┐
│  Alerts                 🔍 Search...   [All Severities ▾]    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 🔴 CRITICAL  gpu-server-03                           │   │
│  │    GPU 0 Temperature 92°C exceeds threshold 85°C     │   │
│  │    metric: gpu_temperature  value: 92.0   2 min ago  │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 🔴 CRITICAL  db-server-01                            │   │
│  │    Disk usage 95% exceeds threshold 90%              │   │
│  │    metric: disk_usage_percent  value: 95.0  5m ago   │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 🟡 WARNING   web-server-12                           │   │
│  │    Memory leak detected: java (pid 4521) +50MB/h     │   │
│  │    metric: memory_leak  value: 50.0       15m ago    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Severity filter (All / Critical / Warning / Info)
- Status filter (Active / Resolved)
- Text search (hostname, metric, message)
- Sort by time (latest first)
- WebSocket real-time updates (`/ws/v1/alerts/stream`)
- Host click → Navigate to Host Detail

---

### 5. Inventory (`/inventory`)

Displays hardware/software inventory for all hosts.

```
┌─────────────────────────────────────────────────────────────┐
│  Inventory                                  🔍 Search...     │
│                                                              │
│  hostname       │ OS           │ CPU            │ RAM  │ GPU │
│  ───────────── │ ──────────── │ ────────────── │ ──── │ ─── │
│  web-server-01  │ Ubuntu 22.04 │ Xeon 6348 2S  │ 512G │ -   │
│  gpu-server-03  │ Rocky 9      │ EPYC 7763 2S  │ 1TB  │ 8×  │
│  db-server-01   │ Ubuntu 22.04 │ Xeon 8380 2S  │ 768G │ -   │
│  cache-01       │ CentOS 9     │ Xeon 4314 1S  │ 256G │ -   │
└─────────────────────────────────────────────────────────────┘
```

**Displayed Items:**
- OS (distro, version)
- CPU (model, sockets, cores)
- Memory (total, type)
- GPU (model, count) — if present
- Last collection timestamp

---

### 6. Settings (`/settings`)

Manages console settings.

**Configuration Items:**

| Item | Description | Default |
|------|-------------|---------|
| API Endpoint | Server API address | `/api/v1` (proxy) |
| Refresh Interval | Auto-refresh interval | 30 seconds |
| Theme | Dark / Light mode | Dark |

---

## 🚀 Running the Application

### Prerequisites

- Node.js 20+
- npm 9+

### Method 1: Local Development (Mock Data)

Run immediately with mock data without API server:

```bash
cd /tmp/sysops-console

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev
```

> Automatically falls back to mock data when API server is not connected.

### Method 2: Server Integration Development

```bash
# 1. Run SysOps Server (separate terminal)
cd /tmp/sysops-server
cargo run -- --config config.toml

# 2. Start Console development server
cd /tmp/sysops-console
npm run dev
# → Vite proxy automatically proxies /api → http://localhost:8080
```

### Method 3: Docker Integrated Run

```bash
# Run entire stack (NATS + TimescaleDB + Server + Agent + Console)
cd /tmp/sysops-integration
docker-compose up -d

# Access Console
open http://localhost:3000
```

### Method 4: Production Build

```bash
# Build static files
npm run build
# → Generated in dist/ directory

# Preview
npm run preview
```

---

## 📁 Project Structure

```
sysops-console/
├── public/                    # Static assets
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Route definitions
│   ├── index.css             # TailwindCSS global styles
│   │
│   ├── pages/                # Page components (6 pages)
│   │   ├── Dashboard.tsx     # Fleet Overview dashboard
│   │   ├── Hosts.tsx         # Host list (card view)
│   │   ├── HostDetail.tsx    # Host detail (charts, inventory, alerts)
│   │   ├── Alerts.tsx        # Global alert list
│   │   ├── Inventory.tsx     # Hardware/software inventory
│   │   └── SettingsPage.tsx  # Console settings
│   │
│   ├── components/           # Reusable UI components
│   │   ├── Layout.tsx        # Sidebar + main layout
│   │   ├── MetricBar.tsx     # CPU/Memory/Disk progress bar
│   │   └── StatusDot.tsx     # Status indicator (🟢🔴🟡)
│   │
│   ├── lib/                  # Utilities
│   │   ├── api.ts            # API call functions (fetch + mock fallback)
│   │   ├── types.ts          # TypeScript interface definitions
│   │   └── utils.ts          # Helper functions (timeAgo, statusColor, etc.)
│   │
│   └── mocks/                # Mock data
│       └── data.ts           # 12 hosts, alerts, metric generators
│
├── Dockerfile                # Multi-stage: Node build → Nginx serve
├── nginx.conf                # Nginx config (SPA + API proxy)
├── vite.config.ts            # Vite config (proxy, TailwindCSS)
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies and scripts
└── CONSOLE.md                # This document
```

---

## 🛠 Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | 19 | UI components |
| **Language** | TypeScript | 5.9 | Type-safe code |
| **Build** | Vite | 7 | HMR, bundling, proxy |
| **Styling** | TailwindCSS | 4 | Utility-based styling |
| **Charts** | Recharts | 3 | Time series charts, area charts |
| **Routing** | React Router | 7 | SPA client routing |
| **Icons** | Lucide React | 0.575 | SVG icon set |
| **Serving** | Nginx | alpine | Static files + API reverse proxy |

---

## ✨ Supported Features

### Data Display

| Feature | Description | Page |
|---------|-------------|------|
| Fleet Summary | Overall host status statistics (online/offline/degraded) | Dashboard |
| Host Status Map | Color-coded dot grid | Dashboard |
| Alert Timeline | 24-hour Critical/Warning area chart | Dashboard |
| Host Table | Including CPU/MEM/Disk progress bars | Dashboard, Hosts |
| Host Cards | Individual host summary cards | Hosts |
| System Info | OS, CPU, Memory, GPU, Network detailed specs | Host Detail |
| CPU Chart | Usage time series, per-socket SVG Ring | Host Detail |
| Memory Chart | Usage time series, Used/Cached/Swap breakdown | Host Detail |
| Disk Chart | Per-device usage bars, I/O display | Host Detail |
| Network Chart | rx/tx time series | Host Detail |
| Alert List | Severity icons, relative time, filters | Alerts, Host Detail |
| Inventory | Hardware/software table | Inventory |

### Interaction

| Feature | Description |
|---------|-------------|
| Search | Host, alert text search |
| Filters | By status, by severity |
| Time Range | Chart 1h / 6h / 24h / 7d switching |
| Tab Navigation | Host Detail tabs (Overview/CPU/Memory/Disk/Network/Alerts) |
| Hover Tooltip | Chart data point details |
| Click Navigation | Host card → Detail, alert → Host Detail |
| Settings Saving | API endpoint, refresh interval, theme |

### Real-time

| Feature | Protocol | Description |
|---------|----------|-------------|
| Alert Stream | WebSocket | Subscribe to `/ws/v1/alerts/stream` |
| Auto Refresh | HTTP Polling | Configurable interval (default 30s) |

---

## 🔌 API Integration

Console uses SysOps Server's REST API.

### Used API Endpoints

| Endpoint | Used Page | Description |
|----------|-----------|-------------|
| `GET /api/v1/fleet/overview` | Dashboard | Fleet-wide statistics |
| `GET /api/v1/hosts` | Dashboard, Hosts | Host list |
| `GET /api/v1/hosts/{hostname}` | Host Detail | Host details |
| `GET /api/v1/hosts/{hostname}/metrics` | Host Detail | Time series metrics |
| `GET /api/v1/hosts/{hostname}/alerts` | Host Detail, Alerts | Alert list |
| `GET /api/v1/hosts/{hostname}/inventory` | Host Detail, Inventory | Inventory |
| `WS /ws/v1/alerts/stream` | Alerts | Real-time alerts |

### API Call Pattern

```typescript
// src/lib/api.ts

// All API calls executed through fetchApi wrapper
// Automatic fallback to mock data on API failure
async function fetchApi<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`${res.status}`);
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return fallback;  // Return mock data
  }
}
```

### Vite Proxy Configuration

API calls without CORS issues in development environment:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080',        // REST API
      '/ws': { target: 'ws://localhost:8080', ws: true },  // WebSocket
    },
  },
})
```

---

## 🎭 Mock Data

Built-in mock data allows UI verification without API server.

### Mock Configuration (`src/mocks/data.ts`)

| Data | Content |
|------|---------|
| `mockHosts` | 12 hosts (various status/OS/roles) |
| `mockAlerts` | 8 alerts (critical/warning/info) |
| `mockFleetOverview` | Fleet statistics |
| `generateMetrics()` | Time series metric generator (sin + random noise) |
| `getInventory()` | Per-host inventory |
| `hostMetricSnapshots` | Per-host CPU/MEM/Disk snapshots |

### Mock Host Examples

```
web-server-01    🟢 Online    Ubuntu 22.04   10.0.1.5
web-server-02    🟢 Online    Ubuntu 22.04   10.0.1.6
gpu-server-01    🟢 Online    Rocky 9        10.0.2.30
gpu-server-03    🔴 Critical  Rocky 9        10.0.2.32
db-server-01     🔴 Critical  Ubuntu 22.04   10.0.3.10
db-server-02     🟢 Online    Ubuntu 22.04   10.0.3.11
cache-01         🟡 Degraded  CentOS 9       10.0.4.5
monitor-01       🟢 Online    Ubuntu 24.04   10.0.5.1
edge-01          ⚫ Offline   Rocky 8        10.0.6.1
...
```

### Metric Generator

`generateMetrics(hostname, metricName, hours)` — Realistic time series data:

```
                 ╭─╮    noise + sin wave
  base ──────╮╭─╯ ╰──╮
             ╰╯       ╰────
  
  base = Different baseline per host/metric
  noise = Math.random() * amplitude
  pattern = sin(t * frequency) * swing
```

---

## 🐳 Deployment

### Docker Build

```bash
# Build image
docker build -t sysops-console .

# Run (Nginx serving)
docker run -p 3000:80 sysops-console
```

### Dockerfile (Multi-stage)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Nginx Configuration

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # API proxy → SysOps Server
    location /api/ {
        proxy_pass http://sysops-server:8080;
    }

    # WebSocket proxy
    location /ws/ {
        proxy_pass http://sysops-server:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### docker-compose Integration

```yaml
services:
  console:
    build: /tmp/sysops-console
    ports: ["3000:80"]
    depends_on: [server]

  server:
    build: /tmp/sysops-server
    ports: ["8080:8080"]
    depends_on: [postgres, nats]

  agent:
    build: /tmp/sysops-agent
    privileged: true
    depends_on: [nats]

  nats:
    image: nats:latest
    command: ["-js"]

  postgres:
    image: timescale/timescaledb:latest-pg16
    environment:
      POSTGRES_USER: sysops
      POSTGRES_PASSWORD: sysops
      POSTGRES_DB: sysops
```

---

## ⚙ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE` | API base URL (at build time) | `/api/v1` |

### Theme

| Element | Dark (Default) | Light |
|---------|----------------|-------|
| Background | `#0f172a` (slate-900) | `#f8fafc` (slate-50) |
| Card | `#1e293b` (slate-800) | `#ffffff` |
| Border | `#334155` (slate-700) | `#e2e8f0` (slate-200) |
| Text | `#f1f5f9` (slate-100) | `#0f172a` (slate-900) |
| Primary | `#3b82f6` (blue-500) | `#3b82f6` |
| Success | `#22c55e` (green-500) | `#22c55e` |
| Warning | `#f59e0b` (amber-500) | `#f59e0b` |
| Error | `#ef4444` (red-500) | `#ef4444` |

### Status Color Rules

| Status | Color | Meaning |
|--------|-------|---------|
| `online` | 🟢 Green | Operating normally |
| `critical` | 🔴 Red | Critical alert active |
| `degraded` | 🟡 Yellow | Warning alert active |
| `offline` | ⚫ Gray | No heartbeat received |