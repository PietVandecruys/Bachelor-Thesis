import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { supabaseModules, supabaseAuth } from '../lib/supabaseClient'; // Importing the supabaseModules client
import Layout from '../components/Layout';
import Link from 'next/link';
import Image from "next/image";

console.log("supabaseAuth:", supabaseAuth);  // Check if supabaseAuth is initialized
console.log("supabaseModules:", supabaseModules);  // Check if supabaseModules is initialized


// Helper to format module names for URLs
function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Fetch 3 recommended modules
function getRecommendedModules(modules) {
  return modules.slice(0, 3);
}

// Image mapping for modules
function getModuleImage(name) {
  if (name === 'Statistics') return '/images/statistics.jpg';
  if (name === 'Probability Concepts') return '/images/probability.jpg';
  if (name === 'Portfolio Management') return '/images/pm.jpg';
  return '/images/default.jpg';
}

export default function Home({ modules }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero / Intro Section */}
      <section className="text-center py-16 bg-white">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to CFA Exam Prep
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Prepare thoroughly for your CFA exam with our innovative, interactive platform.
          Access up-to-date study materials, practice exams, and track your progress – all
          in one place.
        </p>
        <div className="flex justify-center">
        <Image
          src="/images/CFA-Exam-Prep.webp"
          alt="CFA Exam Preparation"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
          priority
        />
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Why Choose Our Platform?
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our platform is designed to help you focus on the material that matters most.
            Practice with relevant questions, monitor your progress, and stay motivated.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white shadow-sm rounded-lg p-6 text-center">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Interactive Quizzes</h4>
              <p className="text-gray-600">
                Engage with dynamic quizzes and flashcards that adapt to your strengths and weaknesses.
              </p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 text-center">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Performance Analytics</h4>
              <p className="text-gray-600">
                Gain insights into your progress with clear analytics and personalized study paths.
              </p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 text-center">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Up-to-Date Content</h4>
              <p className="text-gray-600">
                All materials are regularly updated to ensure coverage of the latest CFA curriculum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Tests Section */}
        {session ? (
          <section className="mt-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Recommended Tests
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRecommendedModules(modules).map((mod) => (
                <div key={mod.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                  {/* Test Image */}
                  <img
                    src={getModuleImage(mod.module_name)}
                    alt={mod.module_name}
                    className="w-full h-40 object-cover rounded-lg"
                  />

                  {/* Test Info */}
                  <h3 className="text-xl font-semibold text-gray-800 mt-4">
                    {mod.module_name}
                  </h3>
                  <p className="text-gray-600 text-center">
                    Sharpen your skills with this CFA test.
                  </p>

                  {/* Take Test Button */}
                  <button
                    onClick={() => router.push(`/practice/${slugify(mod.module_name)}`)}
                    className="mt-4 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition"
                  >
                    Take Test
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : (
          // If user is NOT logged in, show sign-up prompt
          <section className="mt-16 py-12 bg-blue-50 text-center rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Sign up now and kickstart your journey to becoming a CFA Charterholder.
            </p>
            <Link href="/signin" className="inline-block bg-gray-700 text-white px-6 py-3 rounded-md shadow hover:bg-blue-900 transition">
              Sign In
            </Link>
          </section>
        )}
    </Layout>
  );
}

// Fetch CFA modules from Supabase
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
