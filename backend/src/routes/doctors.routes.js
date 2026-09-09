const { Router } = require('express')
const { listDoctors } = require('../controllers/doctors.controller')
const { authenticate } = require('../middleware/auth')

const router = Router()

router.get('/', authenticate, listDoctors)

module.exports = router