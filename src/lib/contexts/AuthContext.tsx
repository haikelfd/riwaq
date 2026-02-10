'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types';
import { DEMO_PROFILE } from '@/lib/demo-data';
import type { User } from '@supabase/supabase-js';

const DEMO_STORAGE_KEY = 'riwaq-demo-auth';

interface DemoAuthState {
  phone: string;
  name: string;
  has_seen_tour: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  demoSignIn: (phone: string, name: string) => void;
  updateDemoProfile: (data: { full_name?: string }) => void;
  markDemoTourSeen: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  demoSignIn: () => {},
  updateDemoProfile: () => {},
  markDemoTourSeen: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function isDemoMode() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url === 'your_supabase_url_here';
}

function getDemoState(): DemoAuthState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setDemoState(state: DemoAuthState | null) {
  if (typeof window === 'undefined') return;
  if (state) {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(DEMO_STORAGE_KEY);
  }
}

function buildDemoUser(phone: string): User {
  return {
    id: DEMO_PROFILE.id,
    phone: `+216${phone}`,
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: {},
    user_metadata: {},
    created_at: DEMO_PROFILE.created_at,
  } as User;
}

function buildDemoProfile(phone: string, name: string, hasSeenTour: boolean): Profile {
  return {
    ...DEMO_PROFILE,
    phone,
    full_name: name || null,
    has_seen_tour: hasSeenTour,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    if (isDemoMode()) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) {
      setProfile(data as Profile);
    }
  }, []);

  // Demo mode: restore session from localStorage
  useEffect(() => {
    if (isDemoMode()) {
      const saved = getDemoState();
      if (saved) {
        setUser(buildDemoUser(saved.phone));
        setProfile(buildDemoProfile(saved.phone, saved.name, saved.has_seen_tour));
      }
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const demoSignIn = useCallback((phone: string, name: string) => {
    const state: DemoAuthState = { phone, name, has_seen_tour: false };
    setDemoState(state);
    setUser(buildDemoUser(phone));
    setProfile(buildDemoProfile(phone, name, false));
  }, []);

  const updateDemoProfile = useCallback((data: { full_name?: string }) => {
    if (!isDemoMode()) return;
    const saved = getDemoState();
    if (!saved) return;
    const newName = data.full_name !== undefined ? (data.full_name.trim() || '') : saved.name;
    const newState: DemoAuthState = { ...saved, name: newName };
    setDemoState(newState);
    setProfile(buildDemoProfile(newState.phone, newState.name, newState.has_seen_tour));
  }, []);

  const markDemoTourSeen = useCallback(() => {
    if (!isDemoMode()) return;
    const saved = getDemoState();
    if (!saved) return;
    const newState: DemoAuthState = { ...saved, has_seen_tour: true };
    setDemoState(newState);
    setProfile(buildDemoProfile(newState.phone, newState.name, true));
  }, []);

  const signOut = useCallback(async () => {
    if (isDemoMode()) {
      setDemoState(null);
      setUser(null);
      setProfile(null);
      router.push('/');
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, demoSignIn, updateDemoProfile, markDemoTourSeen }}>
      {children}
    </AuthContext.Provider>
  );
}
