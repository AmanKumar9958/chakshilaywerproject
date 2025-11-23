#!/bin/sh
set -e

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client (in case schema changed)
echo "Generating Prisma client..."
npx prisma generate

echo "Starting application..."
exec "$@"