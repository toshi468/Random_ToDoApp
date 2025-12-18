#!/usr/bin/env sh
set -eu

cd /var/www/html

# Render sets PORT; keep fallback for local runs.
PORT="${PORT:-10000}"
export PORT

echo "[entrypoint] PORT=${PORT}"

# Render nginx config from template (only substitute $PORT; keep $uri, $query_string intact)
envsubst '$PORT' < /etc/nginx/templates/laravel.conf.template > /etc/nginx/conf.d/laravel.conf

# Ensure runtime-writable directories exist and are writable
mkdir -p storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache || true

# Fail early if APP_KEY missing (common cause of 500)
if [ -z "${APP_KEY:-}" ]; then
  echo "[entrypoint] ERROR: APP_KEY is not set. Set APP_KEY in Render Environment Variables." >&2
  exit 1
fi

# Clear & rebuild caches using runtime environment variables
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true
php artisan cache:clear || true

php artisan config:cache
php artisan route:cache || true

# Run migrations on startup (free plan may not provide shell access)
php artisan migrate --force

# Start PHP-FPM and Nginx
php-fpm -F &
exec nginx -g "daemon off;"


