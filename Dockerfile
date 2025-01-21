FROM registry.access.redhat.com/ubi8/nginx-118
# Add application sources
USER 0
RUN rm -f /etc/nginx/nginx.conf
USER 1001
ADD default.conf "${NGINX_CONF_PATH}"
COPY dist/apps/aquila/browser /usr/share/nginx/html/
USER 0
RUN mkdir /var/cache/nginx && \
    chmod 777 /var/cache/nginx
EXPOSE 9090
CMD nginx -g "daemon off;"
