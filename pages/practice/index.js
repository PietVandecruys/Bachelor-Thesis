import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Layout from '../../components/Layout';
import { supabaseModules } from '../../lib/supabaseClient';

// Helper to “slugify” a module name (turn "Probability Concepts" -> "probability-concepts")
function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// We can also store short descriptions here or in the DB. This is just an example.
function getModuleDescription(name) {
  if (name === 'Statistics') {
    return 'Practice your knowledge on statistical concepts and data analysis.';
  } else if (name === 'Probability Concepts') {
    return 'Sharpen your skills on probability rules, scenarios, and calculations.';
  } else if (name === 'Ethics and Trust') {
    return 'Explore ethical standards and responsibilities in finance.';
  }
  return 'Practice your knowledge on CFA-related content.';
}

// We can similarly map a module to an image.
function getModuleImage(name) {
  if (name === 'Statistics') {
    return '/images/statistics.jpg';
  } else if (name === 'Probability Concepts') {
    return '/images/probability.jpg';
  } else if (name === 'Portfolio Management') {
    return '/images/pm.jpg';
  }
  return '/images/default.jpg';
}

export default function PracticeIndex({ modules }) {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  // Navigate the user to /practice/<slug> for the chosen module
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const description = getModuleDescription(mod.module_name);
          const image = getModuleImage(mod.module_name);

          return (
            <div key={mod.id} className="bg-white rounded shadow p-4 flex flex-col">
              <img
                src={image}
                alt={mod.module_name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {mod.module_name}
              </h3>
              <p className="text-gray-600 flex-grow">{description}</p>
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

// Fetch all modules from Supabase
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
