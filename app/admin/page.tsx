import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import RouteCard from './RouteCard'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Verify admin role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData || userData.role !== 'Admin') {
    redirect('/auth/login')
  }

  // Fetch all routes with their salesmen and today's stats
  const { data: routes } = await supabase
    .from('routes')
    .select(`
      id,
      route_number,
      route_name,
      users!users_assigned_route_id_fkey (
        id,
        full_name
      )
    `)
    .eq('is_active', true)
    .order('route_number')

  return (
    <DashboardLayout title="Owner Dashboard" role="Admin">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {routes?.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">10</div>
            <div className="text-sm text-gray-600">Active Routes</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Today's Orders</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-gray-600">Pending Deliveries</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Invoices Uploaded</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
