import * as process from 'process'
import { NextFunction, Request, Response, Router } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import ApiError from '../../abstractions/ApiError'
import BaseApi from '../BaseApi'

/**
 * Status controller
 */
export default class SanApiController extends BaseApi {
	constructor() {
		super()
	}

	public register(): Router {
		this.router.post('/graphql', this.postProxyRequest.bind(this))
		return this.router
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async postProxyRequest(req: Request, res: Response, next: NextFunction) {
		try {
			const apiRes = await fetch('https://api.santiment.net/graphql', {
				method: 'POST',
				body: JSON.stringify(req.body),
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Apikey ${process.env.SAN_API_KEY}`,
				},
			})

			const response = await apiRes.json()

			res.locals.data = response

			// call base class method
			super.send(res)
		} catch (err) {
			next(err)
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getError(req: Request, res: Response, next: NextFunction): void {
		try {
			throw new ApiError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST)
		} catch (error) {
			// from here error handler will get call
			next(error)
		}
	}
}
