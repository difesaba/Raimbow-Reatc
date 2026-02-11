#!/bin/bash
set -e

# Download Caddy if not present
if [ ! -f ./caddy ]; then
  echo "Downloading Caddy..."
  node -e "
    const https = require('https');
    const fs = require('fs');
    const url = 'https://github.com/caddyserver/caddy/releases/download/v2.7.6/caddy_2.7.6_linux_amd64';
    const file = fs.createWriteStream('caddy');
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Caddy downloaded successfully');
      });
    }).on('error', (err) => {
      fs.unlink('caddy', () => {});
      console.error('Download failed:', err);
      process.exit(1);
    });
  "
  chmod +x ./caddy
fi

# Run Caddy
./caddy run --config Caddyfile --adapter caddyfile
