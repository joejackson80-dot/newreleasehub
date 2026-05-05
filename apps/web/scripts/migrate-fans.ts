import { createAdminClient } from '../src/lib/supabase/admin'

async function migrateFans() {
  const supabase = createAdminClient()

  console.log('🚀 Starting legacy fan migration (Supabase-only)...')

  // We look for users with role 'FAN' that haven't been linked to a Supabase Auth user yet
  const { data: fans, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'FAN')
    .is('supabase_user_id', null)

  if (error) {
    console.error('❌ Failed to fetch fans:', error)
    process.exit(1)
  }

  console.log(`📊 Found ${fans.length} fans to migrate.`)

  for (const fan of fans) {
    try {
      console.log(`🔄 Migrating: ${fan.email}...`)
      
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(fan.email)
      
      let authUser;
      if (existingUser?.user) {
        console.log(`ℹ️ Auth user already exists for ${fan.email}, linking...`)
        authUser = existingUser.user
      } else {
        const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
          email: fan.email,
          password: 'ChangeMe123!',
          user_metadata: { 
            role: 'fan', 
            legacy_user_id: fan.id,
            name: fan.name || fan.displayName || 'Legacy Fan'
          },
          email_confirm: true,
        })

        if (createError) {
          console.error(`❌ Failed to create auth user for ${fan.email}:`, createError.message)
          continue
        }
        authUser = newAuthUser.user
      }

      if (authUser) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ supabase_user_id: authUser.id })
          .eq('id', fan.id)

        if (updateError) {
          console.error(`❌ Failed to update fan ${fan.id} with supabase_user_id:`, updateError.message)
          continue
        }

        console.log(`✅ Successfully migrated ${fan.email} (Supabase ID: ${authUser.id})`)
      }
    } catch (err) {
      console.error(`💥 Unexpected error for ${fan.email}:`, err)
    }
  }

  console.log('🏁 Fan migration process complete.')
}

migrateFans()
