const express = require('express')
const router = express.Router()
const { listCompanies, getCompany, createCompany, updateCompany, deleteCompany, deleteCompanyImage } = require('../controllers/companyController')
const { requireAuth, requireRole } = require('../middleware/auth')

// Public
router.get('/', listCompanies)
router.get('/:idOrSlug', getCompany)

// Admin/SuperAdmin
router.post('/', requireAuth, requireRole(['superAdmin', 'admin']), createCompany)
router.put('/:id', requireAuth, requireRole(['superAdmin', 'admin']), updateCompany)
router.delete('/:id', requireAuth, requireRole(['superAdmin', 'admin']), deleteCompany)
router.delete('/:id/image/:idx', requireAuth, requireRole(['superAdmin', 'admin']), deleteCompanyImage)

module.exports = router
