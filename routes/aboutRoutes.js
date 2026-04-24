const express = require('express')
const router = express.Router()
const { getAbout, updateAbout, createSection, updateSection, deleteSection } = require('../controllers/aboutController')
const { requireAuth, requireRole } = require('../middleware/auth')

// Public
router.get('/', getAbout)

// Admin/SuperAdmin
router.put('/', requireAuth, requireRole(['superAdmin', 'admin']), updateAbout)
router.post('/sections', requireAuth, requireRole(['superAdmin', 'admin']), createSection)
router.put('/sections/:key', requireAuth, requireRole(['superAdmin', 'admin']), updateSection)
router.delete('/sections/:key', requireAuth, requireRole(['superAdmin', 'admin']), deleteSection)

module.exports = router
