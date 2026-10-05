import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { getOwnerMessages } from '../controllers/adminController.js'
import { requireAdminToken } from '../middleware/requireAdminToken.js'

const router = Router()

const messageAccessLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request, response) => response.status(429).json({
    success: false,
    message: 'Too many attempts. Please try again later.',
  }),
})

router.get('/messages', messageAccessLimit, requireAdminToken, getOwnerMessages)

export default router
