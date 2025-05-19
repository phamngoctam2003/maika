FROM php:8.2-apache

# Cài đặt dependencies và extensions PHP
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

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Thiết lập thư mục làm việc
WORKDIR /var/www/html

# Copy source code
COPY . .

# Tạo thư mục và set quyền trước khi cài đặt composer
# RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
#     && chown -R www-data:www-data storage bootstrap/cache \
#     && chmod -R 775 storage bootstrap/cache

# # Cài đặt dependencies Laravel
# RUN composer install --no-interaction --optimize-autoloader --no-dev

# Copy cấu hình Apache
COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf

# Mở cổng 80 và chạy Apache
EXPOSE 80
CMD ["apache2-foreground"]
