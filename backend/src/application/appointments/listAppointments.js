const appointmentModel = require('../../models/appointment.model')

function listMyAppointments({ userId }) {
  return { appointments: appointmentModel.listForUser(userId) }
}

function listPendingAppointments({ doctorId }) {
  const appointments = appointmentModel
    .listPending()
    .filter((a) => a.doctor_id === doctorId)
  return { appointments }
}

module.exports = { listMyAppointments, listPendingAppointments }
