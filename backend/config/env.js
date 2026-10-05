import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) })

const requiredVariables = [
  'PORT',
  'MONGODB_URI',
  'CLIENT_URL',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'CONTACT_EMAIL',
]

const missingVariables = requiredVariables.filter((name) => !process.env[name]?.trim())

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missingVariables.join(', ')}`)
}

const port = Number(process.env.PORT)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a whole number between 1 and 65535.')
}

export const env = Object.freeze({
  PORT: port,
  MONGODB_URI: process.env.MONGODB_URI.trim(),
  CLIENT_URL: process.env.CLIENT_URL.trim(),
  RESEND_API_KEY: process.env.RESEND_API_KEY.trim(),
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL.trim(),
  CONTACT_EMAIL: process.env.CONTACT_EMAIL.trim(),
  ADMIN_MESSAGES_TOKEN: process.env.ADMIN_MESSAGES_TOKEN?.trim() || '',
})
