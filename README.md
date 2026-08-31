# san-embed-proxy

A small proxy that lets [embedded Santiment charts](https://embed.santiment.net) fetch data with your Santiment API key, without exposing the key to the browser. It forwards `POST /graphql` to `https://api.santiment.net/graphql` and adds the `Authorization` header from `SAN_API_KEY`.

It is not tied to the embedded charts: your own web app can send any [Santiment GraphQL](https://academy.santiment.net/sanapi/) query to the proxy the same way — add your app's origin to the allowlist and POST to `/graphql`.

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

Either way the service listens on port `8080` (override with `PORT`).

## Try it

> **Do not forget to run the proxy first** (see above)!

```sh
curl localhost:8080/health

# Proves the API key is attached: returns your user id (null means bad/missing key)
curl -X POST localhost:8080/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ currentUser { id } }"}'

# Chart-style query: daily ETH price for the last 7 days
curl -X POST localhost:8080/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ getMetric(metric: \"price_usd\") { timeseriesData(slug: \"ethereum\", from: \"utc_now-7d\", to: \"utc_now\", interval: \"1d\") { datetime value } } }"}'
```

(No `Origin` header needed — requests without one are allowed by design; only browser origins are filtered.)

### From a browser

Same requests, but cross-origin through real CORS — the way an embedded chart calls the proxy:

```sh
npm run test:browser
```

Open the URL it prints and click the buttons. Any `localhost` port works — localhost origins are always allowed, so your editor's HTML preview works too. Non-localhost origins must be listed in [`src/origins.ts`](./src/origins.ts) or the browser blocks the request. The page's `fetch` call is also the starting point for using the proxy from your own web app.

## Development

- `npm run dev` — start with reload on change
- `npm test` — run the tests
- `npm run lint` — lint

## Security note

CORS only restricts browsers. Anyone who can reach the proxy URL directly can spend your API quota, so don't advertise the URL and restrict access at the network level if you can.
