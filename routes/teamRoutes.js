const express = require('express')
const router = express.Router()
const { getTeam, updateTeam } = require('../controllers/teamController')
const { requireAuth, requireRole } = require('../middleware/auth')

// Public
router.get('/', getTeam)

// Admin/SuperAdmin
router.put('/', requireAuth, requireRole(['superAdmin', 'admin']), updateTeam)

module.exports = router
