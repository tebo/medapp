const { Router } = require('express')
const {
  createAppointment,
  listMyAppointments,
  listPending,
  confirm,
  reject,
} = require('../controllers/appointments.controller')
const { authenticate, authorize } = require('../middleware/auth')

const router = Router()

router.use(authenticate)

router.post('/', authorize('patient'), createAppointment)
router.get('/mine', listMyAppointments)
router.get('/pending', authorize('doctor'), listPending)
router.patch('/:id/confirm', authorize('doctor'), confirm)
router.patch('/:id/reject', authorize('doctor'), reject)

module.exports = router