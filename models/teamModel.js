const { db } = require('../config')

const collection = db.collection('teamContent')
const DOC_ID = 'main'

const defaults = {
  title: 'Our Team',
  description: '',
  bannerImage: '',
  members: [],
  createdAt: null,
  updatedAt: null
}

const findOne = async () => {
  const doc = await collection.doc(DOC_ID).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() }
}

const upsert = async (data) => {
  const now = new Date().toISOString()
  const existing = await findOne()
  if (existing) {
    await collection.doc(DOC_ID).update({ ...data, updatedAt: now })
  } else {
    const docData = { ...defaults, ...data, createdAt: now, updatedAt: now }
    await collection.doc(DOC_ID).set(docData)
  }
  return findOne()
}

module.exports = { collection, defaults, findOne, upsert, DOC_ID }
