export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          avatar: string | null
          role: 'streamer' | 'viewer' | 'admin'
          timezone: string
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          avatar?: string | null
          role?: 'streamer' | 'viewer' | 'admin'
          timezone?: string
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          avatar?: string | null
          role?: 'streamer' | 'viewer' | 'admin'
          timezone?: string
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          streamer_id: string
          scheduled_at: string
          duration: number
          timezone: string
          status: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled'
          max_attendees: number | null
          registration_required: boolean
          registration_fields: Json
          landing_page_config: Json
          stream_config: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          streamer_id: string
          scheduled_at: string
          duration?: number
          timezone?: string
          status?: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled'
          max_attendees?: number | null
          registration_required?: boolean
          registration_fields?: Json
          landing_page_config?: Json
          stream_config?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          streamer_id?: string
          scheduled_at?: string
          duration?: number
          timezone?: string
          status?: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled'
          max_attendees?: number | null
          registration_required?: boolean
          registration_fields?: Json
          landing_page_config?: Json
          stream_config?: Json
          created_at?: string
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          first_name: string
          last_name: string
          email: string
          phone: string | null
          company: string | null
          registration_data: Json
          joined_at: string | null
          left_at: string | null
          is_active: boolean
          watch_time: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          company?: string | null
          registration_data?: Json
          joined_at?: string | null
          left_at?: string | null
          is_active?: boolean
          watch_time?: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string | null
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          company?: string | null
          registration_data?: Json
          joined_at?: string | null
          left_at?: string | null
          is_active?: boolean
          watch_time?: number
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          event_id: string
          participant_id: string | null
          sender_id: string | null
          sender_name: string
          sender_avatar: string | null
          content: string
          type: 'chat' | 'system' | 'announcement'
          is_moderated: boolean
          is_pinned: boolean
          reactions: Json
          timestamp: string
        }
        Insert: {
          id?: string
          event_id: string
          participant_id?: string | null
          sender_id?: string | null
          sender_name: string
          sender_avatar?: string | null
          content: string
          type?: 'chat' | 'system' | 'announcement'
          is_moderated?: boolean
          is_pinned?: boolean
          reactions?: Json
          timestamp?: string
        }
        Update: {
          id?: string
          event_id?: string
          participant_id?: string | null
          sender_id?: string | null
          sender_name?: string
          sender_avatar?: string | null
          content?: string
          type?: 'chat' | 'system' | 'announcement'
          is_moderated?: boolean
          is_pinned?: boolean
          reactions?: Json
          timestamp?: string
        }
      }
      overlay_elements: {
        Row: {
          id: string
          event_id: string
          type: 'alert' | 'countdown' | 'progress' | 'gif_sound' | 'persistent_message' | 'marquee'
          position: 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
          config: Json
          is_active: boolean
          start_time: string | null
          end_time: string | null
          duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          type: 'alert' | 'countdown' | 'progress' | 'gif_sound' | 'persistent_message' | 'marquee'
          position: 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
          config?: Json
          is_active?: boolean
          start_time?: string | null
          end_time?: string | null
          duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          type?: 'alert' | 'countdown' | 'progress' | 'gif_sound' | 'persistent_message' | 'marquee'
          position?: 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
          config?: Json
          is_active?: boolean
          start_time?: string | null
          end_time?: string | null
          duration?: number | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          event_id: string
          participant_id: string
          amount: number
          currency: string
          status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
          payment_method: 'stripe' | 'paypal'
          payment_intent_id: string | null
          description: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          participant_id: string
          amount: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
          payment_method: 'stripe' | 'paypal'
          payment_intent_id?: string | null
          description: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          participant_id?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
          payment_method?: 'stripe' | 'paypal'
          payment_intent_id?: string | null
          description?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          event_id: string
          total_views: number
          unique_viewers: number
          peak_concurrent_viewers: number
          average_watch_time: number
          total_watch_time: number
          chat_messages: number
          conversion_rate: number
          revenue: number
          engagement_rate: number
          drop_off_points: Json
          viewer_geography: Json
          device_breakdown: Json
          traffic_sources: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          total_views?: number
          unique_viewers?: number
          peak_concurrent_viewers?: number
          average_watch_time?: number
          total_watch_time?: number
          chat_messages?: number
          conversion_rate?: number
          revenue?: number
          engagement_rate?: number
          drop_off_points?: Json
          viewer_geography?: Json
          device_breakdown?: Json
          traffic_sources?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          total_views?: number
          unique_viewers?: number
          peak_concurrent_viewers?: number
          average_watch_time?: number
          total_watch_time?: number
          chat_messages?: number
          conversion_rate?: number
          revenue?: number
          engagement_rate?: number
          drop_off_points?: Json
          viewer_geography?: Json
          device_breakdown?: Json
          traffic_sources?: Json
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'info' | 'success' | 'warning' | 'error' | 'event'
          title: string
          message: string
          is_read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'info' | 'success' | 'warning' | 'error' | 'event'
          title: string
          message: string
          is_read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'info' | 'success' | 'warning' | 'error' | 'event'
          title?: string
          message?: string
          is_read?: boolean
          data?: Json | null
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}