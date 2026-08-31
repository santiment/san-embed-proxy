// Origins allowed to call this proxy from a browser. Requests without an
// Origin header (curl, health checks, server-to-server) and requests from
// localhost/127.0.0.1 on any port (local dev pages) are always allowed.
export const CORS_ORIGINS = new Set(['https://embed.santiment.net'])
