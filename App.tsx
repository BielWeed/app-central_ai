import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import { supabase, Session } from './lib/supabase';

const MICRO_APPS = {
  DASHBOARD: 'https://app-p1-eight.vercel.app',
  PRODUCTS: 'https://www.google.com/search?igu=1&q=products&igu=1&tbm=isch',
  ADMIN: 'https://ademi.vercel.app/',
};

// Security: Define trusted origins for micro-apps dynamically
const TRUSTED_ORIGINS = Array.from(new Set(Object.values(MICRO_APPS).map(url => new URL(url).origin)));


const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentAppUrl, setCurrentAppUrl] = useState<string>(MICRO_APPS.DASHBOARD);
  const [loading, setLoading] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 1. Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Message Hub listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // SECURITY: Verify the origin of the message
      if (!TRUSTED_ORIGINS.includes(event.origin)) {
        console.warn(`Message from untrusted origin ${event.origin} ignored.`);
        return;
      }

      const { type, payload } = event.data;

      switch (type) {
        case 'APP_LOADED':
          console.log('Micro-app loaded. Sending auth token if available.');
          if (session && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              {
                type: 'AUTH_TOKEN',
                payload: { accessToken: session.access_token },
              },
              event.origin // Use the verified origin as the target
            );
          }
          break;
        case 'SHOW_NOTIFICATION':
          if (payload?.text) {
            alert(payload.text);
          }
          break;
        default:
          // Ignore unknown message types
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [session]); // Dependency array ensures the latest session is used

  const handleLogin = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        throw error; // Let the modal handle the error display
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentAppUrl(MICRO_APPS.DASHBOARD); // Reset to dashboard on logout
  };

  const handleNavClick = (url: string) => {
    setCurrentAppUrl(url);
  };
  
  const AppContent: React.FC = () => (
     <div className="flex-1 flex flex-col h-screen">
        <Header user={session?.user ?? null} onLogout={handleLogout} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onNavClick={handleNavClick} apps={MICRO_APPS} />
          <main className="flex-1 bg-shell-content overflow-y-auto">
            <iframe
              id="app-content"
              ref={iframeRef}
              src={currentAppUrl}
              className="w-full h-full border-none"
              title="App Content"
              sandbox="allow-scripts allow-same-origin allow-forms"
            ></iframe>
          </main>
        </div>
      </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-shell-bg">
        <div className="text-xl text-shell-text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative antialiased">
      {!session ? (
        <LoginModal onLogin={handleLogin} />
      ) : (
        <AppContent />
      )}
    </div>
  );
};

export default App;