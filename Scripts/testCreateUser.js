const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  "https://enedjwumosbvfygypzcj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZWRqd3Vtb3NidmZ5Z3lwemNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjM3MDI5MywiZXhwIjoyMDYxOTQ2MjkzfQ.dnO-fucstrh2jZjKY1XcDlygP6X0ERk5KI939_w4XxI"
);

async function testCreateUser() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: "testuser@example.com",
    password: "randompassword123",
    email_confirm: true,
  });

  console.log("New User Data:", data);
  console.log("Create User Error:", error);
}

testCreateUser();