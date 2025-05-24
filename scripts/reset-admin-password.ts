import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function resetAdminPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password`,
    })

    if (error) {
      console.error('Error sending password reset email:', error)
      return
    }

    console.log('Password reset email sent successfully!')
    console.log('Please check your email for the password reset link.')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Replace with your admin email
const adminEmail = 'aliaman11072003@mpgi.edu.in'
resetAdminPassword(adminEmail) 