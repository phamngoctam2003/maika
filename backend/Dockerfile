FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    zip \
    unzip \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl pdo pdo_mysql mbstring exif pcntl bcmath gd \
    && a2enmod rewrite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# Tạo thư mục cần thiết và set quyền trước khi chạy composer
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Cài đặt dependencies Laravel
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Copy cấu hình Apache
COPY ./docker/000-default.conf /etc/apache2/sites-available/000-default.conf

# COPY ./docker/etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/000-default.conf




EXPOSE 80

CMD ["apache2-foreground"]
