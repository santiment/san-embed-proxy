# san-embed-proxy

A small proxy that lets [embedded Santiment charts](https://embed.santiment.net) fetch data with your Santiment API key, without exposing the key to the browser. It forwards `POST /graphql` to `https://api.santiment.net/graphql` and adds the `Authorization` header from `SAN_API_KEY`.

## Setup

1. Copy `.env.example` to `.env` and set `SAN_API_KEY` ([generate a key](https://app.santiment.net/account#api-keys)).
2. Add every origin your charts are embedded on to [`src/origins.ts`](./src/origins.ts). Browser requests from other origins are rejected with a CORS error.
3. Point the chart iframe at your deployed proxy by passing its `/graphql` URL (URL-encoded) as the `dataUrl` query parameter:

   ```
   https://embed.santiment.net/chart?dataUrl=https%3A%2F%2Fyour-proxy.example.com%2Fgraphql&ps=weth&...
   ```

## Run with Docker

```sh
docker compose up
```

## Run with npm

```sh
npm install
npm run build
npm start
```

Either way the service listens on port `8080` (override with `PORT`). Verify with `curl localhost:8080/health`.

## Development

- `npm run dev` — start with reload on change
- `npm test` — run the tests
- `npm run lint` — lint

## Security note

CORS only restricts browsers. Anyone who can reach the proxy URL directly can spend your API quota, so don't advertise the URL and restrict access at the network level if you can.
