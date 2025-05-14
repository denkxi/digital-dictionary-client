import { useForm } from 'react-hook-form';
import { useLoginMutation, useRegisterMutation } from '../services/authApi';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials } from '../slices/authSlice';
import InputField from '../../../shared/components/InputField';
import Button from '../../../shared/components/Button';
import { LoginRequest, RegisterRequest } from '../types/Auth';

type Props = {
  mode: 'login' | 'register';
};

type FormValues = {
  name?: string;
  email: string;
  password: string;
};

export default function AuthForm({ mode }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();
  const [registerUser] = useRegisterMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      const payload =
        mode === 'login'
          ? { email: data.email, password: data.password }
          : { name: data.name!, email: data.email, password: data.password };

      const result = await (mode === 'login'
        ? login(payload as LoginRequest).unwrap()
        : registerUser(payload as RegisterRequest).unwrap());

      dispatch(setCredentials(result));
      navigate('/');
    } catch (err: any) {
      alert(err.data?.error || 'Authentication failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mode === 'register' && (
        <>
          <InputField
            label="Name"
            type="text"
            register={register('name', { required: true })}
            value={watch('name')}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">Name is required</p>
          )}
        </>
      )}

      <InputField
        label="Email"
        type="email"
        register={register('email', { required: true })}
        value={watch('email')}
      />
      {errors.email && (
        <p className="text-xs text-red-500 mt-1">Email is required</p>
      )}

      <InputField
        label="Password"
        type="password"
        register={register('password', { required: true })}
        value={watch('password')}
      />
      {errors.password && (
        <p className="text-xs text-red-500 mt-1">Password is required</p>
      )}

      <Button type="submit" className="w-full mt-2">
        {mode === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  );
}
