import './home.css';
import { useState, useEffect } from 'react'; // Added useEffect
import { Navigate, useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Added auth state
  const navigate = useNavigate();

  // Check auth status on component mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        navigate('/start-chat/'); // Redirect if already signed in
      }
    };
    checkUser();

    // // Optional: Listen for auth state changes
    // const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
    //   setIsAuthenticated(!!session);
    //   if (session) {
    //     navigate('/start-chat/');
    //   }
    // });

    // // Cleanup subscription on unmount
    // return () => {
    //   subscription?.unsubscribe();
    // };
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');

    let response;
    if (isLogin) {
      response = await supabase.auth.signInWithPassword({ email, password });
    } else {
      response = await supabase.auth.signUp({ email, password });
    }

    if (response.error) {
      console.log(response);
      if (response.error.status === 401 && response.error.message === "Invalid API key") {
        setMessage('Error on our side');
      }
      else{

        setMessage(response.error.message);
      }
    } else {
      setMessage(isLogin ? 'Login successful!' : 'Sign-up successful! Check your email.');
      if (isLogin) {
        navigate('/start-chat/');
      }
    }
  };

  // If authenticated, you could also return a Navigate component instead of using navigate
  if (isAuthenticated) {
    return <Navigate to="/start-chat/" replace />;
  }

  return (
    <div className="home">
      <div className="left">
        <h1>Beyond AI Chats</h1>
        <h3>AI Client</h3>
        <h2>Your go-to helpful assistant</h2>
        <div className="signLinks"></div>
      </div>
      <div className="right">
        <form onSubmit={handleAuth} className="auth-form">
          <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
          {message && <p className="message">{message}</p>}
        </form>
        <button onClick={() => setIsLogin(false)}>Do not have account? Sign Up</button>
        <button onClick={() => setIsLogin(true)}>Have account? Log In</button>
      </div>
    </div>
  );
};

export default Home;