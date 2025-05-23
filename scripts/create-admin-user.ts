import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function createAdminUser(email: string, password: string) {
  try {
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error('Error creating user:', authError)
      return
    }

    if (!authData.user) {
      console.error('No user data returned')
      return
    }

    // Create the admin profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: email,
          role: 'admin'
        }
      ])

    if (profileError) {
      console.error('Error creating admin profile:', profileError)
      return
    }

    console.log('Admin user created successfully!')
    console.log('User ID:', authData.user.id)
    console.log('Email:', email)
    console.log('Role: admin')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Replace with your desired admin email and password
const adminEmail = 'aliaman11072003@mpgi.edu.in'
const adminPassword = 'your-secure-password' // Replace with a secure password

createAdminUser(adminEmail, adminPassword) 