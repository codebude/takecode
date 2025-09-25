#!/bin/sh
# Substitute environment variables in index.html
envsubst '${SEARCH_HIGHLIGHT_LIMIT} ${SEARCH_TERM_MIN_LENGTH}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

# Function to handle shutdown signals
shutdown() {
    echo "Shutting down nginx..."
    nginx -s stop
    exit 0
}

# Trap SIGTERM and SIGINT for graceful shutdown
trap shutdown SIGTERM SIGINT

# Start nginx
nginx -g 'daemon off;'