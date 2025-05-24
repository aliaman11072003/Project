import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupProductionAdmin() {
  try {
    // First, check if the user exists in auth
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('Error fetching users:', userError)
      return
    }

    const adminUser = users.find(u => u.email === 'aliaman11072003@mpgi.edu.in')
    if (!adminUser) {
      console.error('Admin user not found in auth.users')
      return
    }

    console.log('Found admin user:', adminUser.id)

    // Create or update the profiles table
    const { error: tableError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        CONSTRAINT valid_role CHECK (role IN ('user', 'admin'))
      );

      -- Enable RLS
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Users can view own profile" ON profiles
        FOR SELECT USING (auth.uid() = id);

      CREATE POLICY "Users can update own profile" ON profiles
        FOR UPDATE USING (auth.uid() = id);

      CREATE POLICY "Admins can view all profiles" ON profiles
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
          )
        );

      CREATE POLICY "Admins can update all profiles" ON profiles
        FOR UPDATE USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
          )
        );
    `)

    if (tableError) {
      console.error('Error creating/updating profiles table:', tableError)
      return
    }

    // Insert or update admin profile
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: adminUser.id,
        email: 'aliaman11072003@mpgi.edu.in',
        role: 'admin'
      }, {
        onConflict: 'id'
      })

    if (upsertError) {
      console.error('Error upserting admin profile:', upsertError)
      return
    }

    console.log('Admin setup completed successfully!')
    console.log('User ID:', adminUser.id)
    console.log('Email:', adminUser.email)
    console.log('Role: admin')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

setupProductionAdmin() 