const UserModel = require('../models/userModel')
const { hashPassword, comparePassword } = require('../utils/encryption')

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' })

    const user = await UserModel.findOne('username', username)
    if (!user || !user.isActive) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = comparePassword(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    req.session.user = { id: user.id, username: user.username, role: user.role }
    res.json({ id: user.id, username: user.username, role: user.role })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const logout = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.json({ success: true })
    })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const getMe = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'Not logged in' })
    }
    const user = await UserModel.findById(req.session.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const { password, ...safeUser } = user
    res.json(safeUser)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' })

    const existing = await UserModel.findOne('username', username)
    if (existing) return res.status(400).json({ message: 'Username already exists' })

    const hashed = hashPassword(password)
    const user = await UserModel.create({
      username,
      password: hashed,
      role: role || 'admin',
      isActive: true
    })
    const { password: _, ...safeUser } = user
    res.status(201).json(safeUser)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const listUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll()
    const safeUsers = users.map(({ password, ...rest }) => rest)
    res.json(safeUsers)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { username, password, role, isActive } = req.body
    const updateData = {}
    if (username !== undefined) updateData.username = username
    if (password) updateData.password = hashPassword(password)
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive

    const user = await UserModel.update(id, updateData)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const { password: _, ...safeUser } = user
    res.json(safeUser)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    await UserModel.remove(req.params.id)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { login, logout, getMe, createUser, listUsers, updateUser, deleteUser }
