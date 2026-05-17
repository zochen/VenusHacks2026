// OWNER: Person 3 (Backend / Integrations)
// Auth utilities for Supabase authentication

export async function signUpWithEmail(client: any, email: string, password: string) {
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithEmail(client: any, email: string, password: string) {
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut(client: any) {
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession(client: any) {
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) throw error;
  return session;
}

export async function getUser(client: any) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) throw error;
  return user;
}
