require('dotenv').config()
const { db } = require('../config')
const { hashPassword } = require('../utils/encryption')

const seedSuperAdmin = async () => {
  try {
    const usersRef = db.collection('users')
    const snapshot = await usersRef.where('role', '==', 'superAdmin').limit(1).get()

    if (!snapshot.empty) {
      console.log('Super Admin already exists. Skipping seed.')
      process.exit(0)
    }

    const now = new Date().toISOString()
    const adminData = {
      username: 'admin',
      password: hashPassword('admin123'),
      role: 'superAdmin',
      isActive: true,
      createdAt: now,
      updatedAt: now
    }

    const ref = await usersRef.add(adminData)
    console.log(`Super Admin seeded successfully. ID: ${ref.id}`)
    console.log('Username: admin')
    console.log('Password: admin123')
    console.log('** Change this password immediately in production **')
    process.exit(0)
  } catch (e) {
    console.error('Seed error:', e)
    process.exit(1)
  }
}

seedSuperAdmin()
