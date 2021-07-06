import { signIn, signOut, useSession } from 'next-auth/client';

export default function Layout({ children }) {
  const [session, loading] = useSession();

  if (loading) {
    return null;
  }

  if (!session) {
    signIn();
    return null;
  }

  return (
    <>
      <div>
        <img
          src={session.user.image}
          style={{ borderRadius: '50%', height: 50 }}
        />
        Signed in as {session.user.name} ({session.user.email})
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      {children}
    </>
  );
}
