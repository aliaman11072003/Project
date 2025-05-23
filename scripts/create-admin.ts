import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function createAdminProfile() {
  // Replace these with your actual admin user ID from Supabase
  const adminUserId = 'YOUR_ADMIN_USER_ID' // Get this from Supabase Auth > Users

  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: adminUserId,
        role: 'admin',
        email: 'your-email@example.com' // Replace with your email
      }
    ])

  if (error) {
    console.error('Error creating admin profile:', error)
  } else {
    console.log('Admin profile created successfully:', data)
  }
}

createAdminProfile() 