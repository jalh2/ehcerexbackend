const express = require('express')
const router = express.Router()
const { getHome, updateHome } = require('../controllers/homeController')
const { requireAuth, requireRole } = require('../middleware/auth')

// Public
router.get('/', getHome)

// Admin/SuperAdmin
router.put('/', requireAuth, requireRole(['superAdmin', 'admin']), updateHome)

module.exports = router
