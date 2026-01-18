'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title: string
  role: string
}

export default function DashboardLayout({ children, title, role }: LayoutProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const navItems = {
    Admin: [
      { name: 'Dashboard', path: '/admin' },
      { name: 'User Management', path: '/admin/users' },
      { name: 'Routes', path: '/admin/routes' },
      { name: 'Reports', path: '/admin/reports' },
      { name: 'Daily Closing', path: '/admin/closing' },
    ],
    Salesman: [
      { name: 'Dashboard', path: '/salesman' },
      { name: 'Create Order', path: '/salesman/orders/create' },
      { name: 'My Orders', path: '/salesman/orders' },
      { name: 'Acknowledgements', path: '/salesman/acknowledgements' },
      { name: 'Upload Invoice', path: '/salesman/invoices' },
    ],
    Factory: [
      { name: 'Dashboard', path: '/factory' },
      { name: 'Pending Orders', path: '/factory/orders' },
      { name: 'Dispatch History', path: '/factory/history' },
    ],
    Accountant: [
      { name: 'Dashboard', path: '/accountant' },
      { name: 'Verify Deliveries', path: '/accountant/verify' },
      { name: 'Verified History', path: '/accountant/history' },
    ],
  }

  const currentNavItems = navItems[role as keyof typeof navItems] || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-orange-600">Eman Bakery</h1>
              <p className="text-xs text-gray-500">{role} Portal</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden">
        <div className="flex justify-around items-center h-16">
          {currentNavItems.slice(0, 4).map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full text-gray-600 hover:text-orange-600 transition"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-xs">{item.name.split(' ')[0]}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r overflow-y-auto">
        <nav className="p-4 space-y-2">
          {currentNavItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition font-medium"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  )
}
