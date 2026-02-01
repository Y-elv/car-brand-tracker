import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name, role);
      toast.success('Account created successfully');
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Registration failed';
      const message = msg || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-success-50 via-stone-50 to-primary-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-6 text-center">
            <span className="text-4xl">🚗</span>
            <h1 className="mt-2 text-2xl font-bold text-stone-900">Create account</h1>
            <p className="mt-1 text-stone-500">Register for Car Brand Tracker</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-danger-50 px-4 py-3 text-sm text-danger-700">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-stone-700">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
              >
                <option value="USER">User (track kilometers)</option>
                <option value="ADMIN">Admin (manage brands)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-success-500 px-4 py-3 font-medium text-white hover:bg-success-600 focus:ring-2 focus:ring-success-300 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
