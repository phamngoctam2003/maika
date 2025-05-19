FROM php:8.2-apache

# 1. Cài đặt dependencies và extensions PHP
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd \
    && a2enmod rewrite

# 2. Cài đặt Composer (sửa lại cách copy)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 3. Thiết lập thư mục làm việc
WORKDIR /var/www/html

# 4. Copy source code (loại trừ thư mục không cần thiết)
COPY . .

# 5. Cài đặt dependencies Laravel
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 6. Tạo và cấp quyền cho thư mục storage
RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# 7. Cấu hình Apache
COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf

# 8. Port và CMD
EXPOSE 80
CMD ["apache2-foreground"]