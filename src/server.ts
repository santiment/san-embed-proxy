import 'dotenv/config'
import createApp from './app'
import logger from './logger'

if (!process.env.SAN_API_KEY) {
	logger.error('SAN_API_KEY is not set. Copy .env.example to .env and fill it in.')
	process.exit(1)
}

const port = Number(process.env.PORT) || 8080

const server = createApp().listen(port, () => {
	logger.info(`san-embed-proxy listening on port ${port}`)
})

server.on('error', (err: NodeJS.ErrnoException) => {
	if (err.code === 'EADDRINUSE') {
		logger.error(`Port ${port} is already in use — is the proxy already running (check \`docker compose ps\`)?`)
		process.exit(1)
	}
	throw err
})

function shutdown(): void {
	server.close(() => process.exit(0))
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
