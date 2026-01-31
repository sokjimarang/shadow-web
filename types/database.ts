export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          user_id: string | null
          duration: number
          frame_count: number
          event_count: number
          status: string
          started_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          duration?: number
          frame_count?: number
          event_count?: number
          status?: string
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          duration?: number
          frame_count?: number
          event_count?: number
          status?: string
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      analysis_results: {
        Row: {
          id: string
          session_id: string
          action_type: string
          target: string
          context: string | null
          description: string | null
          confidence: number | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          action_type: string
          target: string
          context?: string | null
          description?: string | null
          confidence?: number | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          action_type?: string
          target?: string
          context?: string | null
          description?: string | null
          confidence?: number | null
          timestamp?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      patterns: {
        Row: {
          id: string
          session_id: string
          pattern_type: string
          count: number
          actions: unknown
          similarity_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          pattern_type?: string
          count?: number
          actions?: unknown
          similarity_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          pattern_type?: string
          count?: number
          actions?: unknown
          similarity_score?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patterns_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      slack_events: {
        Row: {
          id: string
          event_type: string
          user_id: string | null
          channel_id: string | null
          payload: unknown
          processed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          user_id?: string | null
          channel_id?: string | null
          payload: unknown
          processed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          user_id?: string | null
          channel_id?: string | null
          payload?: unknown
          processed?: boolean
          created_at?: string
        }
        Relationships: []
      }
      slack_interaction_answers: {
        Row: {
          id: number
          session_id: string
          selected_option: string
          additional_context: string | null
          create_exception_rule: boolean | null
          answered_at: string
          user_id: string
          raw_payload: unknown
          created_at: string
        }
        Insert: {
          id?: never
          session_id: string
          selected_option: string
          additional_context?: string | null
          create_exception_rule?: boolean | null
          answered_at: string
          user_id: string
          raw_payload: unknown
          created_at?: string
        }
        Update: {
          id?: never
          session_id?: string
          selected_option?: string
          additional_context?: string | null
          create_exception_rule?: boolean | null
          answered_at?: string
          user_id?: string
          raw_payload?: unknown
          created_at?: string
        }
        Relationships: []
      }
      slack_messages: {
        Row: {
          id: number
          user_id: string
          channel_id: string
          text: string | null
          timestamp: string
          raw_event: unknown | null
          created_at: string
        }
        Insert: {
          id?: never
          user_id: string
          channel_id: string
          text?: string | null
          timestamp: string
          raw_event?: unknown | null
          created_at?: string
        }
        Update: {
          id?: never
          user_id?: string
          channel_id?: string
          text?: string | null
          timestamp?: string
          raw_event?: unknown | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
