// pages/api/auth/register.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_USER,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key (server-side only!)
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password, fullName } = req.body;

  // 1. Create user in Supabase Auth (with email confirmed by default)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data?.user) {
    return res.status(400).json({ error: error?.message || "Could not register user." });
  }

  // 2. Insert into 'profiles' table
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: data.user.id,
      email,
      full_name: fullName,
    });

  if (profileError) {
    return res.status(500).json({ error: "User created, but failed to create profile." });
  }

  return res.status(200).json({ message: "User registered successfully!" });
}
