const TeamModel = require('../models/teamModel')

const getTeam = async (req, res) => {
  try {
    const doc = await TeamModel.findOne()
    if (!doc) return res.json(TeamModel.defaults)
    res.json(doc)
  } catch (e) {
    console.error('getTeam error:', e)
    res.status(500).json({ message: 'Server error', error: e.message })
  }
}

const updateTeam = async (req, res) => {
  try {
    const payload = req.body
    const updateData = {}
    if (payload.title !== undefined) updateData.title = payload.title
    if (payload.description !== undefined) updateData.description = payload.description
    if (payload.bannerImage !== undefined) updateData.bannerImage = payload.bannerImage
    if (payload.members !== undefined) updateData.members = payload.members

    const doc = await TeamModel.upsert(updateData)
    res.json(doc)
  } catch (e) {
    console.error('updateTeam error:', e)
    res.status(500).json({ message: 'Server error', error: e.message })
  }
}

module.exports = { getTeam, updateTeam }
