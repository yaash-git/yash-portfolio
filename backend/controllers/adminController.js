import ContactMessage from '../models/ContactMessage.js'

export async function getOwnerMessages(request, response, next) {
  try {
    const messages = await ContactMessage.find()
      .select({ name: 1, email: 1, message: 1, createdAt: 1, _id: 0 })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    response.set('Cache-Control', 'no-store')
    return response.json({ success: true, messages })
  } catch (error) {
    return next(error)
  }
}
