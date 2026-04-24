const { db } = require('../config')

const collection = db.collection('companies')

const defaults = {
  slug: '',
  title: '',
  description: '',
  services: [],
  images: [],
  bannerImage: '',
  logo: '',
  email: '',
  phone: '',
  additionalInfo: '',
  menuLabel: '',
  isPublished: true,
  sortOrder: 0,
  createdAt: null,
  updatedAt: null
}

const create = async (data) => {
  const now = new Date().toISOString()
  const docData = { ...defaults, ...data, createdAt: now, updatedAt: now }
  if (!docData.menuLabel) docData.menuLabel = docData.title
  const ref = await collection.add(docData)
  return { id: ref.id, ...docData }
}

const findById = async (id) => {
  const doc = await collection.doc(id).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() }
}

const findBySlug = async (slug) => {
  const snapshot = await collection.where('slug', '==', slug).limit(1).get()
  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() }
}

const findByIdOrSlug = async (idOrSlug) => {
  const byId = await findById(idOrSlug)
  if (byId) return byId
  return findBySlug(idOrSlug)
}

const update = async (id, data) => {
  const now = new Date().toISOString()
  await collection.doc(id).update({ ...data, updatedAt: now })
  return findById(id)
}

const remove = async (id) => {
  await collection.doc(id).delete()
  return { success: true }
}

const findAll = async (publishedOnly = false) => {
  const snapshot = await collection.get()
  const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  const filteredDocs = publishedOnly
    ? docs.filter(doc => doc.isPublished === true)
    : docs
  return filteredDocs.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
}

module.exports = { collection, defaults, create, findById, findBySlug, findByIdOrSlug, update, remove, findAll }
