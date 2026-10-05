import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { createContactMessage, getContactStatus } from '../controllers/contactController.js'

const router = Router()

router.get('/', getContactStatus)
router.post('/', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request, response) => response.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
  }),
}), createContactMessage)

export default router
