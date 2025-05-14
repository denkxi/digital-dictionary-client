import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import AuthPage from '../../features/auth/AuthPage';
import authReducer from '../../features/auth/slices/authSlice';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../features/auth/types/Auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const mockAuthApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
      login: builder.mutation<AuthResponse, LoginRequest>({
        query: (credentials) => ({
          url: '/auth/login',
          method: 'POST',
          body: credentials
        })
      }),
      register: builder.mutation<AuthResponse, RegisterRequest>({
        query: (user) => ({
          url: '/auth/register',
          method: 'POST',
          body: user
        })
      })
    })
  });

  jest.mock('../../features/auth/services/authApi', () => ({
    authApi: {
      reducerPath: 'authApi',
      reducer: jest.fn(),
      middleware: jest.fn(),
      endpoints: {
        login: {},
        register: {}
      }
    },
    useLoginMutation: () => [
      jest.fn().mockImplementation((credentials) => 
        credentials.email === 'test@example.com' && credentials.password === 'password123'
          ? Promise.resolve({ 
              user: { id: '1', name: 'Test User', email: 'test@example.com' },
              token: 'fake-jwt-token'
            })
          : Promise.reject({ data: { error: 'Invalid credentials' } })
      ),
      { isLoading: false }
    ],
    useRegisterMutation: () => [
      jest.fn().mockImplementation((user) => 
        user.email && user.password && user.name
          ? Promise.resolve({
              user: { id: '2', name: user.name, email: user.email },
              token: 'fake-jwt-token'
            })
          : Promise.reject({ data: { error: 'Missing required fields' } })
      ),
      { isLoading: false }
    ]
  }));

// Mock the API responses
const server = setupServer(
    // Mock login endpoint
    http.post('/auth/login', async ({ request }) => {
      const body = await request.json() as LoginRequest;
      
      if (body.email === 'test@example.com' && body.password === 'password123') {
        return HttpResponse.json({
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com'
          },
          token: 'fake-jwt-token'
        });
      } else {
        return new HttpResponse(
          JSON.stringify({ error: 'Invalid credentials' }),
          { status: 401 }
        );
      }
    }),
    
    // Mock register endpoint
    http.post('/auth/register', async ({ request }) => {
      const body = await request.json() as RegisterRequest;
      
      if (body.email && body.password && body.name) {
        return HttpResponse.json({
          user: {
            id: '2',
            name: body.name,
            email: body.email
          },
          token: 'fake-jwt-token'
        });
      } else {
        return new HttpResponse(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400 }
        );
      }
    })
  );
  
  // Setup store for testing
  const createTestStore = () => 
    configureStore({
      reducer: {
        auth: authReducer,
        [mockAuthApi.reducerPath]: mockAuthApi.reducer
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(mockAuthApi.middleware)
    });
  
  // Wrap component with necessary providers
  const renderWithProviders = (ui: React.ReactElement) => {
    const store = createTestStore();
    return {
      ...render(
        <Provider store={store}>
          <BrowserRouter>
            {ui}
          </BrowserRouter>
        </Provider>
      ),
      store
    };
  };

// Start server before all tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

describe('AuthPage Integration Tests', () => {
  test('renders login form by default', () => {
    renderWithProviders(<AuthPage />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue learning.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  test('switches to register form when "Sign up" is clicked', () => {
    renderWithProviders(<AuthPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
    expect(screen.getByText('Start your vocabulary journey now.')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('switches back to login form when "Sign in" is clicked', () => {
    renderWithProviders(<AuthPage />);
    
    // First switch to register
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    // Then switch back to login
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue learning.')).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty login form', async () => {
    renderWithProviders(<AuthPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('shows validation errors when submitting empty register form', async () => {
    renderWithProviders(<AuthPage />);
    
    // Switch to register
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('successful login redirects user', async () => {
    // Mock the navigate function
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));
    
    renderWithProviders(<AuthPage />);
    
    // Fill login form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('successful registration redirects user', async () => {
    // Mock the navigate function
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));
    
    renderWithProviders(<AuthPage />);
    
    // Switch to register
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Fill register form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'New User' }
    });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'newuser@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'newpassword123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('displays error message on failed login', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    renderWithProviders(<AuthPage />);
    
    // Fill login form with invalid credentials
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Invalid credentials');
    });
    
    alertMock.mockRestore();
  });
});
