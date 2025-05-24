import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Replace with your admin email and password
const adminEmail = 'aliaman11072003@mpgi.edu.in'
const adminPassword = 'aman2003' // Replace with a secure password

// First create the user in auth
async function createAdminUser(email, password) {
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

    // Create the admin profile with the specific user ID
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: '7dcefd35-afd1-4730-bfdf-50701b282d38', // Your specific user ID
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

createAdminUser(adminEmail, adminPassword) 