import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import UserList from './UserList'
import CreateUserForm from './CreateUserForm'

export default async function UserManagementPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData || userData.role !== 'Admin') {
    redirect('/auth/login')
  }

  const { data: users } = await supabase
    .from('users')
    .select(`
      id,
      full_name,
      email,
      role,
      is_active,
      created_at,
      routes (
        route_number,
        route_name
      )
    `)
    .order('created_at', { ascending: false })

  const { data: routes } = await supabase
    .from('routes')
    .select('id, route_number, route_name')
    .eq('is_active', true)
    .order('route_number')

  return (
    <DashboardLayout title="User Management" role="Admin">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserList users={users || []} />
        </div>
        <div>
          <CreateUserForm routes={routes || []} />
        </div>
      </div>
    </DashboardLayout>
  )
}
