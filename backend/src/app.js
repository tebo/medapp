const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config')
const { notFound, errorHandler } = require('./middleware/error')

const authRoutes = require('./routes/auth.routes')
const doctorsRoutes = require('./routes/doctors.routes')
const appointmentsRoutes = require('./routes/appointments.routes')

const app = express()

app.use(cors({ origin: config.frontendUrl, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/doctors', doctorsRoutes)
app.use('/api/appointments', appointmentsRoutes)

app.use(notFound)
app.use(errorHandler)

// Solo arranca el servidor si se ejecuta directamente (no al ser importado por tests)
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`API lista en http://localhost:${config.port}`)
  })
}

module.exports = app