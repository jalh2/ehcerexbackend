const CompanyModel = require('../models/companyModel')

const listCompanies = async (req, res) => {
  try {
    const publishedOnly = !req.session || !req.session.user
    const companies = await CompanyModel.findAll(publishedOnly)
    res.json(companies)
  } catch (e) {
    console.error('listCompanies error:', e)
    res.status(500).json({ message: 'Server error' })
  }
}

const getCompany = async (req, res) => {
  try {
    const doc = await CompanyModel.findByIdOrSlug(req.params.idOrSlug)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json(doc)
  } catch (e) {
    console.error('getCompany error:', e)
    res.status(500).json({ message: 'Server error', error: e.message })
  }
}

const createCompany = async (req, res) => {
  try {
    const { slug, title, description, services, images, bannerImage, logo, email, phone, additionalInfo, menuLabel, isPublished, sortOrder } = req.body
    if (!title) return res.status(400).json({ message: 'Title is required' })
    if (!slug) return res.status(400).json({ message: 'Slug is required' })

    const existing = await CompanyModel.findBySlug(slug)
    if (existing) return res.status(400).json({ message: 'Slug already exists' })

    const doc = await CompanyModel.create({
      slug,
      title,
      description: description || '',
      services: Array.isArray(services) ? services : [],
      images: Array.isArray(images) ? images : [],
      bannerImage: bannerImage || '',
      logo: logo || '',
      email: email || '',
      phone: phone || '',
      additionalInfo: additionalInfo || '',
      menuLabel: menuLabel || title,
      isPublished: isPublished !== undefined ? isPublished : true,
      sortOrder: sortOrder || 0
    })
    res.status(201).json(doc)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateCompany = async (req, res) => {
  try {
    const existing = await CompanyModel.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Company not found' })

    const { slug, title, description, services, images, bannerImage, logo, email, phone, additionalInfo, menuLabel, isPublished, sortOrder } = req.body
    const updateData = {}
    if (slug !== undefined) {
      const slugCheck = await CompanyModel.findBySlug(slug)
      if (slugCheck && slugCheck.id !== req.params.id) return res.status(400).json({ message: 'Slug already exists' })
      updateData.slug = slug
    }
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (services !== undefined) updateData.services = services
    if (images !== undefined) updateData.images = images
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage
    if (logo !== undefined) updateData.logo = logo
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (additionalInfo !== undefined) updateData.additionalInfo = additionalInfo
    if (menuLabel !== undefined) updateData.menuLabel = menuLabel
    if (isPublished !== undefined) updateData.isPublished = isPublished
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder

    const doc = await CompanyModel.update(req.params.id, updateData)
    res.json({ message: 'Company updated successfully', company: doc })
  } catch (e) {
    console.error('updateCompany error:', e)
    res.status(500).json({ message: 'Failed to update company', error: e.message })
  }
}

const deleteCompany = async (req, res) => {
  try {
    const existing = await CompanyModel.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Not found' })
    await CompanyModel.remove(req.params.id)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteCompanyImage = async (req, res) => {
  try {
    const { id, idx } = req.params
    const doc = await CompanyModel.findById(id)
    if (!doc) return res.status(404).json({ message: 'Company not found' })
    const images = Array.isArray(doc.images) ? [...doc.images] : []
    const index = parseInt(idx, 10)
    if (index < 0 || index >= images.length) return res.status(400).json({ message: 'Invalid image index' })
    images.splice(index, 1)
    const updated = await CompanyModel.update(id, { images })
    res.json({ message: 'Image deleted successfully', company: updated })
  } catch (e) {
    console.error('deleteCompanyImage error:', e)
    res.status(500).json({ message: 'Failed to delete image' })
  }
}

module.exports = { listCompanies, getCompany, createCompany, updateCompany, deleteCompany, deleteCompanyImage }
