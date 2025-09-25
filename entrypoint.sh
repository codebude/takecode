#!/bin/sh
# Substitute environment variables in index.html
envsubst '${SEARCH_HIGHLIGHT_LIMIT} ${SEARCH_TERM_MIN_LENGTH}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

# Start nginx
nginx -g 'daemon off;'