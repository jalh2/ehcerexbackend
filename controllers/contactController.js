const ContactModel = require('../models/contactModel')

const getPage = async (req, res) => {
  try {
    const doc = await ContactModel.findPage()
    if (!doc) return res.json(ContactModel.pageDefaults)
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updatePage = async (req, res) => {
  try {
    const payload = req.body
    const updateData = {}
    if (payload.title !== undefined) updateData.title = payload.title
    if (payload.description !== undefined) updateData.description = payload.description
    if (payload.bannerImage !== undefined) updateData.bannerImage = payload.bannerImage
    if (payload.address !== undefined) updateData.address = payload.address
    if (payload.email !== undefined) updateData.email = payload.email
    if (payload.phones !== undefined) updateData.phones = payload.phones
    if (payload.socialLinks !== undefined) updateData.socialLinks = payload.socialLinks

    const doc = await ContactModel.upsertPage(updateData)
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' })
    const doc = await ContactModel.createMessage({ name, email, subject: subject || '', message })
    res.status(201).json({ id: doc.id })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const listMessages = async (req, res) => {
  try {
    const items = await ContactModel.findAllMessages()
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getPage, updatePage, createMessage, listMessages }
