import { createServerSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createServerSupabase();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user profile exists, create if not
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // User profile doesn't exist, create one
        const names = data.user.user_metadata?.full_name?.split(' ') || ['', ''];
        const firstName = names[0] || data.user.user_metadata?.first_name || '';
        const lastName = names.slice(1).join(' ') || data.user.user_metadata?.last_name || '';

        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          first_name: firstName,
          last_name: lastName,
          avatar: data.user.user_metadata?.avatar_url,
          role: 'viewer',
          email_verified: !!data.user.email_confirmed_at,
        });
      }

      // Redirect to the requested page or dashboard
      const redirectUrl = new URL(next, origin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If there was an error, redirect to sign in page with error
  const errorUrl = new URL('/auth/signin?error=auth_callback_error', origin);
  return NextResponse.redirect(errorUrl);
}