import { Resend } from 'resend'
import { env } from '../config/env.js'

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const escapedCharacters = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }

    return escapedCharacters[character]
  })
}

export async function sendContactNotification({ name, email, message }) {
  const apiKey = env.RESEND_API_KEY
  const recipient = env.CONTACT_EMAIL
  const sender = env.RESEND_FROM_EMAIL

  if (
    !apiKey || apiKey === 'your_resend_api_key'
    || !recipient
    || !sender || sender === 'your_verified_sender@example.com'
  ) {
    const error = new Error('Email configuration is incomplete.')
    error.code = 'EMAIL_CONFIG_INCOMPLETE'
    throw error
  }

  const resend = new Resend(apiKey)
  const subjectName = name.replace(/[\r\n]+/g, ' ').trim()
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message)

  try {
    const { error } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: email,
      subject: `New portfolio contact message from ${subjectName}`,
      text: `New message from your portfolio\n\nName:\n${name}\n\nEmail:\n${email}\n\nMessage:\n${message}`,
      html: `<h1>New message from your portfolio</h1>
        <p><strong>Name:</strong><br>${safeName}</p>
        <p><strong>Email:</strong><br>${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space: pre-wrap; font: inherit">${safeMessage}</pre>`,
    })

    if (error) throw new Error('Resend rejected the notification.')
  } catch {
    const error = new Error('Email notification could not be delivered.')
    error.code = 'EMAIL_DELIVERY_FAILED'
    throw error
  }
}
