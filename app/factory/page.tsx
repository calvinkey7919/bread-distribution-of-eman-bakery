import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'

export default async function FactoryDashboard() {
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

  if (!userData || userData.role !== 'Factory') {
    redirect('/auth/login')
  }

  // Get pending orders (CREATED status)
  const today = new Date().toISOString().split('T')[0]
  const { data: pendingOrders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      routes (route_number, route_name),
      users (full_name)
    `)
    .eq('status', 'CREATED')
    .order('created_at', { ascending: true })

  // Get today's dispatched deliveries
  const { data: todayDispatched } = await supabase
    .from('deliveries')
    .select('id')
    .eq('dispatch_date', today)

  return (
    <DashboardLayout title="Factory Dashboard" role="Factory">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Pending Orders</div>
          <div className="text-2xl font-bold text-orange-600">
            {pendingOrders?.length || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">Waiting for dispatch</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Today's Dispatches</div>
          <div className="text-2xl font-bold text-green-600">
            {todayDispatched?.length || 0}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Pending Orders for Dispatch</h3>
        </div>
        <div className="divide-y">
          {pendingOrders && pendingOrders.length > 0 ? (
            pendingOrders.map((order: any) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">{order.order_number}</div>
                    <div className="text-sm text-gray-600">
                      Route {order.routes?.route_number} - {order.routes?.route_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Salesman: {order.users?.full_name}
                    </div>
                  </div>
                  <Link
                    href={`/factory/dispatch/${order.id}`}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition text-sm font-medium"
                  >
                    Dispatch
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No pending orders for dispatch
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
