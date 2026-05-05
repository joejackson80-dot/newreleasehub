import { PrismaClient } from '@prisma/client'
import { createAdminClient } from '../src/lib/supabase/admin'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from the web app's .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function migrateOrganizations() {
  const prisma = new PrismaClient()
  const adminClient = createAdminClient()

  console.log('🚀 Starting legacy organization migration...')

  try {
    const organizations = await prisma.organization.findMany()
    console.log(`📊 Found ${organizations.length} organizations to migrate.`)

    for (const org of organizations) {
      console.log(`🔄 Migrating: ${org.email}...`)
      
      const { data, error } = await adminClient.auth.admin.createUser({
        email: org.email,
        password: 'ChangeMe123!', // Legacy users will need to reset their password
        user_metadata: { 
          role: 'artist', 
          legacy_org_id: org.id,
          name: org.name 
        },
        email_confirm: true,
      })

      if (error) {
        console.error(`❌ Failed to migrate ${org.email}: ${error.message}`)
        continue
      }

      if (data.user) {
        // Here we would update the Prisma record if the supabase_user_id column existed
        // For now, we'll just log the success
        console.log(`✅ Successfully migrated ${org.email} (Supabase ID: ${data.user.id})`)
      }
    }

    console.log('🏁 Migration process complete.')
  } catch (err) {
    console.error('💥 Critical migration error:', err)
  } finally {
    await prisma.$disconnect()
  }
}

migrateOrganizations()
