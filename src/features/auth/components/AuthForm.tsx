import { useState } from 'react';
import { useLoginMutation, useRegisterMutation } from '../services/authApi';
import type { LoginRequest, RegisterRequest } from '../types/Auth';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials } from '../slices/authSlice';

type Props = {
  mode: 'login' | 'register';
};

export default function AuthForm({ mode }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        email: form.email,
        password: form.password,
        ...(mode === 'register' && { name: form.name })
      };

      const result = await (mode === 'login'
        ? login(payload as LoginRequest).unwrap()
        : register(payload as RegisterRequest).unwrap());

        
      // Save token and user locally and in redux store
      dispatch(setCredentials(result));

      console.log('Auth success:', result);
      navigate('/');
    } catch (err: any) {
      alert(err.data?.error || 'Authentication failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'register' && (
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="input w-full"
        />
      )}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="input w-full"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="input w-full"
      />
      <button
        type="submit"
        className="w-full bg-primary-2 hover:bg-primary-1 py-2 rounded text-sm font-medium"
      >
        {mode === 'login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
}
