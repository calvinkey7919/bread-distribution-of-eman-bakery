import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'

export default async function SalesmanDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role, full_name, assigned_route_id, routes!users_assigned_route_id_fkey (route_number, route_name)')
    .eq('id', user.id)
    .single()

  if (!userData || userData.role !== 'Salesman') {
    redirect('/auth/login')
  }

  // Get the route info properly (Supabase returns array for foreign key relations)
  const routeInfo = Array.isArray(userData.routes) ? userData.routes[0] : userData.routes

  // Check for pending acknowledgements
  const { data: pendingDeliveries } = await supabase
    .from('deliveries')
    .select(`
      id,
      orders!inner (id, salesman_id)
    `)
    .eq('orders.salesman_id', user.id)
    .eq('status', 'DISPATCHED')

  const hasPendingAck = (pendingDeliveries && pendingDeliveries.length > 0)

  // Get today's orders
  const today = new Date().toISOString().split('T')[0]
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('id, order_number, status, created_at')
    .eq('salesman_id', user.id)
    .eq('order_date', today)
    .order('created_at', { ascending: false })

  return (
    <DashboardLayout title="Salesman Dashboard" role="Salesman">
      {hasPendingAck && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have pending deliveries to acknowledge. 
                <Link href="/salesman/acknowledgements" className="font-medium underline ml-1">
                  View Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Assigned Route</div>
          <div className="text-2xl font-bold text-gray-900">
            {routeInfo ? `Route ${routeInfo.route_number}` : 'Not Assigned'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {routeInfo?.route_name}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Today's Orders</div>
          <div className="text-2xl font-bold text-blue-600">
            {todayOrders?.length || 0}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Pending Acknowledgements</div>
          <div className="text-2xl font-bold text-orange-600">
            {pendingDeliveries?.length || 0}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link 
              href="/salesman/orders/create" 
              className={`p-6 border-2 border-dashed rounded-lg hover:border-orange-500 hover:bg-orange-50 transition text-center ${hasPendingAck ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="text-orange-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="font-medium text-gray-900">Create New Order</div>
              {hasPendingAck && (
                <div className="text-xs text-red-600 mt-2">Acknowledge deliveries first</div>
              )}
            </Link>

            <Link href="/salesman/acknowledgements" className="p-6 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center">
              <div className="text-blue-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="font-medium text-gray-900">Acknowledge Deliveries</div>
            </Link>

            <Link href="/salesman/invoices" className="p-6 border-2 border-dashed rounded-lg hover:border-green-500 hover:bg-green-50 transition text-center">
              <div className="text-green-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="font-medium text-gray-900">Upload Invoice</div>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Today's Orders</h3>
        </div>
        <div className="divide-y">
          {todayOrders && todayOrders.length > 0 ? (
            todayOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">{order.order_number}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'CREATED' ? 'bg-gray-100 text-gray-800' :
                    order.status === 'DISPATCHED' ? 'bg-orange-100 text-orange-800' :
                    order.status === 'ACKNOWLEDGED' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                    order.status === 'INVOICED' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No orders created today
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
