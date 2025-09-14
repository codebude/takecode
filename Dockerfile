# Use the official nginx image as the base image
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Accept build argument for version
ARG VERSION
ENV VERSION=${VERSION}

# Copy the public directory contents to the nginx html directory
COPY public/ /usr/share/nginx/html/

# Create symlink for cleaner volume mounting
RUN ln -s /data /usr/share/nginx/html/data

# Replace version placeholder
RUN sed -i "s/__VERSION__/${VERSION}/g" /usr/share/nginx/html/index.html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx with envsubst to inject environment variables
CMD ["/bin/sh", "-c", "envsubst '${SEARCH_HIGHLIGHT_LIMIT}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp && mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html && nginx -g 'daemon off;'"]