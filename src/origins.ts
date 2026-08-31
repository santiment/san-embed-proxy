// Origins allowed to call this proxy from a browser. Requests without an
// Origin header (curl, health checks, server-to-server) are always allowed.
export const CORS_ORIGINS = new Set(['http://localhost:8080', 'https://embed.santiment.net'])
