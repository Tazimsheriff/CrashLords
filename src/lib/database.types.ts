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
      scanned_messages: {
        Row: {
          id: string
          user_id: string
          subject: string
          sender_email: string
          sender_name: string
          message_content: string
          risk_score: number
          is_phishing: boolean
          detection_reasons: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject?: string
          sender_email: string
          sender_name?: string
          message_content: string
          risk_score?: number
          is_phishing?: boolean
          detection_reasons?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          sender_email?: string
          sender_name?: string
          message_content?: string
          risk_score?: number
          is_phishing?: boolean
          detection_reasons?: Json
          created_at?: string
        }
      }
      analyzed_links: {
        Row: {
          id: string
          message_id: string
          url: string
          display_text: string
          is_suspicious: boolean
          risk_factors: Json
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          url: string
          display_text?: string
          is_suspicious?: boolean
          risk_factors?: Json
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          url?: string
          display_text?: string
          is_suspicious?: boolean
          risk_factors?: Json
          created_at?: string
        }
      }
      sender_reputation: {
        Row: {
          id: string
          email_address: string
          total_messages: number
          phishing_count: number
          trust_score: number
          last_seen: string
          created_at: string
        }
        Insert: {
          id?: string
          email_address: string
          total_messages?: number
          phishing_count?: number
          trust_score?: number
          last_seen?: string
          created_at?: string
        }
        Update: {
          id?: string
          email_address?: string
          total_messages?: number
          phishing_count?: number
          trust_score?: number
          last_seen?: string
          created_at?: string
        }
      }
      detection_rules: {
        Row: {
          id: string
          rule_name: string
          rule_type: string
          pattern: string
          severity: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          rule_name: string
          rule_type: string
          pattern: string
          severity?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          rule_name?: string
          rule_type?: string
          pattern?: string
          severity?: string
          is_active?: boolean
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
  }
}
