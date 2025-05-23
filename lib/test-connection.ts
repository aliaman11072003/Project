import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    // Test 1: Basic Connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('core_applications')
      .select('count')
      .limit(1)

    if (connectionError) throw connectionError
    console.log('✅ Database connection successful')

    // Test 2: Insert Test Data
    const testApplication = {
      name: 'Test User',
      email: 'test@mpgi.edu.in',
      roll_number: 'TEST123',
      skills: 'JavaScript, React',
      github_link: 'https://github.com/test',
      reason: 'Testing the application system',
      role: 'developer'
    }

    const { data: insertData, error: insertError } = await supabase
      .from('core_applications')
      .insert([testApplication])
      .select()

    if (insertError) throw insertError
    console.log('✅ Test data insertion successful')

    // Test 3: Query Test Data
    const { data: queryData, error: queryError } = await supabase
      .from('core_applications')
      .select('*')
      .eq('email', 'test@mpgi.edu.in')
      .single()

    if (queryError) throw queryError
    console.log('✅ Data query successful')

    // Test 4: Clean up test data
    const { error: deleteError } = await supabase
      .from('core_applications')
      .delete()
      .eq('email', 'test@mpgi.edu.in')

    if (deleteError) throw deleteError
    console.log('✅ Test data cleanup successful')

    return { success: true, message: 'All tests passed!' }
  } catch (error) {
    console.error('❌ Test failed:', error)
    return { success: false, error }
  }
} 