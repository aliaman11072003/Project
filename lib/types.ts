export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface CoreApplication {
  id: string
  created_at: string
  name: string
  email: string
  roll_number: string
  skills: string
  github_link?: string
  reason: string
  role: string
  status: ApplicationStatus
  notes?: string
  reviewed_by?: string
  reviewed_at?: string
} 