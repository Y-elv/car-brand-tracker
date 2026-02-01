import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-1 text-stone-500">
          You are logged in as <span className="font-medium text-primary-600">{user?.role}</span>.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/brands"
          className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md"
        >
          <span className="text-3xl">🏷️</span>
          <h2 className="mt-3 font-semibold text-stone-900 group-hover:text-primary-600">
            Car Brands
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {user?.role === 'ADMIN'
              ? 'Manage and create car brands'
              : 'View available car brands'}
          </p>
        </Link>

        {user?.role === 'USER' && (
          <Link
            to="/kilometers"
            className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-success-200 hover:shadow-md"
          >
            <span className="text-3xl">📏</span>
            <h2 className="mt-3 font-semibold text-stone-900 group-hover:text-success-600">
              My Kilometers
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Add kilometers and view totals per brand
            </p>
          </Link>
        )}

        {user?.role === 'ADMIN' && (
          <div className="rounded-xl border border-stone-200 bg-primary-50/50 p-6">
            <span className="text-3xl">👑</span>
            <h2 className="mt-3 font-semibold text-stone-900">Admin</h2>
            <p className="mt-1 text-sm text-stone-500">
              Create and delete car brands. Only admins can manage brands.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
