#!/usr/bin/env bash
# Share the Herd demo via Cloudflare Quick Tunnel (trycloudflare.com).
set -euo pipefail

HOST="${YG_TUNNEL_HOST:-yg-cart-drawer-demo.test}"
# Herd serves HTTPS on 127.0.0.1; plain http redirects to .test and breaks external visitors.
ORIGIN="${YG_TUNNEL_ORIGIN:-https://127.0.0.1}"

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared not found. Install: brew install cloudflared"
  exit 1
fi

echo "Tunnel → ${ORIGIN} (Host: ${HOST})"
echo "Public URL appears below (trycloudflare.com). Ctrl+C to stop."
echo ""

if [[ "${ORIGIN}" == https://* ]]; then
  exec cloudflared tunnel --url "${ORIGIN}" \
    --http-host-header "${HOST}" \
    --origin-server-name "${HOST}" \
    --no-tls-verify
else
  exec cloudflared tunnel --url "${ORIGIN}" --http-host-header "${HOST}"
fi
