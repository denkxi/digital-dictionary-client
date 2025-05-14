import { useState } from 'react';
import AuthForm from './components/AuthForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-xl rounded-3xl space-y-6 transition-all">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold text-title">
          {mode === 'login' ? 'Welcome Back 👋' : 'Create an Account 🚀'}
        </h1>
        <p className="text-sm text-gray-600">
          {mode === 'login'
            ? 'Sign in to continue learning.'
            : 'Start your vocabulary journey now.'}
        </p>
      </div>

      <AuthForm mode={mode} />

      <div className="text-center text-sm text-gray-600">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setMode('register')}
              className="text-primary-2 hover:underline font-medium cursor-pointer transition"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-primary-2 hover:underline font-medium cursor-pointer transition"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
