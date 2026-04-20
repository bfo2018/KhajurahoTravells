#!/usr/bin/env bash

set -euo pipefail

CONTAINER_NAME="${CONTAINER_NAME:-khajuraho-backend}"
LOCAL_PORT="${LOCAL_PORT:-5050}"
HEALTH_PATH="${HEALTH_PATH:-/api/health}"
HEALTH_URL="http://localhost:${LOCAL_PORT}${HEALTH_PATH}"

require_command() {
  local name="$1"
  if ! command -v "$name" >/dev/null 2>&1; then
    echo "Missing required command: $name" >&2
    exit 1
  fi
}

wait_for_health() {
  local attempts=20

  for ((i=1; i<=attempts; i+=1)); do
    if curl --silent --show-error --fail "$HEALTH_URL" >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done

  echo "Backend did not become healthy at $HEALTH_URL" >&2
  exit 1
}

require_command docker
require_command curl
require_command ngrok

if ! docker info >/dev/null 2>&1; then
  echo "Docker Desktop does not appear to be running. Start Docker and run this script again." >&2
  exit 1
fi

if ! docker ps -a --format '{{.Names}}' | grep -Fx "$CONTAINER_NAME" >/dev/null 2>&1; then
  echo "Container '$CONTAINER_NAME' was not found." >&2
  echo "Set CONTAINER_NAME to your backend container name if it is different." >&2
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -Fx "$CONTAINER_NAME" >/dev/null 2>&1; then
  echo "Starting Docker container '$CONTAINER_NAME'..."
  docker start "$CONTAINER_NAME" >/dev/null
else
  echo "Docker container '$CONTAINER_NAME' is already running."
fi

echo "Checking backend health at $HEALTH_URL ..."
wait_for_health
echo "Backend is healthy."

echo "Starting ngrok tunnel for http://localhost:${LOCAL_PORT}"
exec ngrok http "$LOCAL_PORT"
