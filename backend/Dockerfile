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

# Tạo thư mục và set quyền (nếu cần)
# Thiết lập quyền
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

RUN mkdir -p /var/www/html/storage \
    && mkdir -p /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache
# Cài đặt các thư viện PHP cần thiết
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Copy cấu hình Apache
COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf
# Mở cổng 80 và chạy Apache
EXPOSE 80

CMD ["apache2-foreground"]
