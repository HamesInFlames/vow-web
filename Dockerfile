# Railway: build the static site, serve dist/ with Caddy (plan O13).
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Railway passes service variables to a Dockerfile build only when they are declared as ARGs.
#   PUBLIC_WEB3FORMS_KEY  form delivery (forms show "call us" without it)
#   PUBLIC_SITE_ORIGIN    where no-JS form submits return to (defaults to siteUrl in dealership.json)
#   PUBLIC_REVIEW=1       review build: shows the yellow [confirm] chips
#   PUBLIC_ALLOW_INDEX=1  production launch only: lets search engines index, and refuses to build
#                         while any [confirm] item is still open
ARG PUBLIC_WEB3FORMS_KEY
ARG PUBLIC_SITE_ORIGIN
ARG PUBLIC_REVIEW
ARG PUBLIC_ALLOW_INDEX
ENV PUBLIC_WEB3FORMS_KEY=$PUBLIC_WEB3FORMS_KEY     PUBLIC_SITE_ORIGIN=$PUBLIC_SITE_ORIGIN     PUBLIC_REVIEW=$PUBLIC_REVIEW     PUBLIC_ALLOW_INDEX=$PUBLIC_ALLOW_INDEX
RUN if [ "$PUBLIC_ALLOW_INDEX" = "1" ]; then npm run confirm-report -- --strict; fi && npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
EXPOSE 8080
