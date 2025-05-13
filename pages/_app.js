import { SessionProvider, useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import '../styles/globals.css';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_USER,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_USER
);

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;

// Store user in Supabase when they log in
async function storeUserInSupabase(user) {
  if (!user) return;

  const { data, error } = await supabase
    .from('users')
    .upsert([
      {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: new Date(),
        last_login: new Date(),
      }
    ]);

  if (error) {
    console.error("Error saving user to Supabase:", error);
  }
}
