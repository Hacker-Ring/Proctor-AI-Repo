import { createClient } from './supabase-client'
import { Database } from './database.types'

type CallMetrics = Database['public']['Tables']['call_metrics']['Row']
type CallMetricsInsert = Database['public']['Tables']['call_metrics']['Insert']
type CallMetricsUpdate = Database['public']['Tables']['call_metrics']['Update']

export interface VendorDetails {
  vendor_name: string
  vendor_id: string
  api_version?: string
  additional_info?: Record<string, any>
}

export class CallMetricsServiceClient {
  /**
   * Save call metrics to database
   */
  static async saveCallMetrics(
    userId: string,
    callId: string,
    callDuration: number,
    transcript: string,
    summary: string,
    startTime: Date,
    endTime: Date,
    vendorDetails: VendorDetails
  ): Promise<CallMetrics> {
    try {
      const supabase = createClient()
      const callData: CallMetricsInsert = {
        user_id: userId,
        call_id: callId,
        call_duration: callDuration,
        transcript,
        summary,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        vendor_details: JSON.stringify(vendorDetails)
      }

      const { data, error } = await supabase
        .from('call_metrics')
        .insert(callData as any)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to save call metrics: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Save call metrics error:', error)
      throw error
    }
  }

  /**
   * Get all call metrics for a user
   */
  static async getUserCallMetrics(userId: string): Promise<CallMetrics[]> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('call_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch call metrics: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Get call metrics error:', error)
      throw error
    }
  }

  /**
   * Get a specific call by call ID
   */
  static async getCallByCallId(callId: string, userId: string): Promise<CallMetrics | null> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('call_metrics')
        .select('*')
        .eq('call_id', callId)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Call not found
        }
        throw new Error(`Failed to fetch call: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Get call error:', error)
      throw error
    }
  }

  /**
   * Get call metrics by date range
   */
  static async getCallMetricsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<CallMetrics[]> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('call_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())
        .order('start_time', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch call metrics by date range: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Get call metrics by date range error:', error)
      throw error
    }
  }

  /**
   * Update call metrics
   */
  static async updateCallMetrics(
    callId: string,
    userId: string,
    updates: Partial<CallMetricsUpdate>
  ): Promise<CallMetrics> {
    try {
      const supabase = createClient()
      const { data, error } = await (supabase as any)
        .from('call_metrics')
        .update(updates)
        .eq('call_id', callId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        throw new Error(`Update failed: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Update call metrics error:', error)
      throw error
    }
  }

  /**
   * Delete call metrics
   */
  static async deleteCallMetrics(callId: string, userId: string): Promise<void> {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('call_metrics')
        .delete()
        .eq('call_id', callId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Delete failed: ${error.message}`)
      }
    } catch (error) {
      console.error('Delete call metrics error:', error)
      throw error
    }
  }

  /**
   * Get call statistics for a user
   */
  static async getCallStatistics(userId: string): Promise<{
    totalCalls: number
    totalDuration: number
    averageDuration: number
    callsThisMonth: number
  }> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('call_metrics')
        .select('call_duration, start_time')
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Failed to fetch call statistics: ${error.message}`)
      }

      const calls = (data || []) as any[]
      const totalCalls = calls.length
      const totalDuration = calls.reduce((sum, call) => sum + call.call_duration, 0)
      const averageDuration = totalCalls > 0 ? totalDuration / totalCalls : 0

      // Calculate calls this month
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)
      
      const callsThisMonth = calls.filter(call => 
        new Date(call.start_time) >= thisMonth
      ).length

      return {
        totalCalls,
        totalDuration,
        averageDuration: Math.round(averageDuration),
        callsThisMonth
      }
    } catch (error) {
      console.error('Get call statistics error:', error)
      throw error
    }
  }
}
