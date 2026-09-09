const { db } = require('../db')

const insertAppointment = db.prepare(
  `INSERT INTO appointments (patient_id, doctor_id, date, time, reason)
   VALUES (?, ?, ?, ?, ?)`
)

const findByStatus = db.prepare(`
  SELECT a.*, p.name AS patient_name, p.email AS patient_email,
         d.name AS doctor_name, d.specialty AS doctor_specialty
  FROM appointments a
  JOIN users p ON p.id = a.patient_id
  JOIN users d ON d.id = a.doctor_id
  WHERE a.status = ?
  ORDER BY a.date ASC, a.time ASC
`)

const findById = db.prepare(`
  SELECT a.*, p.name AS patient_name, p.email AS patient_email,
         d.name AS doctor_name, d.specialty AS doctor_specialty
  FROM appointments a
  JOIN users p ON p.id = a.patient_id
  JOIN users d ON d.id = a.doctor_id
  WHERE a.id = ?
`)

const findByUser = db.prepare(`
  SELECT a.*, p.name AS patient_name, d.name AS doctor_name,
         d.specialty AS doctor_specialty
  FROM appointments a
  JOIN users p ON p.id = a.patient_id
  JOIN users d ON d.id = a.doctor_id
  WHERE a.patient_id = ? OR a.doctor_id = ?
  ORDER BY a.date DESC, a.time DESC
`)

const updateStatus = db.prepare(
  'UPDATE appointments SET status = ? WHERE id = ? AND (patient_id = ? OR doctor_id = ?)'
)

module.exports = {
  createAppointment: ({ patientId, doctorId, date, time, reason }) => {
    const result = insertAppointment.run(patientId, doctorId, date, time, reason)
    return findById.get(result.lastInsertRowid)
  },
  getById: (id) => findById.get(id),
  listPending: () => findByStatus.all('pending'),
  listForUser: (userId) => findByUser.all(userId, userId),
  setStatus: (id, status, userId) => {
    const result = updateStatus.run(status, id, userId, userId)
    return result.changes > 0 ? findById.get(id) : null
  },
}