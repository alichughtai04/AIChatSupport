'use client';
import { useState } from 'react';
import '../../app/sign-in/page.css';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config'; 
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, userCredential, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const res = await signInWithEmailAndPassword(email, password);
      sessionStorage.setItem('user', true);
      console.log('Sign In Response:', res);
      // sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (e) {
      console.error('Sign In Error:', e);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      {error && <p className="error-message">Error: {error.message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signin-button" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
