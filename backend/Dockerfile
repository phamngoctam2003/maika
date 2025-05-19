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
# Cấu hình Apache
COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf

# 5. Cài đặt dependencies Laravel
RUN composer install --no-interaction --optimize-autoloader --no-dev


# Thiết lập quyền
# RUN chown -R www-data:www-data /var/www/html \
#     && chmod -R 775 /var/www/html/storage \
#     && chmod -R 775 /var/www/html/bootstrap/cache

    # RUN mkdir -p /var/www/html/storage \
    # && mkdir -p /var/www/html/bootstrap/cache \
    # && chown -R www-data:www-data /var/www/html \
    # && chmod -R 775 /var/www/html/storage \
    # && chmod -R 775 /var/www/html/bootstrap/cache

    
# 8. Port và CMD
EXPOSE 80
CMD ["apache2-foreground"]