// pages/index.js
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      {/* Hero / Intro Section */}
      <section className="text-center py-16 bg-white shadow-sm rounded-lg">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to CFA Exam Prep
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Prepare thoroughly for your CFA exam with our innovative, interactive platform.
          Access up-to-date study materials, practice exams, and track your progress – all
          in one place.
        </p>
      </section>

      {/* Features / Why Us Section */}
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
            {/* Feature 1 */}
            <div className="bg-white shadow-sm rounded-lg p-6 text-center">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Interactive Quizzes</h4>
              <p className="text-gray-600">
                Engage with dynamic quizzes and flashcards that adapt to your strengths and weaknesses.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white shadow-sm rounded-lg p-6 text-center">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Performance Analytics</h4>
              <p className="text-gray-600">
                Gain insights into your progress with clear analytics and personalized study paths.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white shadow-sm rounded-lg p-6 text-center">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Up-to-Date Content</h4>
              <p className="text-gray-600">
                All materials are regularly updated to ensure coverage of the latest CFA curriculum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-16 py-12 bg-blue-50 text-center rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Sign up now and kickstart your journey to becoming a CFA Charterholder.
        </p>
        <Link href="/signup" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md shadow hover:bg-blue-600 transition">
            Sign Up
        </Link>
      </section>
    </Layout>
  );
}
