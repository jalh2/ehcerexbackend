const HomeModel = require('../models/homeModel')

const getHome = async (req, res) => {
  try {
    const doc = await HomeModel.findOne()
    if (!doc) return res.json(HomeModel.defaults)
    res.json({ ...HomeModel.defaults, ...doc })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateHome = async (req, res) => {
  try {
    const payload = req.body
    const updateData = {}
    if (payload.logo !== undefined) updateData.logo = payload.logo
    if (payload.heroTitle !== undefined) updateData.heroTitle = payload.heroTitle
    if (payload.heroDescription !== undefined) updateData.heroDescription = payload.heroDescription
    if (payload.heroImage !== undefined) updateData.heroImage = payload.heroImage
    if (payload.bannerImage !== undefined) updateData.bannerImage = payload.bannerImage
    if (payload.title !== undefined) updateData.title = payload.title
    if (payload.description !== undefined) updateData.description = payload.description

    const doc = await HomeModel.upsert(updateData)
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getHome, updateHome }
