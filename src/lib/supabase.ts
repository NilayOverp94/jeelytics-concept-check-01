import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          streak: number;
          last_test_date: string | null;
          total_tests: number;
          total_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          streak?: number;
          last_test_date?: string | null;
          total_tests?: number;
          total_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          streak?: number;
          last_test_date?: string | null;
          total_tests?: number;
          total_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      test_results: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          topic: string;
          score: number;
          total_questions: number;
          time_spent: number;
          questions: any;
          user_answers: string[];
          correct_answers: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          topic: string;
          score: number;
          total_questions: number;
          time_spent: number;
          questions: any;
          user_answers: string[];
          correct_answers: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          topic?: string;
          score?: number;
          total_questions?: number;
          time_spent?: number;
          questions?: any;
          user_answers?: string[];
          correct_answers?: string[];
          created_at?: string;
        };
      };
    };
  };
};