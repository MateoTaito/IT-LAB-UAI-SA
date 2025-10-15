# --- Build: Vite with /lab base ---
FROM node:20-bookworm AS build
WORKDIR /app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --base=/sa_it_lab_uai/

# --- Runtime: Serve with Nginx ---
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Configurar zona horaria de Chile continental
ENV TZ=America/Santiago
RUN apk add --no-cache tzdata && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

# Copy build output
COPY --from=build /app/dist ./

# Replace default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
