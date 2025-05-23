'use client'

import { useState } from 'react'
import { testDatabaseConnection } from '@/lib/test-connection'
import { Button } from '@/components/ui/button'

export default function TestPage() {
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: any } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    try {
      const result = await testDatabaseConnection()
      setTestResult(result)
    } catch (error) {
      setTestResult({ success: false, error })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        
        <Button 
          onClick={runTests} 
          disabled={isLoading}
          className="mb-8"
        >
          {isLoading ? 'Running Tests...' : 'Run Tests'}
        </Button>

        {testResult && (
          <div className={`p-4 rounded-lg ${
            testResult.success ? 'bg-green-900' : 'bg-red-900'
          }`}>
            <h2 className="text-xl font-bold mb-2">
              {testResult.success ? '✅ Tests Passed' : '❌ Tests Failed'}
            </h2>
            {testResult.message && <p className="mb-2">{testResult.message}</p>}
            {testResult.error && (
              <pre className="bg-black p-4 rounded overflow-auto">
                {JSON.stringify(testResult.error, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 