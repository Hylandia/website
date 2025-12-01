FROM node:22-alpine

RUN corepack enable pnpm
RUN apk add --no-cache nginx

WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

COPY ./stack/run.sh /run.sh
COPY ./stack/nginx.conf /etc/nginx/nginx.conf

RUN chmod +x /run.sh

CMD ["/run.sh"]