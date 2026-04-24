const express = require('express')
const router = express.Router()
const { login, logout, getMe, createUser, listUsers, updateUser, deleteUser } = require('../controllers/userController')
const { requireAuth, requireRole } = require('../middleware/auth')

// Public
router.post('/login', login)

// Authenticated
router.post('/logout', requireAuth, logout)
router.get('/me', requireAuth, getMe)

// Super Admin only
router.post('/', requireAuth, requireRole(['superAdmin']), createUser)
router.get('/', requireAuth, requireRole(['superAdmin']), listUsers)
router.put('/:id', requireAuth, requireRole(['superAdmin']), updateUser)
router.delete('/:id', requireAuth, requireRole(['superAdmin']), deleteUser)

module.exports = router
