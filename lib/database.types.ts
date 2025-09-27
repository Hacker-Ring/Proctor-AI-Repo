export interface Database {
  public: {
    Tables: {
      knowledge_base: {
        Row: {
          id: string
          user_id: string
          clerk_id: string
          document_name: string
          document_url: string
          document_type: string
          file_size: number
          upload_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clerk_id?: string
          document_name: string
          document_url: string
          document_type: string
          file_size: number
          upload_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clerk_id?: string
          document_name?: string
          document_url?: string
          document_type?: string
          file_size?: number
          upload_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      call_metrics: {
        Row: {
          id: string
          user_id: string
          clerk_id: string
          call_id: string
          call_duration: number
          transcript: string
          summary: string
          start_time: string
          end_time: string
          vendor_details: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clerk_id?: string
          call_id: string
          call_duration: number
          transcript: string
          summary: string
          start_time: string
          end_time: string
          vendor_details: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clerk_id?: string
          call_id?: string
          call_duration?: number
          transcript?: string
          summary?: string
          start_time?: string
          end_time?: string
          vendor_details?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
