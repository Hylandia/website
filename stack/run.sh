#!/bin/sh

echo "HOSTNAME=$HOSTNAME" >> /app/.env
echo "NODE_ENV=$NODE_ENV" >> /app/.env

pnpm build

cp -r /app/dist /usr/share/nginx/html

# start nginx in the foreground but background it so this shell remains PID 1
nginx -g 'daemon off;' &
NGINX_PID=$!

# ensure log files exist then tail them to stdout so container logs show nginx output
[ -d /var/log/nginx ] && {
  for f in /var/log/nginx/access.log /var/log/nginx/error.log; do
	[ -f "$f" ] || touch "$f"
  done
  tail -F /var/log/nginx/*.log &
  TAIL_PID=$!
}

# forward signals to nginx so Ctrl+C / docker stop work
_graceful_stop() {
  echo "Shutting down nginx (pid $NGINX_PID)..."
  kill -TERM "$NGINX_PID" 2>/dev/null || true
  wait "$NGINX_PID" 2>/dev/null || true
  [ -n "$TAIL_PID" ] && kill -TERM "$TAIL_PID" 2>/dev/null || true
  exit 0
}
trap _graceful_stop INT TERM

# wait for nginx to exit
wait "$NGINX_PID"
# cleanup tail if still running
[ -n "$TAIL_PID" ] && kill -TERM "$TAIL_PID" 2>/dev/null || true