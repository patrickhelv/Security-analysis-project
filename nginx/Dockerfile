# Webserver running nginx
FROM nginx:perl

# Import environment variables
ENV GROUPID=${GROUPID}
ENV PORT_PREFIX=${PORT_PREFIX}

# Copy everything contained in this folder except what's specified in .dockerignore
COPY . /etc/nginx/
