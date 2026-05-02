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
      answered_questions: {
        Row: {
          answered_at: string
          id: string
          question_id: string
          subject: string
          topic: string
          user_id: string
        }
        Insert: {
          answered_at?: string
          id?: string
          question_id: string
          subject: string
          topic: string
          user_id: string
        }
        Update: {
          answered_at?: string
          id?: string
          question_id?: string
          subject?: string
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answered_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      app_config: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          options: Json
          question: string
          subject: string
          topic: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          options: Json
          question: string
          subject: string
          topic: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
          subject?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      study_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      study_group_message_states: {
        Row: {
          created_at: string
          delivered_at: string | null
          hidden_at: string | null
          id: string
          message_id: string
          read_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          hidden_at?: string | null
          id?: string
          message_id: string
          read_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          hidden_at?: string | null
          id?: string
          message_id?: string
          read_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_message_states_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "study_group_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      study_group_messages: {
        Row: {
          created_at: string
          edited_at: string | null
          group_id: string
          id: string
          is_deleted: boolean
          message: string
          reply_to: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          edited_at?: string | null
          group_id: string
          id?: string
          is_deleted?: boolean
          message: string
          reply_to?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          edited_at?: string | null
          group_id?: string
          id?: string
          is_deleted?: boolean
          message?: string
          reply_to?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_group_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "study_group_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          avatar_key: string
          created_at: string
          created_by: string
          id: string
          invite_code: string
          max_members: number | null
          name: string
          updated_at: string
        }
        Insert: {
          avatar_key?: string
          created_at?: string
          created_by: string
          id?: string
          invite_code?: string
          max_members?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          avatar_key?: string
          created_at?: string
          created_by?: string
          id?: string
          invite_code?: string
          max_members?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          display_name: string
          duration_days: number
          id: string
          is_active: boolean | null
          name: string
          price_inr: number
        }
        Insert: {
          created_at?: string | null
          display_name: string
          duration_days: number
          id?: string
          is_active?: boolean | null
          name: string
          price_inr: number
        }
        Update: {
          created_at?: string | null
          display_name?: string
          duration_days?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price_inr?: number
        }
        Relationships: []
      }
      test_results: {
        Row: {
          correct_answers: string[]
          created_at: string
          id: string
          questions: Json
          score: number
          subject: string
          time_spent: number
          topic: string
          total_questions: number
          user_answers: string[]
          user_id: string
        }
        Insert: {
          correct_answers: string[]
          created_at?: string
          id?: string
          questions: Json
          score: number
          subject: string
          time_spent: number
          topic: string
          total_questions: number
          user_answers: string[]
          user_id: string
        }
        Update: {
          correct_answers?: string[]
          created_at?: string
          id?: string
          questions?: Json
          score?: number
          subject?: string
          time_spent?: number
          topic?: string
          total_questions?: number
          user_answers?: string[]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string
          id: string
          last_test_date: string | null
          last_test_reset_date: string | null
          streak: number
          tests_today: number | null
          total_score: number
          total_tests: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_test_date?: string | null
          last_test_reset_date?: string | null
          streak?: number
          tests_today?: number | null
          total_score?: number
          total_tests?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_test_date?: string | null
          last_test_reset_date?: string | null
          streak?: number
          tests_today?: number | null
          total_score?: number
          total_tests?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          plan_id: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          starts_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          starts_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          starts_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_subscription: {
        Args: {
          p_expires_at: string
          p_razorpay_payment_id: string
          p_razorpay_signature: string
          p_starts_at: string
          p_subscription_id: string
        }
        Returns: undefined
      }
      can_take_test: { Args: { p_user_id: string }; Returns: boolean }
      fetch_random_questions: {
        Args: {
          p_limit: number
          p_subject: string
          p_topic: string
          p_user_id: string
        }
        Returns: {
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          options: Json
          question: string
          subject: string
          topic: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "questions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      fetch_random_questions_public: {
        Args: { p_limit?: number; p_subject: string; p_topic: string }
        Returns: {
          id: string
          options: Json
          question: string
          subject: string
          topic: string
        }[]
      }
      get_remaining_tests: { Args: { p_user_id: string }; Returns: number }
      increment_daily_test_count: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      is_group_member: {
        Args: { p_group_id: string; p_user_id: string }
        Returns: boolean
      }
      is_premium_user: { Args: { p_user_id: string }; Returns: boolean }
      lookup_group_by_invite_code: {
        Args: { p_invite_code: string }
        Returns: {
          avatar_key: string
          id: string
          max_members: number
          name: string
        }[]
      }
      send_group_invite: {
        Args: {
          p_group_id: string
          p_group_name: string
          p_invitee_email: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
