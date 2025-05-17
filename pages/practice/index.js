import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { supabaseModules, supabaseAuth } from '../../lib/supabaseClient';

// Helper to “slugify” a module name (turn "Probability Concepts" -> "probability-concepts")
function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Map a module to an image.
function getModuleImage(name) {
  if (name === 'Statistics') {
    return '/images/statistics.jpg';
  } else if (name === 'Probability Concepts') {
    return '/images/probability.jpg';
  } else if (name === 'Portfolio Management') {
    return '/images/pm.jpg';
  } else if (name === 'Ethics And Trust') {
    return '/images/EthicsAndTrust.jpg';
  }
  return '/images/default.jpg';
}

export default function PracticeIndex({ modules }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [preferredModuleId, setPreferredModuleId] = useState(null);

  // 1. Fetch preferred module from auth project
  useEffect(() => {
    if (!session?.user) return;
    async function fetchPreferredModule() {
      const { data, error } = await supabaseAuth
        .from('profiles')
        .select('preferences')
        .eq('id', session.user.id)
        .single();
      if (data?.preferences) {
        let prefs = data.preferences;
        // preferences is vaak text/varchar -> dus parse!
        if (typeof prefs === 'string') {
          try {
            prefs = JSON.parse(prefs);
          } catch {
            prefs = {};
          }
        }
        if (prefs.selected_module) {
          setPreferredModuleId(prefs.selected_module);
        }
      }
    }
    fetchPreferredModule();
  }, [session]);

  if (status === 'loading') {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  // If not logged in, prompt to sign in
  if (!session) {
    return (
      <Layout>
        <p className="text-gray-700">You must be signed in to view this page.</p>
        <button
          onClick={() => signIn()}
          className="bg-gray-700 text-white px-4 py-2 rounded mt-4"
        >
          Sign In
        </button>
      </Layout>
    );
  }

  // Navigate to /practice/<slug> for the chosen module
  const handleStartTest = (moduleName) => {
    const slug = slugify(moduleName);
    router.push(`/practice/${slug}`);
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Practice Modules</h2>
      <p className="mb-4 text-gray-700">
        Choose a module below and click “Start Test” to begin practicing.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {modules.map((mod) => {
          const isPreferred = Number(mod.id) === Number(preferredModuleId);

          return (
            <div
              key={mod.id}
              className={`bg-white rounded shadow p-4 flex flex-col border-2 transition-all ${
                isPreferred
                  ? "border-blue-500 ring-2 ring-blue-400 shadow-xl"
                  : "border-transparent"
              }`}
            >
              {isPreferred && (
                <span className="inline-block px-2 py-1 text-xs bg-blue-500 text-white rounded mb-2 self-start">
                  Preferred
                </span>
              )}
              <img
                src={getModuleImage(mod.module_name)}
                alt={mod.module_name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {mod.module_name}
              </h3>
              <p className="text-gray-600 flex-grow">{mod.module_description}</p>
              <button
                onClick={() => handleStartTest(mod.module_name)}
                className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
              >
                Start Test
              </button>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

// Server-side: fetch all modules from Supabase
export async function getServerSideProps() {
  const { data: modules, error } = await supabaseModules
    .from('modules')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching modules:', error);
    return { props: { modules: [] } };
  }

  return {
    props: {
      modules: modules || []
    }
  };
}
