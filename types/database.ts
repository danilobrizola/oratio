export interface Database {
  public: {
    Tables: {
      prayers: {
        Row: {
          id: string // UUID
          title: string
          content: string
          author_id: string // UUID
          created_at: string
          updated_at: string
          is_anonymous: boolean
          prayer_count: number
        }
        Insert: {
          id?: string // UUID
          title: string
          content: string
          author_id: string // UUID
          created_at?: string
          updated_at?: string
          is_anonymous?: boolean
          prayer_count?: number
        }
        Update: {
          id?: string // UUID
          title?: string
          content?: string
          author_id?: string // UUID
          created_at?: string
          updated_at?: string
          is_anonymous?: boolean
          prayer_count?: number
        }
      }
      users: {
        Row: {
          id: string // UUID
          name: string
          email: string
          image: string
          created_at: string
        }
        Insert: {
          id: string // UUID
          name: string
          email: string
          image?: string
          created_at?: string
        }
        Update: {
          id?: string // UUID
          name?: string
          email?: string
          image?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string // UUID
          content: string
          author_id: string // UUID
          prayer_id: string // UUID
          created_at: string
        }
        Insert: {
          id?: string // UUID
          content: string
          author_id: string // UUID
          prayer_id: string // UUID
          created_at?: string
        }
        Update: {
          id?: string // UUID
          content?: string
          author_id?: string // UUID
          prayer_id?: string // UUID
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
