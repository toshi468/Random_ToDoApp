FROM php:8.2-fpm-bullseye

# ===== System dependencies & PHP extensions =====
RUN apt-get update && apt-get install -y \
    nginx \
    git \
    unzip \
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

# ストレージとキャッシュディレクトリに書き込み権限を付与
RUN chown -R www-data:www-data storage bootstrap/cache

# ===== Nginx configuration =====
RUN rm -f /etc/nginx/sites-enabled/default \
 && rm -f /etc/nginx/conf.d/default.conf \
 && printf '%s\n' 'server {' \
 '    listen 10000;' \
 '    server_name _;' \
 '    root /var/www/html/public;' \
 '    index index.php index.html;' \
 '    location / {' \
 '        try_files $uri $uri/ /index.php?$query_string;' \
 '    }' \
 '    location ~ \.php$ {' \
 '        include snippets/fastcgi-php.conf;' \
 '        fastcgi_pass 127.0.0.1:9000;' \
 '    }' \
 '}' > / etc/nginx/conf.d/laravel.conf

EXPOSE 10000

# ===== Start PHP-FPM + Nginx =====
# 起動時に環境変数を使ってキャッシュとマイグレーションを実行
CMD php artisan config:clear \
 && php artisan config:cache \
 && php artisan route:cache \
 && php artisan migrate --force || true \
 && php-fpm & nginx -g 'daemon off;'