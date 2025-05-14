// pages/dashboard/profile.js
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import UserProfileForm from '../../components/UserProfileForm';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Layout><p>Loading...</p></Layout>;
  if (!session) return <Layout><p>Please sign in to view your profile.</p></Layout>;

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-4">Personal Dashboard</h2>
      <UserProfileForm email={session.user.email} />
    </Layout>
  );
}