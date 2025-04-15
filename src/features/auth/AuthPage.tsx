import { useState } from 'react';
import AuthForm from './components/AuthForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-text">
        {mode === 'login' ? 'Sign In' : 'Sign Up'}
      </h1>

      <AuthForm mode={mode} />

      <p className="text-sm mt-4 text-gray-600 text-center">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => setMode('register')}
              className="text-primary-2 hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-primary-2 hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
