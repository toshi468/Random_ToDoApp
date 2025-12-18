FROM php:8.2-fpm-bullseye

# ===== System dependencies & PHP extensions =====
# - gettext-base: envsubst (render nginx config from template)
RUN apt-get update && apt-get install -y \
    nginx \
    git \
    unzip \
    gettext-base \
    libpq-dev \
    libzip-dev \
  && docker-php-ext-install pdo pdo_pgsql zip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# ===== Composer =====
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ===== Application source =====
COPY . .

# ===== Install PHP dependencies =====
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist

# ===== App write permissions =====
RUN chown -R www-data:www-data storage bootstrap/cache

# ===== Nginx configuration (template; rendered at runtime) =====
RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf \
 && mkdir -p /etc/nginx/templates
COPY docker/nginx.conf.template /etc/nginx/templates/laravel.conf.template

# ===== Entrypoint =====
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Render typically sets PORT=10000; keep a sensible default.
ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["/entrypoint.sh"]