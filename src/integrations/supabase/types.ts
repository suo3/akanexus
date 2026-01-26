export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_links: {
        Row: {
          category: string
          created_at: string
          description: string | null
          flags: number
          id: string
          is_flagged: boolean
          is_removed: boolean
          submitted_by: string | null
          title: string
          updated_at: string
          upvotes: number
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          flags?: number
          id?: string
          is_flagged?: boolean
          is_removed?: boolean
          submitted_by?: string | null
          title: string
          updated_at?: string
          upvotes?: number
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          flags?: number
          id?: string
          is_flagged?: boolean
          is_removed?: boolean
          submitted_by?: string | null
          title?: string
          updated_at?: string
          upvotes?: number
          url?: string
        }
        Relationships: []
      }
      blog_votes: {
        Row: {
          blog_id: string
          created_at: string
          id: string
          vote_type: string
          voter_hash: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: string
          vote_type?: string
          voter_hash: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: string
          vote_type?: string
          voter_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_votes_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blog_links"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_sections: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          description: string | null
          icon: string
          id: string
          is_published: boolean | null
          order_index: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string
          id?: string
          is_published?: boolean | null
          order_index?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string
          id?: string
          is_published?: boolean | null
          order_index?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_components: {
        Row: {
          category: string
          code_snippet: string | null
          created_at: string
          created_by: string | null
          description: string | null
          downloads: number | null
          id: string
          is_premium: boolean | null
          is_published: boolean | null
          name: string
          preview_image_url: string | null
          price: number | null
          updated_at: string
        }
        Insert: {
          category: string
          code_snippet?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          downloads?: number | null
          id?: string
          is_premium?: boolean | null
          is_published?: boolean | null
          name: string
          preview_image_url?: string | null
          price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          code_snippet?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          downloads?: number | null
          id?: string
          is_premium?: boolean | null
          is_published?: boolean | null
          name?: string
          preview_image_url?: string | null
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          demo_url: string | null
          description: string | null
          downloads: number | null
          features: string[] | null
          id: string
          is_premium: boolean | null
          is_published: boolean | null
          name: string
          preview_image_url: string | null
          price: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          demo_url?: string | null
          description?: string | null
          downloads?: number | null
          features?: string[] | null
          id?: string
          is_premium?: boolean | null
          is_published?: boolean | null
          name: string
          preview_image_url?: string | null
          price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          demo_url?: string | null
          description?: string | null
          downloads?: number | null
          features?: string[] | null
          id?: string
          is_premium?: boolean | null
          is_published?: boolean | null
          name?: string
          preview_image_url?: string | null
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          name: string
          order_index: number | null
          preview_image_url: string | null
          updated_at: string
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          name: string
          order_index?: number | null
          preview_image_url?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          name?: string
          order_index?: number | null
          preview_image_url?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tutorial_votes: {
        Row: {
          created_at: string
          id: string
          tutorial_id: string
          vote_type: string
          voter_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          tutorial_id: string
          vote_type?: string
          voter_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          tutorial_id?: string
          vote_type?: string
          voter_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutorial_votes_tutorial_id_fkey"
            columns: ["tutorial_id"]
            isOneToOne: false
            referencedRelation: "tutorials"
            referencedColumns: ["id"]
          },
        ]
      }
      tutorials: {
        Row: {
          author: string | null
          category: string
          content: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration: string | null
          flags: number
          id: string
          is_flagged: boolean
          is_published: boolean | null
          is_removed: boolean
          level: string
          order_index: number
          slug: string
          submitted_by: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          upvotes: number
          url: string | null
          video_url: string | null
        }
        Insert: {
          author?: string | null
          category?: string
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          flags?: number
          id?: string
          is_flagged?: boolean
          is_published?: boolean | null
          is_removed?: boolean
          level?: string
          order_index?: number
          slug: string
          submitted_by?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          upvotes?: number
          url?: string | null
          video_url?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          flags?: number
          id?: string
          is_flagged?: boolean
          is_published?: boolean | null
          is_removed?: boolean
          level?: string
          order_index?: number
          slug?: string
          submitted_by?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          upvotes?: number
          url?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_blog_flags: { Args: { _blog_id: string }; Returns: undefined }
      increment_blog_upvotes: { Args: { _blog_id: string }; Returns: undefined }
      increment_component_downloads: {
        Args: { _component_id: string }
        Returns: undefined
      }
      increment_template_downloads: {
        Args: { _template_id: string }
        Returns: undefined
      }
      increment_tutorial_flags: {
        Args: { _tutorial_id: string }
        Returns: undefined
      }
      increment_tutorial_upvotes: {
        Args: { _tutorial_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
