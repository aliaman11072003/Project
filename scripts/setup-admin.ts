import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function setupAdmin(email: string) {
  try {
    // First, get the user ID from auth
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('Error fetching users:', userError)
      return
    }

    const user = users.find(u => u.email === email)
    if (!user) {
      console.error('User not found with email:', email)
      return
    }

    // Check if profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking profile:', profileError)
      return
    }

    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        return
      }
      console.log('Updated existing profile to admin role')
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: email,
            role: 'admin'
          }
        ])

      if (insertError) {
        console.error('Error creating profile:', insertError)
        return
      }
      console.log('Created new admin profile')
    }

    console.log('Admin setup completed successfully!')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Replace with your email
const adminEmail = 'aliaman11072003@mpgi.edu.in'
setupAdmin(adminEmail) 