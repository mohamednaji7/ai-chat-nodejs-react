import './home.css';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../../utils/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session } from '@supabase/gotrue-js'; // Import the Session type from @supabase/gotrue-js

const Home = () => {
  const [session, setSession] = useState<Session | null>(null); // Update the type of session state

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  if (session) {
    return <Navigate to="/start-chat/" replace />;
  }

  return (
    <div className="home">
      <div className="left">
        <h1>Beyond AI Chats</h1>
        <h2>AI Client</h2>
        <h3>Your go-to helpful assistant</h3>
      </div>
      {/* <Chat /> */}
      <div className="right">
        <Auth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#217bfe',
                  brandAccent: '#1a64d0',
                },
              },
            },
          }}
          providers={['google']}
          redirectTo={window.location.origin}

        />

      </div>
    </div>
  );
};  

export default Home;