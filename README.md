# cert-sh-ui

A nicer frontend to crt.sh, which works _most_ of the time.

## Requirements

This can be run via Docker, or directly on a host with Node.JS 16+ installed. You'll also need a Redis instance running.

## Usage

### Docker

```bash
docker run -p 3000:3000 -d --name cert-sh-ui ghcr.io/behnh/cert-sh-ui:latest -e REDIS_URL=<your_redis_url> -e POSTGRES_USERNAME=guest -e POSTGRES_HOST=crt.sh POSTGRES_DATABASE=certwatch
```

### Node.JS

Make a copy of `.env.example` and name it `.env`. Fill in the values for your Redis and Postgres instances.
```
REDIS_URL=redis://localhost:6379
POSTGRES_USERNAME=guest
POSTGRES_HOST=crt.sh
POSTGRES_DATABASE=certwatch
```

Then run the following commands:

```bash
npm install
npm run build
npm start
```

The server will be listening on port 3000 by default.
