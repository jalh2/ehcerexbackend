const { db } = require('../config')

// --- Contact Page (singleton) ---
const pageCollection = db.collection('contactPage')
const PAGE_DOC_ID = 'main'

const pageDefaults = {
  title: '',
  description: '',
  bannerImage: '',
  address: '',
  email: '',
  phones: [],
  socialLinks: [],
  createdAt: null,
  updatedAt: null
}

const findPage = async () => {
  const doc = await pageCollection.doc(PAGE_DOC_ID).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() }
}

const upsertPage = async (data) => {
  const now = new Date().toISOString()
  const existing = await findPage()
  if (existing) {
    await pageCollection.doc(PAGE_DOC_ID).update({ ...data, updatedAt: now })
  } else {
    const docData = { ...pageDefaults, ...data, createdAt: now, updatedAt: now }
    await pageCollection.doc(PAGE_DOC_ID).set(docData)
  }
  return findPage()
}

// --- Contact Messages ---
const messageCollection = db.collection('contactMessages')

const messageDefaults = {
  name: '',
  email: '',
  subject: '',
  message: '',
  createdAt: null
}

const createMessage = async (data) => {
  const now = new Date().toISOString()
  const docData = { ...messageDefaults, ...data, createdAt: now }
  const ref = await messageCollection.add(docData)
  return { id: ref.id, ...docData }
}

const findAllMessages = async () => {
  const snapshot = await messageCollection.orderBy('createdAt', 'desc').get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

module.exports = {
  pageCollection, pageDefaults, findPage, upsertPage, PAGE_DOC_ID,
  messageCollection, messageDefaults, createMessage, findAllMessages
}
