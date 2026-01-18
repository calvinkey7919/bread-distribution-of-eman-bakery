import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'

export default async function AccountantDashboard() {
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

  if (!userData || userData.role !== 'Accountant') {
    redirect('/auth/login')
  }

  // Get acknowledged deliveries pending verification
  const { data: pendingVerification } = await supabase
    .from('deliveries')
    .select(`
      id,
      dispatch_date,
      orders (
        id,
        order_number,
        routes (route_number, route_name),
        users (full_name)
      )
    `)
    .eq('status', 'ACKNOWLEDGED')
    .is('verifications.id', null)
    .order('dispatch_date', { ascending: true })

  // Get today's verified deliveries
  const today = new Date().toISOString().split('T')[0]
  const { data: todayVerified } = await supabase
    .from('verifications')
    .select('id')
    .gte('verified_at', today)

  return (
    <DashboardLayout title="Accountant Dashboard" role="Accountant">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Pending Verification</div>
          <div className="text-2xl font-bold text-orange-600">
            {pendingVerification?.length || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">Acknowledged deliveries</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Today's Verified</div>
          <div className="text-2xl font-bold text-green-600">
            {todayVerified?.length || 0}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Pending Verification</h3>
        </div>
        <div className="divide-y">
          {pendingVerification && pendingVerification.length > 0 ? (
            pendingVerification.map((delivery: any) => (
              <div key={delivery.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">
                      {delivery.orders?.order_number}
                    </div>
                    <div className="text-sm text-gray-600">
                      Route {delivery.orders?.routes?.route_number} - {delivery.orders?.routes?.route_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Salesman: {delivery.orders?.users?.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dispatched: {new Date(delivery.dispatch_date).toLocaleDateString()}
                    </div>
                  </div>
                  <Link
                    href={`/accountant/verify/${delivery.id}`}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm font-medium"
                  >
                    Verify
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No deliveries pending verification
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
