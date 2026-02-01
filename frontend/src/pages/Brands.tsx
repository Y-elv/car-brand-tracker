import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { brandsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { CarBrand } from '../types';

export default function Brands() {
  const { user } = useAuth();
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = user?.role === 'ADMIN';

  const fetchBrands = async () => {
    try {
      setError('');
      const { data } = await brandsApi.list();
      setBrands(data.data || []);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to load brands';
      const message = msg || 'Failed to load brands';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await brandsApi.create(newName.trim());
      setNewName('');
      await fetchBrands();
      toast.success('Brand added successfully');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to create brand';
      const message = msg || 'Failed to create brand';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    setDeletingId(id);
    try {
      await brandsApi.delete(id);
      await fetchBrands();
      toast.success('Brand deleted successfully');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to delete';
      const message = msg || 'Failed to delete';
      setError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Car Brands</h1>
      </div>


      {isAdmin && (
        <form onSubmit={handleCreate} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-stone-900">Add new brand</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="brand-name" className="block text-sm font-medium text-stone-700">
                Brand name
              </label>
              <input
                id="brand-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Toyota"
                className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newName.trim()}
              className="rounded-lg bg-primary-500 px-4 py-2.5 font-medium text-white hover:bg-primary-600 disabled:opacity-60"
            >
              {submitting ? 'Adding…' : 'Add brand'}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-stone-700 sm:px-6">
                  Brand
                </th>
                {isAdmin && (
                  <th scope="col" className="relative px-4 py-3 sm:px-6">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 2 : 1} className="px-4 py-8 text-center text-stone-500 sm:px-6">
                    No brands yet. {isAdmin ? 'Add one above.' : 'Admins will add brands.'}
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 text-stone-900 sm:px-6 font-medium">{brand.name}</td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right sm:px-6">
                        <button
                          type="button"
                          onClick={() => handleDelete(brand._id)}
                          disabled={deletingId === brand._id}
                          className="rounded-lg bg-danger-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-danger-600 disabled:opacity-60"
                        >
                          {deletingId === brand._id ? 'Deleting…' : 'Delete'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
