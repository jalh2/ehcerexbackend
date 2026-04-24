const AboutModel = require('../models/aboutModel')

const getAbout = async (req, res) => {
  try {
    const doc = await AboutModel.findOne()
    if (!doc) return res.json(AboutModel.defaults)
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateAbout = async (req, res) => {
  try {
    const payload = req.body
    const updateData = {}
    if (payload.title !== undefined) updateData.title = payload.title
    if (payload.description !== undefined) updateData.description = payload.description
    if (payload.bannerImage !== undefined) updateData.bannerImage = payload.bannerImage
    if (payload.sections !== undefined) updateData.sections = payload.sections

    const doc = await AboutModel.upsert(updateData)
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const createSection = async (req, res) => {
  try {
    const existing = await AboutModel.findOne()
    const sections = existing ? [...(existing.sections || [])] : []
    const { key, title, description, items, images } = req.body

    if (!key) return res.status(400).json({ message: 'Section key is required' })
    if (sections.find(s => s.key === key)) return res.status(400).json({ message: 'Section key already exists' })

    sections.push({
      key,
      title: title || '',
      description: description || '',
      items: Array.isArray(items) ? items : [],
      images: Array.isArray(images) ? images : []
    })

    const doc = await AboutModel.upsert({ sections })
    res.status(201).json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateSection = async (req, res) => {
  try {
    const { key } = req.params
    const existing = await AboutModel.findOne()
    if (!existing) return res.status(404).json({ message: 'About content not found' })

    const sections = [...(existing.sections || [])]
    const idx = sections.findIndex(s => s.key === key)
    if (idx === -1) return res.status(404).json({ message: 'Section not found' })

    const payload = req.body
    if (payload.title !== undefined) sections[idx].title = payload.title
    if (payload.description !== undefined) sections[idx].description = payload.description
    if (payload.items !== undefined) sections[idx].items = payload.items
    if (payload.images !== undefined) sections[idx].images = payload.images

    const doc = await AboutModel.upsert({ sections })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteSection = async (req, res) => {
  try {
    const { key } = req.params
    const existing = await AboutModel.findOne()
    if (!existing) return res.status(404).json({ message: 'About content not found' })

    const sections = (existing.sections || []).filter(s => s.key !== key)
    await AboutModel.upsert({ sections })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getAbout, updateAbout, createSection, updateSection, deleteSection }
