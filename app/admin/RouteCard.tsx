'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

interface RouteCardProps {
  route: {
    id: string
    route_number: number
    route_name: string
    users: any
  }
}

export default function RouteCard({ route }: RouteCardProps) {
  const [stats, setStats] = useState({
    orders: 0,
    dispatched: 0,
    acknowledged: 0,
    verified: 0,
    invoiced: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: orders } = await supabase
      .from('orders')
      .select('id, status')
      .eq('route_id', route.id)
      .eq('order_date', today)

    if (orders) {
      setStats({
        orders: orders.length,
        dispatched: orders.filter(o => ['DISPATCHED', 'ACKNOWLEDGED', 'VERIFIED', 'INVOICED'].includes(o.status)).length,
        acknowledged: orders.filter(o => ['ACKNOWLEDGED', 'VERIFIED', 'INVOICED'].includes(o.status)).length,
        verified: orders.filter(o => ['VERIFIED', 'INVOICED'].includes(o.status)).length,
        invoiced: orders.filter(o => o.status === 'INVOICED').length,
      })
    }
  }

  const getStatusColor = () => {
    if (stats.invoiced === stats.orders && stats.orders > 0) return 'bg-green-100 border-green-300'
    if (stats.verified > 0) return 'bg-blue-100 border-blue-300'
    if (stats.acknowledged > 0) return 'bg-yellow-100 border-yellow-300'
    if (stats.dispatched > 0) return 'bg-orange-100 border-orange-300'
    return 'bg-gray-100 border-gray-300'
  }

  const salesman = Array.isArray(route.users) ? route.users[0] : route.users

  return (
    <Link href={`/admin/routes/${route.id}`}>
      <div className={`border-2 rounded-lg p-4 cursor-pointer hover:shadow-lg transition ${getStatusColor()}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-800">Route {route.route_number}</h3>
            <p className="text-sm text-gray-600">{route.route_name}</p>
          </div>
          <div className="bg-white px-2 py-1 rounded text-xs font-medium">
            {stats.orders} orders
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Salesman</p>
          <p className="text-sm font-medium text-gray-800">
            {salesman?.full_name || 'Not Assigned'}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Created</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${stats.orders > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>{stats.orders}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Dispatched</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${stats.dispatched > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>{stats.dispatched}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Acknowledged</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${stats.acknowledged > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>{stats.acknowledged}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Verified</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${stats.verified > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>{stats.verified}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Invoiced</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${stats.invoiced > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span>{stats.invoiced}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
