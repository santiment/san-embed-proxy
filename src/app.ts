import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import logger from './logger'
import { CORS_ORIGINS } from './origins'

const SAN_API_URL = process.env.SAN_API_URL || 'https://api.santiment.net/graphql'
const UPSTREAM_TIMEOUT_MS = 30_000

export default function createApp(): express.Express {
	const app = express()

	app.use(helmet())
	app.use(express.json({ limit: '1mb' }))
	app.use(
		cors({
			origin: (origin, callback) => {
				// Requests without an Origin header (curl, health checks) are not
				// browser CORS requests — let them through.
				if (!origin || CORS_ORIGINS.has(origin)) {
					callback(null, true)
					return
				}
				callback(Object.assign(new Error('Origin not allowed'), { status: 403 }))
			},
		}),
	)

	app.get('/health', (_req, res) => {
		res.json({ status: 'ok' })
	})

	app.post('/graphql', async (req, res, next) => {
		try {
			const upstream = await fetch(SAN_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Apikey ${process.env.SAN_API_KEY}`,
				},
				body: JSON.stringify(req.body),
				signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
			})

			const body = await upstream.text()
			res.status(upstream.status)
				.type(upstream.headers.get('content-type') ?? 'application/json')
				.send(body)
		} catch (err) {
			next(err)
		}
	})

	// Express recognizes an error handler by its 4-argument signature.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app.use((err: Error & { status?: number }, req: Request, res: Response, _next: NextFunction) => {
		const status = err.status ?? (err.name === 'TimeoutError' ? 504 : 500)
		logger.error(`${req.method} ${req.path} failed with ${status}: ${err.message}`)
		res.status(status).json({ status, message: err.message || 'Internal server error' })
	})

	return app
}
