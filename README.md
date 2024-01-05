## Setup application data and .env variables

- Set `SAN_API_KEY` in `.env` (API key can be generated here: [https://app.santiment.net/account#api-keys](https://app.santiment.net/account#api-keys))
- Update supported origins in [./src/origins.ts](./src/origins.ts). If the request to the proxy-server comes from another origin, it will result in a CORS error.
- To forward request to a proxy-server, add proxy's url as a `dataUrl=` search parameter to the embedded charts IFrame. Example: `https://embed.santiment.net/chart?dataUrl=https%3A%2F%2Fexample.com%3A8080%2Fgraphql&ps=weth&...`

## Start application using Docker

- Run `docker compose up`
- Service will be available on port `8080`.

## Start application manually (using npm)

- Install the dependencies `npm install`
- Create the build `npm run build`
- Start the application `npm run start`
- Service will be available on port `8080`.

