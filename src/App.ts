import http from 'http'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import addErrorHandler from './middleware/error-handler'
import registerRoutes from './routes'
import { CORS_ORIGINS } from './origins'

export default class App {
	public express: express.Application

	public httpServer: http.Server

	public async init(): Promise<void> {
		this.express = express()
		this.httpServer = http.createServer(this.express)

		// add all global middleware like cors
		this.middleware()

		// // register the all routes
		this.routes()

		// add the middleware to handle error, make sure to add if after registering routes method
		this.express.use(addErrorHandler)
	}

	/**
	 * here register your all routes
	 */
	private routes(): void {
		this.express.use('/', registerRoutes())
	}

	/**
	 * here you can apply your middlewares
	 */
	private middleware(): void {
		// support application/json type post data
		// support application/x-www-form-urlencoded post data
		// Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
		this.express.use(helmet({ contentSecurityPolicy: false }))
		this.express.use(express.json({ limit: '100mb' }))
		this.express.use(express.urlencoded({ limit: '100mb', extended: true }))

		// add multiple cors options as per your use
		this.express.use(
			cors({
				// origin: 'http://localhost:3000',
				origin: (origin, callback) => {
					if (CORS_ORIGINS.has(origin)) {
						callback(null, [origin])
						return
					}

					callback(new Error('CORS error'), [])
				},
			}),
		)
	}
}
