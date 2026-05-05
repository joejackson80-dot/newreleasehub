import { createAdminClient } from '../src/lib/supabase/admin'

async function migrateOrganizations() {
  const supabase = createAdminClient()

  console.log('🚀 Starting legacy organization migration (Supabase-only)...')

  const { data: organizations, error } = await supabase
    .from('organizations')
    .select('*')
    // We only migrate those that haven't been linked to a Supabase Auth user yet
    // Assuming we added a supabase_user_id column or similar
    // If not, we can use email as the check
    .is('supabase_user_id', null)

  if (error) {
    console.error('❌ Failed to fetch organizations:', error)
    process.exit(1)
  }

  console.log(`📊 Found ${organizations.length} organizations to migrate.`)

  for (const org of organizations) {
    try {
      console.log(`🔄 Migrating: ${org.email}...`)
      
      // Check if auth user already exists for this email
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(org.email)
      
      let authUser;
      if (existingUser?.user) {
        console.log(`ℹ️ Auth user already exists for ${org.email}, linking...`)
        authUser = existingUser.user
      } else {
        const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
          email: org.email,
          password: 'ChangeMe123!', // Users will need to reset
          user_metadata: { 
            role: 'artist', 
            legacy_org_id: org.id,
            name: org.name 
          },
          email_confirm: true,
        })

        if (createError) {
          console.error(`❌ Failed to create auth user for ${org.email}:`, createError.message)
          continue
        }
        authUser = newAuthUser.user
      }

      if (authUser) {
        const { error: updateError } = await supabase
          .from('organizations')
          .update({ supabase_user_id: authUser.id })
          .eq('id', org.id)

        if (updateError) {
          console.error(`❌ Failed to update org ${org.id} with supabase_user_id:`, updateError.message)
          continue
        }

        console.log(`✅ Successfully migrated ${org.email} (Supabase ID: ${authUser.id})`)
      }
    } catch (err) {
      console.error(`💥 Unexpected error for ${org.email}:`, err)
    }
  }

  console.log('🏁 Migration process complete.')
}

migrateOrganizations()
