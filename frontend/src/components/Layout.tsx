import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary-600 hover:text-primary-700"
          >
            <span className="text-2xl">🚗</span>
            Car Brand Tracker
          </Link>
          <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="rounded-lg px-3 py-2 text-stone-600 hover:bg-primary-50 hover:text-primary-700"
            >
              Dashboard
            </Link>
            <Link
              to="/brands"
              className="rounded-lg px-3 py-2 text-stone-600 hover:bg-primary-50 hover:text-primary-700"
            >
              Brands
            </Link>
            {user?.role === 'USER' && (
              <Link
                to="/kilometers"
                className="rounded-lg px-3 py-2 text-stone-600 hover:bg-primary-50 hover:text-primary-700"
              >
                My Kilometers
              </Link>
            )}
            <div className="ml-2 flex items-center gap-2 border-l border-stone-200 pl-4">
              <span className="hidden text-sm text-stone-500 sm:inline">
                {user?.name} <span className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-800">{user?.role}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-danger-500 px-3 py-2 text-sm font-medium text-white hover:bg-danger-600"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
