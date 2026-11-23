import { Router } from 'express'
import * as apiController from '../controllers/apiController.js'
import requireAuth from '../middleware/requireAuth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

router.get('/health', apiController.health)
router.get('/dashboard', requireAuth, asyncHandler(apiController.dashboardJson))

export default router
