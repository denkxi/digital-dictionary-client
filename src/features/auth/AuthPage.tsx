import { useState } from 'react';
import AuthForm from './components/AuthForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-1/10 to-accent-1/10 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl space-y-6 transition-all">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-title mb-2">
            {mode === 'login' ? 'Welcome Back 👋' : 'Join Digital Dictionary 🚀'}
          </h1>
          <p className="text-gray-600 text-sm">
            {mode === 'login'
              ? 'Sign in to continue building your vocabulary.'
              : 'Create an account to start mastering words.'}
          </p>
        </div>

        <AuthForm mode={mode} />

        <div className="text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-primary-2 hover:underline font-medium transition cursor-pointer"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-primary-2 hover:underline font-medium transition cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
