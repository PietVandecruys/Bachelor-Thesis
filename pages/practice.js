// pages/practice.js
import Layout from '../components/Layout';

export default function Practice() {
  return (
    <Layout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Practice Tests</h2>
      <p className="text-gray-700 mb-4">
        Access a range of practice questions to test your knowledge and track your progress.
      </p>
      {/* You can add interactive test components here */}
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">[Sample Test Component]</p>
      </div>
    </Layout>
  );
}
