const express = require('express')
const router = express.Router()
const { getPage, updatePage, createMessage, listMessages } = require('../controllers/contactController')
const { requireAuth, requireRole } = require('../middleware/auth')

router.get('/', getPage)
router.put('/', requireAuth, requireRole(['superAdmin', 'admin']), updatePage)

// Messages
router.post('/messages', createMessage)
router.get('/messages', requireAuth, requireRole(['superAdmin', 'admin']), listMessages)

module.exports = router
