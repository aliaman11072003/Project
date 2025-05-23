'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CoreApplication } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Search, Filter } from 'lucide-react'

export default function AdminDashboard() {
  const [applications, setApplications] = useState<CoreApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedApp, setSelectedApp] = useState<CoreApplication | null>(null)
  const [notes, setNotes] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setIsAuthenticated(!!session)
    if (session) {
      fetchApplications()
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
      setIsAuthenticated(true)
      fetchApplications()
    }
  }

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('core_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('core_applications')
        .update({ 
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.email
        })
        .eq('id', id)

      if (error) throw error
      fetchApplications()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const updateNotes = async (id: string) => {
    try {
      const { error } = await supabase
        .from('core_applications')
        .update({ notes })
        .eq('id', id)

      if (error) throw error
      setSelectedApp(null)
      setNotes('')
      fetchApplications()
    } catch (error) {
      console.error('Error updating notes:', error)
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Roll Number', 'Skills', 'Role', 'Status', 'Notes', 'Applied At']
    const csvData = applications.map(app => [
      app.name,
      app.email,
      app.roll_number,
      app.skills,
      app.role,
      app.status,
      app.notes || '',
      new Date(app.created_at).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `applications-${new Date().toISOString()}.csv`
    link.click()
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 text-white"
              />
            </div>
            <div>
              <label className="block mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 text-white"
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Applications Dashboard</h1>
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] bg-gray-800">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-gray-900 p-4 rounded-lg border border-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{app.name}</h3>
                    <p className="text-gray-400">{app.email}</p>
                    <p className="text-gray-400">Roll Number: {app.roll_number}</p>
                    <p className="text-gray-400">Skills: {app.skills}</p>
                    <p className="text-gray-400">Role: {app.role}</p>
                    <p className="text-gray-400">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateApplicationStatus(app.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={app.status === 'approved'}
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={app.status === 'rejected'}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedApp(app)
                        setNotes(app.notes || '')
                      }}
                      variant="outline"
                    >
                      Add Notes
                    </Button>
                  </div>
                </div>
                {app.notes && (
                  <div className="mt-4 p-2 bg-gray-800 rounded">
                    <p className="text-sm text-gray-300">{app.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">Add Notes for {selectedApp.name}</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-gray-800 text-white mb-4"
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setSelectedApp(null)
                    setNotes('')
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={() => updateNotes(selectedApp.id)}>
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 