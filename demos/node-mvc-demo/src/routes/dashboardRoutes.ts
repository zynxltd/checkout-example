import { Router } from 'express'
import * as dashboardController from '../controllers/dashboardController.js'
import requireAuth from '../middleware/requireAuth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

const router = Router()

router.get('/dashboard', requireAuth, asyncHandler(dashboardController.show))
router.post('/dashboard/jobs', requireAuth, dashboardController.enqueueDemoJob)
router.post('/dashboard/quote-digest', requireAuth, dashboardController.enqueueQuoteDigest)

export default router
