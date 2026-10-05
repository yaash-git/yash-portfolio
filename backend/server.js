import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import mongoose from 'mongoose'
import contactRoutes from './routes/contactRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { connectDB } from './config/db.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL }))
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (request, response) => {
  response.json({
    success: true,
    message: 'Portfolio API is running',
  })
})

app.get('/api/db-status', (request, response) => {
  const isConnected = mongoose.connection.readyState === 1

  response.status(isConnected ? 200 : 503).json({
    success: isConnected,
    database: isConnected ? 'connected' : 'disconnected',
  })
})

app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error)

  if (error.type === 'entity.too.large') {
    return response.status(413).json({
      success: false,
      message: 'Request body is too large.',
    })
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({
      success: false,
      message: 'Request body must contain valid JSON.',
    })
  }

  console.error(`Request failed (${error.name || 'unknown error'}).`)
  response.status(500).json({
    success: false,
    message: 'Something went wrong on the server.',
  })
})

async function startServer() {
  try {
    await connectDB()

    app.listen(env.PORT, () => {
      console.log(`Portfolio API listening on port ${env.PORT}`)
    })
  } catch (error) {
    console.error(`Server startup failed (${error.message}).`)
    process.exitCode = 1
  }
}

startServer()
