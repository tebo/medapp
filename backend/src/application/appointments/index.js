const { createAppointment } = require('./createAppointment')
const { cancelAppointment } = require('./cancelAppointment')
const { updateAppointmentStatus } = require('./updateAppointmentStatus')
const { listMyAppointments, listPendingAppointments } = require('./listAppointments')

module.exports = {
  createAppointment,
  cancelAppointment,
  updateAppointmentStatus,
  listMyAppointments,
  listPendingAppointments,
}
