FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy output directory from builder to nginx image.
COPY dist/out/ /usr/share/nginx/html/

# Copy nginx configuration file.
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
