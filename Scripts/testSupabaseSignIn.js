import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://enedjwumosbvfygypzcj.supabase.co", // Replace with your Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZWRqd3Vtb3NidmZ5Z3lwemNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzAyOTMsImV4cCI6MjA2MTk0NjI5M30.3ScxQ2iB79xn-zaK0ZZ7p0WtVIcqRCA3HYLp1IS-tM0" // Replace with your anon key
);

async function testSignIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "pvandecruys@gmail.com", // Replace with a test email
    password: "Schuttershof 10!",   // Replace with a test password
  });

  console.log("User:", data?.user);
  console.log("Error:", error);
}

testSignIn();