import { Router } from 'express'
import SanApiController from './components/san-api/controller'

/**
 * Here, you can register routes by instantiating the controller.
 *
 */
export default function registerRoutes(): Router {
	const router = Router()

	const sanApiController = new SanApiController()

	router.use('/', sanApiController.register())

	return router
}
