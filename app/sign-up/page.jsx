'use client'
import { useState } from 'react';
import '../../app/sign-up/page.css';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import Link from 'next/link';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', true);
      }
      setEmail('');
      setPassword('');
      // Redirect to home or another page if needed
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
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
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <p className="signup-link">
        Already have an account? <Link className='link' href="/sign-in">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
