require('dotenv').config()
const { db } = require('../config')

const now = new Date().toISOString()

const services = [
  'Manufacturing',
  'Sales and Marketing',
  'Banking and Financial Services',
  'Telecommunications GSM and technologies',
  'Hospitality and tourism',
  'Aviation',
  'Transportation',
  'Commercial Agriculture',
  'Sports',
  'Construction and Architecture',
  'Educational institutions',
  'Consultancy',
  'Health facilities'
]

const seedContent = async () => {
  try {
    console.log('Seeding Ehcerex content data...\n')

    // --- Home Page ---
    console.log('Seeding Home Page...')
    await db.collection('homeContent').doc('main').set({
      heroTitle: 'Ehcerex Group of Companies',
      heroDescription: 'A diversified group of companies delivering excellence across industries.',
      heroImage: '',
      bannerImage: '',
      title: 'Welcome to Ehcerex',
      description: 'Ehcerex is a group of companies operating across manufacturing, financial services, telecommunications, hospitality, aviation, agriculture, education, health, and more.',
      createdAt: now,
      updatedAt: now
    })
    console.log('  Home Page seeded.')

    // --- About Page ---
    console.log('Seeding About Page...')
    await db.collection('aboutContent').doc('main').set({
      title: 'About Ehcerex',
      description: 'Ehcerex is a diversified group of companies with operations spanning multiple industries.',
      bannerImage: '',
      sections: [
        {
          key: 'about',
          title: 'About',
          description: '100% ownership Josephus Robert Johnson.',
          items: [],
          images: []
        },
        {
          key: 'mission',
          title: 'Mission',
          description: '',
          items: [],
          images: []
        },
        {
          key: 'vision',
          title: 'Vision',
          description: '',
          items: [],
          images: []
        },
        {
          key: 'services',
          title: 'Services',
          description: 'The industries and services covered by the Ehcerex group of companies.',
          items: services,
          images: []
        }
      ],
      createdAt: now,
      updatedAt: now
    })
    console.log('  About Page seeded.')

    // --- Companies (dropdown pages) ---
    console.log('Seeding Companies...')
    const companiesRef = db.collection('companies')

    const companies = [
      {
        slug: 'cera-business-enterprise',
        title: 'Cera Business Enterprise',
        description: '',
        services: [],
        images: [],
        bannerImage: '',
        menuLabel: 'Cera Business Enterprise',
        isPublished: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        slug: 'excel-forex-bureau',
        title: 'Excel Forex Bureau',
        description: '',
        services: [],
        images: [],
        bannerImage: '',
        menuLabel: 'Excel Forex Bureau',
        isPublished: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        slug: 'ehnuteh-sales-and-marketing-corporation',
        title: 'Ehnuteh Sales and Marketing Corporation',
        description: '',
        services: [],
        images: [],
        bannerImage: '',
        menuLabel: 'Ehnuteh Sales and Marketing Corporation',
        isPublished: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      }
    ]

    for (const company of companies) {
      const existing = await companiesRef.where('slug', '==', company.slug).limit(1).get()
      if (existing.empty) {
        await companiesRef.add(company)
      }
    }
    console.log(`  ${companies.length} companies seeded (skipping existing slugs).`)

    // --- Team Page ---
    console.log('Seeding Team Page...')
    await db.collection('teamContent').doc('main').set({
      title: 'Our Team',
      description: 'Meet the people behind Ehcerex.',
      bannerImage: '',
      members: [],
      createdAt: now,
      updatedAt: now
    })
    console.log('  Team Page seeded.')

    // --- Contact Page ---
    console.log('Seeding Contact Page...')
    await db.collection('contactPage').doc('main').set({
      title: 'Contact Us',
      description: 'Get in touch with Ehcerex. We would love to hear from you.',
      bannerImage: '',
      address: 'Directly opposite Jacob Town market, Paynesville Japan freeway.',
      email: 'josephusrj@gmail.com',
      phones: ['0777227888', '0886888227'],
      socialLinks: [],
      createdAt: now,
      updatedAt: now
    })
    console.log('  Contact Page seeded.')

    console.log('\n--- All content seeded successfully! ---')
    console.log('Admin login: username: admin, password: admin123')
    process.exit(0)
  } catch (e) {
    console.error('Seed error:', e)
    process.exit(1)
  }
}

seedContent()
