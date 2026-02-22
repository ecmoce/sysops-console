#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────
# SysOps Console — Installation Script
# Installs static files + nginx reverse proxy
# Usage: sudo ./install.sh [--server-url http://localhost:8080]
# ─────────────────────────────────────────────────────────

CONSOLE_DIR="/var/www/sysops-console"
NGINX_CONF="/etc/nginx/conf.d/sysops-console.conf"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[+]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✗]${NC} $*" >&2; }
info() { echo -e "${BLUE}[i]${NC} $*"; }

SERVER_URL="http://localhost:8080"
LISTEN_PORT="3000"
DIST_PATH=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --server-url) SERVER_URL="$2"; shift 2 ;;
        --port)       LISTEN_PORT="$2"; shift 2 ;;
        --dist)       DIST_PATH="$2"; shift 2 ;;
        -h|--help)
            echo "Usage: sudo $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --server-url URL   SysOps Server URL (default: http://localhost:8080)"
            echo "  --port PORT        Nginx listen port (default: 3000)"
            echo "  --dist PATH        Path to pre-built dist/ directory"
            echo "  -h, --help         Show this help"
            exit 0
            ;;
        *) err "Unknown option: $1"; exit 1 ;;
    esac
done

if [[ $EUID -ne 0 ]]; then
    err "Run as root (sudo)"
    exit 1
fi

# ── Install nginx if missing ──
if ! command -v nginx &>/dev/null; then
    log "Installing nginx"
    if command -v apt-get &>/dev/null; then
        apt-get update -qq && apt-get install -y -qq nginx
    elif command -v dnf &>/dev/null; then
        dnf install -y -q nginx
    elif command -v yum &>/dev/null; then
        yum install -y -q nginx
    else
        err "Cannot install nginx automatically. Install manually."
        exit 1
    fi
fi

# ── Copy dist files ──
mkdir -p "$CONSOLE_DIR"

if [[ -n "$DIST_PATH" ]] && [[ -d "$DIST_PATH" ]]; then
    log "Copying dist from: $DIST_PATH"
    cp -r "$DIST_PATH"/* "$CONSOLE_DIR/"
elif [[ -d "$SCRIPT_DIR/../dist" ]]; then
    log "Copying dist from build output"
    cp -r "$SCRIPT_DIR/../dist"/* "$CONSOLE_DIR/"
else
    err "No dist/ found. Build first: npm run build"
    err "Or provide: --dist /path/to/dist"
    exit 1
fi

# ── Nginx config ──
log "Configuring nginx"
cat > "$NGINX_CONF" <<EOF
server {
    listen $LISTEN_PORT;
    server_name _;

    root $CONSOLE_DIR;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # API proxy → SysOps Server
    location /api/ {
        proxy_pass $SERVER_URL;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_read_timeout 60s;
    }

    # WebSocket proxy
    location /ws/ {
        proxy_pass $SERVER_URL;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_read_timeout 3600s;
    }

    # Health check
    location /health {
        proxy_pass $SERVER_URL;
    }

    # SPA fallback
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# ── Test & reload nginx ──
nginx -t 2>/dev/null && {
    systemctl reload nginx 2>/dev/null || systemctl start nginx
    log "Nginx configured and reloaded"
} || {
    err "Nginx config test failed"
    exit 1
}

systemctl enable nginx 2>/dev/null || true

echo ""
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  SysOps Console installed successfully!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo ""
echo "  Files:    $CONSOLE_DIR"
echo "  Nginx:    $NGINX_CONF"
echo "  Server:   $SERVER_URL"
echo "  Port:     $LISTEN_PORT"
echo ""
echo "  Access:   http://$(hostname -I | awk '{print $1}'):$LISTEN_PORT"
echo ""
