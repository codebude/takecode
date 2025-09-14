# Use the official nginx image as the base image
FROM nginx:alpine

# Accept build argument for version
ARG VERSION
ENV VERSION=${VERSION}

# Copy the public directory contents to the nginx html directory
COPY public/ /usr/share/nginx/html/

# Create symlink for cleaner volume mounting
RUN mkdir -p /data && ln -s /data/db.json /usr/share/nginx/html/data/db.json

# Replace version placeholder
RUN sed -i "s/__VERSION__/${VERSION}/g" /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]