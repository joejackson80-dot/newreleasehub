import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function testLogin() {
  const identifier = 'iamjoejack'
  const password = 'Password123'

  const artist = await prisma.organization.findFirst({
    where: {
      OR: [
        { username: { equals: identifier, mode: 'insensitive' } },
        { email: { equals: identifier, mode: 'insensitive' } }
      ]
    }
  });

  if (!artist) {
    console.log('❌ Artist not found')
    return
  }

  console.log('✅ Artist found:', artist.username)
  
  const isValid = await bcrypt.compare(password, artist.passwordHash!)
  if (isValid) {
    console.log('✅ Password is valid')
  } else {
    console.log('❌ Password is INVALID')
  }
}

testLogin()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
