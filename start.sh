#!/bin/bash
set -e

# Download Caddy if not present
if [ ! -f ./caddy ]; then
  echo "Downloading Caddy..."
  curl -L https://github.com/caddyserver/caddy/releases/download/v2.7.6/caddy_2.7.6_linux_amd64 -o caddy
  chmod +x ./caddy
  echo "Caddy downloaded successfully"
fi

# Run Caddy
./caddy run --config Caddyfile --adapter caddyfile
