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
      <section className="text-center py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Master the CFA Exam
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Learn smarter, not harder. Personalized CFA prep, live performance tracking, and module-based testing – built just for you.
        </p>
        <div className="flex justify-center">
          <Image
            src="/images/CFA-Exam-Prep.webp"
            alt="CFA Exam Preparation"
            width={640}
            height={420}
            className="rounded-xl shadow-2xl w-full max-w-2xl"
            priority
          />
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Why Choose Us?
          </h2>
          <p className="text-center text-gray-600 mb-14 max-w-xl mx-auto">
            Your CFA journey deserves the best tools. Here’s what sets us apart:
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Interactive Quizzes', desc: 'Adaptive quizzes tailored to your strengths and weaknesses.' },
              { title: 'Performance Analytics', desc: 'Visual insights into your score trends and time management.' },
              { title: 'Up-to-Date Content', desc: 'Regularly updated material to reflect the latest CFA curriculum.' }
            ].map((feature, index) => (
              <div key={index} className="bg-blue-50 hover:bg-blue-100 transition rounded-xl p-6 shadow-md text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Tests */}
      {session ? (
        <section className="py-20 bg-white px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Recommended Modules</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {getRecommendedModules(modules).map((mod) => (
              <div key={mod.id} className="bg-white border rounded-xl shadow-lg p-4 flex flex-col items-center text-center">
                <img
                  src={getModuleImage(mod.module_name)}
                  alt={mod.module_name}
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
                <h3 className="text-xl font-semibold text-gray-800 mt-4">{mod.module_name}</h3>
                <p className="text-sm text-gray-600 mt-1">{mod.module_description}</p>
                <button
                  onClick={() => router.push(`/practice/${slugify(mod.module_name)}`)}
                  className="mt-4 px-5 py-2 bg-gray-700 hover:bg-blue-900 text-white rounded-md transition"
                >
                  Take Test
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="py-20 px-6 bg-blue-50 text-center rounded-lg mt-16 shadow-md w-full max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Sign in now to access personalized tests, track your CFA progress, and unlock premium study tools.
          </p>
          <Link
            href="/signin"
            className="inline-block bg-gray-700 hover:bg-blue-900 text-white px-6 py-3 rounded-md shadow transition"
          >
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
