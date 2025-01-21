FROM nginx
WORKDIR /app

RUN groupadd -r -g 1001 demo && useradd  -m -u 8877 -r -g demo demo

RUN chown -R demo:demo /app && chmod -R 755 /app && chown -R demo:demo /var/cache/nginx && \
        chown -R demo:demo /var/log/nginx && chown -R demo:demo /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && chown  demo:demo /var/run/nginx.pid
USER demo


COPY dist/apps/aquila/browser /app
EXPOSE 9090
