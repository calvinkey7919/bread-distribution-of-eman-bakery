import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'Admin' | 'Salesman' | 'Factory' | 'Accountant'
          assigned_route_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      routes: {
        Row: {
          id: string
          route_number: number
          route_name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      products: {
        Row: {
          id: string
          product_code: string
          product_name: string
          description: string | null
          unit_price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          route_id: string
          salesman_id: string
          status: 'CREATED' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'VERIFIED' | 'INVOICED' | 'FLAGGED'
          order_date: string
          created_at: string
          updated_at: string
          is_locked: boolean
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          ordered_quantity: number
          created_at: string
        }
      }
      deliveries: {
        Row: {
          id: string
          order_id: string
          dispatched_by: string
          dispatch_date: string
          dispatch_time: string
          status: 'PENDING' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'VERIFIED' | 'FLAGGED'
          notes: string | null
          created_at: string
          updated_at: string
        }
      }
      delivery_items: {
        Row: {
          id: string
          delivery_id: string
          product_id: string
          ordered_quantity: number
          delivered_quantity: number
          variance: number
          created_at: string
        }
      }
      acknowledgements: {
        Row: {
          id: string
          delivery_id: string
          order_id: string
          acknowledged_by: string
          acknowledged_at: string
          notes: string | null
        }
      }
      verifications: {
        Row: {
          id: string
          delivery_id: string
          order_id: string
          verified_by: string
          verified_at: string
          is_flagged: boolean
          flag_reason: string | null
          notes: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          order_id: string
          invoice_number: string
          file_path: string
          uploaded_by: string
          uploaded_at: string
          notes: string | null
        }
      }
      business_days: {
        Row: {
          id: string
          business_date: string
          closed_by: string
          closed_at: string
          total_orders: number
          total_deliveries: number
          total_acknowledged: number
          total_verified: number
          total_invoiced: number
          notes: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: any
          new_values: any
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
      }
    }
  }
}
