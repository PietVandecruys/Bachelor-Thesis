import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_USER || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_USER || ''
);

export default function UserProfileForm({ email }) {
  const [name, setName] = useState('');
  const [preferences, setPreferences] = useState({ topicFocus: '', difficulty: '' });

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase.from('profiles').select('*').eq('email', email).single();
      if (data) {
        setName(data.full_name);
        setPreferences(data.preferences || { topicFocus: '', difficulty: '' });
      }
    }
    fetchProfile();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase
      .from('profiles')
      .update({ full_name: name, preferences })
      .eq('email', email);
    alert('Profile updated!');
  };

  const handlePreferencesChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block font-medium">Topic Focus</label>
        <input
          name="topicFocus"
          value={preferences.topicFocus}
          onChange={handlePreferencesChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block font-medium">Difficulty Level</label>
        <select
          name="difficulty"
          value={preferences.difficulty}
          onChange={handlePreferencesChange}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}