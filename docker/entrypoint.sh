#!/bin/bash
set -euo pipefail

cd /var/www/html

if [ ! -f .env ]; then
  cp .env.example .env
fi

# Force container-friendly defaults (SQLite, public URL)
php -r '
$file = ".env";
$env = file_get_contents($file);
$replacements = [
  "/^APP_ENV=.*/m" => "APP_ENV=local",
  "/^APP_DEBUG=.*/m" => "APP_DEBUG=true",
  "/^APP_URL=.*/m" => "APP_URL=http://localhost:8080",
  "/^DB_CONNECTION=.*/m" => "DB_CONNECTION=sqlite",
  "/^SESSION_DRIVER=.*/m" => "SESSION_DRIVER=database",
  "/^CACHE_STORE=.*/m" => "CACHE_STORE=database",
  "/^QUEUE_CONNECTION=.*/m" => "QUEUE_CONNECTION=database",
  "/^DEMO_PREVIEW_AUTH_ENABLED=.*/m" => "DEMO_PREVIEW_AUTH_ENABLED=false",
];
foreach ($replacements as $pattern => $value) {
  if (preg_match($pattern, $env)) {
    $env = preg_replace($pattern, $value, $env);
  } else {
    $env .= "\n" . $value;
  }
}
file_put_contents($file, $env);
'

if ! grep -q '^APP_KEY=base64:' .env; then
  php artisan key:generate --force
fi

mkdir -p database storage/framework/{cache,sessions,views} storage/logs bootstrap/cache
touch database/database.sqlite
chown -R www-data:www-data storage bootstrap/cache database || true

php artisan migrate --force

exec "$@"
