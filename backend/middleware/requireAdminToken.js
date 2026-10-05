import { createHash, timingSafeEqual } from 'node:crypto'
import { env } from '../config/env.js'

export function requireAdminToken(request, response, next) {
  const expectedToken = env.ADMIN_MESSAGES_TOKEN

  if (Buffer.byteLength(expectedToken) < 32) {
    return response.status(503).json({
      success: false,
      message: 'Owner message access is not configured.',
    })
  }

  const authorization = request.get('authorization') || ''
  const match = authorization.match(/^Bearer\s+([^\s]+)$/i)
  const suppliedToken = match?.[1] || ''

  if (!suppliedToken || Buffer.byteLength(suppliedToken) > 256) {
    return response.status(401).json({
      success: false,
      message: 'Unauthorized.',
    })
  }

  const suppliedHash = createHash('sha256').update(suppliedToken).digest()
  const expectedHash = createHash('sha256').update(expectedToken).digest()

  if (!timingSafeEqual(suppliedHash, expectedHash)) {
    return response.status(401).json({
      success: false,
      message: 'Unauthorized.',
    })
  }

  return next()
}
