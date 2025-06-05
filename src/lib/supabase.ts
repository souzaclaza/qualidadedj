import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://verdant-crisp-5d20a3.netlify.app';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcmRhbnQtY3Jpc3AtNWQyMGEzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc3OTc1MjAsImV4cCI6MjAzMzM3MzUyMH0.Yd-Yk-Wd-Yk-Wd-Yk-Wd-Yk-Wd-Yk-Wd-Yk-Wd-Yk';

if (!supabaseUrl) {
  console.warn('Missing VITE_SUPABASE_URL environment variable, using fallback');
}

if (!supabaseAnonKey) {
  console.warn('Missing VITE_SUPABASE_ANON_KEY environment variable, using fallback');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Test the connection
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('Successfully connected to Supabase');
  }
});

// Create a helper function to map database column names to camelCase
export const mapToCamelCase = <T>(data: any): T => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => mapToCamelCase<T>(item)) as unknown as T;
  }
  
  if (typeof data === 'object' && data !== null) {
    const newObj: any = {};
    
    Object.keys(data).forEach(key => {
      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      newObj[camelKey] = mapToCamelCase(data[key]);
    });
    
    return newObj as T;
  }
  
  return data as T;
};

// Create a helper function to map camelCase to snake_case
export const mapToSnakeCase = (data: any): any => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => mapToSnakeCase(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const newObj: any = {};
    
    Object.keys(data).forEach(key => {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      newObj[snakeKey] = mapToSnakeCase(data[key]);
    });
    
    return newObj;
  }
  
  return data;
};