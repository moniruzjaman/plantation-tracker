import { PrismaClient } from '@prisma/client'

// Singleton pattern for Vercel serverless — reuses the client across warm invocations
// to avoid exhausting database connections on repeated cold starts.
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// GET /api/plantations — list all (latest first, max 200)
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method === 'GET') {
    try {
      const data = await prisma.plantation.findMany({
        orderBy: { submittedAt: 'desc' },
        take: 200,
        include: { seedlings: true },
      })
      return res.status(200).json(data)
    } catch (err) {
      console.error('GET /api/plantations error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        slNo, district, upazila, union, village, block,
        geo, address, date, ndvi, remarks,
        caretakerName, caretakerMobile,
        saaoName, saaoMobile, officerName, officerMobile,
        seedlings
      } = req.body

      const plantation = await prisma.plantation.create({
        data: {
          slNo: slNo || 1,
          district,
          upazila,
          union,
          village,
          block: block || null,
          geo: geo || null,
          address: address || null,
          date,
          ndvi: ndvi || null,
          remarks: remarks || null,
          caretakerName,
          caretakerMobile,
          saaoName: saaoName || null,
          saaoMobile: saaoMobile || null,
          officerName: officerName || null,
          officerMobile: officerMobile || null,
          seedlings: {
            create: (seedlings || []).map(s => ({
              name: s.name,
              category: s.category || 'অন্যান্য',
              count: s.count,
            })),
          },
        },
        include: { seedlings: true },
      })

      return res.status(201).json(plantation)
    } catch (err) {
      console.error('POST /api/plantations error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // DELETE single entry
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id required' })
      await prisma.seedling.deleteMany({ where: { plantationId: parseInt(id) } })
      await prisma.plantation.delete({ where: { id: parseInt(id) } })
      return res.status(200).json({ deleted: true })
    } catch (err) {
      console.error('DELETE /api/plantations error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}