import ContactMessage from '../models/ContactMessage.js'
import { sendContactNotification } from '../services/emailService.js'

export function getContactStatus(request, response) {
  response.json({
    success: true,
    message: 'Contact API is ready',
  })
}

export async function createContactMessage(request, response) {
  const body = request.body

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return response.status(400).json({
      success: false,
      message: 'Please provide a valid name, email, and message.',
    })
  }

  const { name, email, message } = body

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return response.status(400).json({
      success: false,
      message: 'Please provide a valid name, email, and message.',
    })
  }

  const trimmedName = name.trim()
  const trimmedEmail = email.trim().toLowerCase()
  const trimmedMessage = message.trim()
  const validEmail = /^[^\s@]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(trimmedEmail)

  if (
    !trimmedName || trimmedName.length > 100
    || !validEmail || trimmedEmail.length > 254
    || !trimmedMessage || trimmedMessage.length > 2000
  ) {
    return response.status(400).json({
      success: false,
      message: 'Please provide a valid name, email, and message.',
    })
  }

  try {
    await ContactMessage.create({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    })
  } catch (error) {
    // Keep database diagnostics out of the response and avoid logging message data.
    console.error(`Contact message could not be saved (${error.name || 'unknown error'}).`)
    return response.status(500).json({
      success: false,
      message: 'Unable to process your message right now.',
    })
  }

  console.log('Contact message received.')

  try {
    await sendContactNotification({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    })
  } catch (error) {
    const safeErrorMessage = error.code === 'EMAIL_CONFIG_INCOMPLETE'
      ? 'Email configuration is incomplete.'
      : 'Email notification could not be delivered.'
    console.error(safeErrorMessage)
  }

  return response.status(201).json({
    success: true,
    message: 'Message received successfully.',
  })
}
