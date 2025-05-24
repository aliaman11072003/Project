import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function setupDatabase() {
  try {
    // Create profiles table
    const { error: profilesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        CONSTRAINT valid_role CHECK (role IN ('user', 'admin'))
      );

      -- Create RLS policies for profiles
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
    `)

    if (profilesError) {
      console.error('Error creating profiles table:', profilesError)
      return
    }

    // Create core_applications table
    const { error: applicationsError } = await supabase
      .from('core_applications')
      .select('*')
      .limit(1)
      .then(() => {
        console.log('Core applications table already exists')
        return { error: null }
      })
      .catch(async () => {
        return await supabase.query(`
          CREATE TABLE core_applications (
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
            reviewed_at TIMESTAMP WITH TIME ZONE,
            
            -- Add constraints
            CONSTRAINT valid_email CHECK (
              email ~* '^[A-Za-z0-9._%+-]+@(mpgi\\.edu\\.in|gmail\\.com)$'
            ),
            CONSTRAINT valid_status CHECK (
              status IN ('pending', 'approved', 'rejected')
            )
          );

          -- Create RLS policies for core_applications
          ALTER TABLE core_applications ENABLE ROW LEVEL SECURITY;

          -- Allow anyone to insert applications
          CREATE POLICY "Anyone can insert applications" ON core_applications
            FOR INSERT WITH CHECK (true);

          -- Allow users to view their own applications
          CREATE POLICY "Users can view own applications" ON core_applications
            FOR SELECT USING (email = auth.jwt()->>'email');

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
        `)
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