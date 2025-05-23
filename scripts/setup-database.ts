import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function setupDatabase() {
  try {
    // Create profiles table if it doesn't exist
    const { error: profilesError } = await supabase.rpc('create_profiles_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );

        -- Create RLS policies
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

        -- Allow users to read their own profile
        CREATE POLICY "Users can view own profile" ON profiles
          FOR SELECT USING (auth.uid() = id);

        -- Allow users to update their own profile
        CREATE POLICY "Users can update own profile" ON profiles
          FOR UPDATE USING (auth.uid() = id);

        -- Allow admins to read all profiles
        CREATE POLICY "Admins can view all profiles" ON profiles
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE id = auth.uid() AND role = 'admin'
            )
          );

        -- Allow admins to update all profiles
        CREATE POLICY "Admins can update all profiles" ON profiles
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE id = auth.uid() AND role = 'admin'
            )
          );
      `
    })

    if (profilesError) {
      console.error('Error creating profiles table:', profilesError)
      return
    }

    // Create core_applications table if it doesn't exist
    const { error: applicationsError } = await supabase.rpc('create_applications_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS core_applications (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          roll_number TEXT NOT NULL,
          skills TEXT NOT NULL,
          github_link TEXT,
          reason TEXT NOT NULL,
          role TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          notes TEXT,
          reviewed_by TEXT,
          reviewed_at TIMESTAMP WITH TIME ZONE
        );

        -- Create RLS policies
        ALTER TABLE core_applications ENABLE ROW LEVEL SECURITY;

        -- Allow anyone to insert applications
        CREATE POLICY "Anyone can insert applications" ON core_applications
          FOR INSERT WITH CHECK (true);

        -- Allow admins to view all applications
        CREATE POLICY "Admins can view all applications" ON core_applications
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE id = auth.uid() AND role = 'admin'
            )
          );

        -- Allow admins to update all applications
        CREATE POLICY "Admins can update all applications" ON core_applications
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE id = auth.uid() AND role = 'admin'
            )
          );
      `
    })

    if (applicationsError) {
      console.error('Error creating applications table:', applicationsError)
      return
    }

    console.log('Database setup completed successfully!')
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

setupDatabase() 