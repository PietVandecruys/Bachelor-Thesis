import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { supabaseModules } from '../lib/supabaseClient'
import Layout from '../components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, BarChart2, BookOpen, Users, Clock3, ShieldCheck } from 'lucide-react'

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}
function getRecommendedModules(modules) {
  return modules.slice(0, 4);
}
function getModuleImage(name) {
  if (name === 'Statistics') return '/images/statistics.jpg';
  if (name === 'Probability Concepts') return '/images/probability.jpg';
  if (name === 'Portfolio Management') return '/images/pm.jpg';
  if (name === 'Ethics And Trust') return '/images/EthicsAndTrust.jpg';
  return '/images/default.jpg';
}

export default function Home({ modules }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[40vh]">
          <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></span>
          <p className="ml-4 text-lg text-gray-600">Loading your experience...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center py-24  min-h-[560px] overflow-hidden">
        {/* Decorative SVG/Background Animation (optional) */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
          {/* Example: Blurred blobs or animated gradients */}
        </div>
        <div className="z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 drop-shadow-sm animate-fade-in-down">
            <span>
              Master the CFA Exam
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Personalized CFA preparation, real-time analytics and authentic exam practice, all designed for your success.</p>
          <div className="mb-10 animate-fade-in">
            <Image
              src="/images/CFA-Exam-Prep.webp"
              alt="CFA Exam Preparation"
              width={600}
              height={340}
              className="rounded-xl shadow-2xl border-2 border-gray-200"
              priority
            />
          </div>
          {/* Social Proof: Logos */}
          <div className="flex justify-center gap-6 mt-8 opacity-80">
            {/* Replace these with real or placeholder logos */}
            <img src="/images/bfh.webp" alt="University 1" className="h-8" />
            <img src="/images/UniBern.png" alt="University 2" className="h-8" />
            <img src="/images/cfaswitzerland.jpg" alt="Partner 1" className="h-8" />
          </div>
        </div>
      </section>
            {/* FEATURE SECTION */}
      <section className="py-20  px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
            Why Choose CFA Exam Prep?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-blue-50 rounded-xl p-8 shadow-md text-center hover:scale-105 transition">
              <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-3"/>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Interactive Quizzes</h4>
              <p className="text-gray-700">Adaptive practice tailored to your strengths never waste time guessing what to study.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow-md text-center hover:scale-105 transition">
              <BarChart2 className="w-12 h-12 text-blue-600 mx-auto mb-3"/>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Performance Analytics</h4>
              <p className="text-gray-700">Visual insights into score trends, time management and improvement areas.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow-md text-center hover:scale-105 transition">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-3"/>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Always Up-to-date</h4>
              <p className="text-gray-700">New content every semester always prep with the latest exam updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (Higher Up) */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Trusted by 1,000+ CFA Candidates</h3>
          <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
            <div className="bg-blue-50 rounded-lg p-6 shadow text-left hover:scale-105 transition">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/images/avatar-1.webp" alt="User 1" width={40} height={40} className="rounded-full"/>
                <span className="font-semibold text-gray-800">Sophie V.</span>
              </div>
              <p className="text-gray-700 italic">“This platform made CFA study so much less stressful. The analytics and instant feedback are just fantastic!”</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 shadow text-left hover:scale-105 transition">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/images/avatar-2.webp" alt="User 2" width={40} height={40} className="rounded-full"/>
                <span className="font-semibold text-gray-800">Brian T.</span>
              </div>
              <p className="text-gray-700 italic">“Super intuitive, and I love the question explanations. Feels like having a CFA tutor!”</p>
            </div>
          </div>
        </div>
      </section>  



      {/* HOW IT WORKS SECTION (optional) */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-10 h-10 text-blue-600 mb-2"/>
              <h4 className="font-semibold text-lg mb-2">Sign Up Free</h4>
              <p className="text-gray-600 text-base">Create your profile in seconds no payment needed.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock3 className="w-10 h-10 text-blue-600 mb-2"/>
              <h4 className="font-semibold text-lg mb-2">Take a Practice Quiz</h4>
              <p className="text-gray-600 text-base">Start with a quick diagnostic quiz to set your learning path.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <BarChart2 className="w-10 h-10 text-blue-600 mb-2"/>
              <h4 className="font-semibold text-lg mb-2">Track Your Progress</h4>
              <p className="text-gray-600 text-base">Get instant feedback, analytics, and personalized recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RECOMMENDED MODULES */}
      {session ? (
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-100 to-white px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Recommended Modules</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {getRecommendedModules(modules).length ? (
              getRecommendedModules(modules).map((mod) => (
                <div key={mod.id} className="bg-white border rounded-xl shadow-lg p-4 flex flex-col items-center text-center hover:shadow-xl hover:scale-105 transition">
                  <img
                    src={getModuleImage(mod.module_name)}
                    alt={mod.module_name}
                    className="w-full h-40 object-cover rounded-lg shadow mb-2"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mt-2">{mod.module_name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1 mb-2 justify-center">
                    {/* Example badges (add to your data or make generic) */}
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">~{mod.estimated_time || "20 min"}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{mod.difficulty_level || "Easy"}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{mod.module_description}</p>
                  <button
                    onClick={() => router.push(`/practice/${slugify(mod.module_name)}`)}
                    className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-md font-medium transition"
                  >
                    Take Test
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-lg text-gray-500">No modules found. Please check back soon!</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        // Call to Action for non-logged-in users
      <div>
        
      </div>
      )}

      {/* BOTTOM CTA */}
      <section className="py-14 bg-gradient-to-r from-blue-100 via-blue-50 to-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Start Acing Your CFA Exam Today</h2>
        <p className="text-gray-600 mb-6">Join the fastest-growing CFA prep community and boost your chances of success!</p>
        <Link href={session ? "/dashboard" : "/signup"}>
          <button className="bg-blue-700 hover:bg-blue-900 text-white px-8 py-3 rounded-lg shadow font-semibold transition">
            {session ? "Go to Dashboard" : "Sign Up Free"}
          </button>
        </Link>
      </section>
    </Layout>
  );
}

// Server-side fetch
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
