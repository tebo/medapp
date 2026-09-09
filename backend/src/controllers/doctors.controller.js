const userService = require('../services/user.service')

function listDoctors(req, res) {
  const doctors = userService.listDoctors()
  return res.json({ doctors })
}

module.exports = { listDoctors }