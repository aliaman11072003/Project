"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search } from "lucide-react"
import { CoreApplication } from "@/lib/types"

export default function AdminDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState<CoreApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<CoreApplication[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/admin/login')
        return
      }

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        router.push('/')
        return
      }

      // If authenticated and authorized, fetch applications
      fetchApplications()
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/admin/login')
    }
  }

  useEffect(() => {
    filterApplications()
  }, [searchTerm, statusFilter, applications])

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('core_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setApplications(data || [])
      setFilteredApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      setError("Failed to load applications")
    } finally {
      setIsLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.roll_number.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('core_applications')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        )
      )
    } catch (error) {
      console.error('Error updating status:', error)
      setError("Failed to update application status")
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Roll Number', 'Skills', 'GitHub Link', 'Reason', 'Role', 'Status', 'Applied At']
    const csvData = filteredApplications.map(app => [
      app.name,
      app.email,
      app.roll_number,
      app.skills,
      app.github_link || '',
      app.reason,
      app.role,
      app.status,
      new Date(app.created_at).toLocaleString()
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Loading applications...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Core Member Applications</h1>
          <Button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, email, or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">{app.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{app.roll_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{app.role.replace(/-/g, ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${app.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        value={app.status}
                        onValueChange={(value) => handleStatusChange(app.id, value)}
                      >
                        <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No applications found
          </div>
        )}
      </div>
    </div>
  )
} 