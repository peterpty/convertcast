import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Main client for app use
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Client-side Supabase client factory
export const createClientSupabase = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Server-side Supabase client for API routes
export const createServerSupabase = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Admin client for server operations (if needed)
export const createAdminSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Database helper functions
export const supabaseHelpers = {
  // Handle Supabase errors
  handleError: (error: any) => {
    console.error('Supabase error:', error);
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Format Supabase response
  formatResponse: <T>(data: T[] | T | null, error: any) => {
    if (error) {
      return {
        success: false,
        data: null,
        error: supabaseHelpers.handleError(error),
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  },

  // Build query with pagination
  buildPaginatedQuery: (
    query: any,
    page: number = 1,
    limit: number = 10,
    orderBy: string = 'created_at',
    ascending: boolean = false
  ) => {
    const offset = (page - 1) * limit;
    return query
      .range(offset, offset + limit - 1)
      .order(orderBy, { ascending });
  },
};