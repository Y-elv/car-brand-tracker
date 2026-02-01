import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { brandsApi, kilometersApi } from '../api/client';
import type { CarBrand, KilometerEntry, TotalByBrand } from '../types';

export default function Kilometers() {
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [entries, setEntries] = useState<KilometerEntry[]>([]);
  const [totals, setTotals] = useState<TotalByBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'entries' | 'totals'>('add');

  const fetchData = async () => {
    try {
      setError('');
      const [brandsRes, entriesRes, totalsRes] = await Promise.all([
        brandsApi.list(),
        kilometersApi.myEntries(),
        kilometersApi.totals(),
      ]);
      setBrands(brandsRes.data.data || []);
      setEntries(entriesRes.data.data || []);
      setTotals(totalsRes.data.data || []);
      if (!selectedBrandId && (brandsRes.data.data?.length)) {
        setSelectedBrandId((brandsRes.data.data as CarBrand[])[0]._id);
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to load data';
      const message = msg || 'Failed to load data';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const km = Number(kilometers);
    if (!selectedBrandId || isNaN(km) || km < 0) return;
    setSubmitting(true);
    setError('');
    try {
      await kilometersApi.add(selectedBrandId, km);
      setKilometers('');
      await fetchData();
      toast.success('Kilometers added successfully');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to add';
      const message = msg || 'Failed to add';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
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
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">My Kilometers</h1>

      {error && (
        <div className="rounded-lg bg-danger-50 px-4 py-3 text-sm text-danger-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab('add')}
          className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'add'
              ? 'border border-b-0 border-stone-200 bg-white text-primary-600'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Add kilometers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('entries')}
          className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'entries'
              ? 'border border-b-0 border-stone-200 bg-white text-primary-600'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          My entries
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('totals')}
          className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'totals'
              ? 'border border-b-0 border-stone-200 bg-white text-primary-600'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Totals by brand
        </button>
      </div>

      {activeTab === 'add' && (
        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-stone-900">Add kilometers</h2>
          <form onSubmit={handleAdd} className="mt-4 space-y-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-stone-700">
                Brand
              </label>
              <select
                id="brand"
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
              >
                <option value="">Select a brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="km" className="block text-sm font-medium text-stone-700">
                Kilometers
              </label>
              <input
                id="km"
                type="number"
                min="0"
                step="0.01"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
                required
                placeholder="e.g. 150"
                className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-success-500 px-4 py-2.5 font-medium text-white hover:bg-success-600 disabled:opacity-60"
            >
              {submitting ? 'Adding…' : 'Add'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'entries' && (
        <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-stone-700 sm:px-6">
                    Brand
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-stone-700 sm:px-6">
                    Kilometers
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-stone-700 sm:px-6">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-stone-500 sm:px-6">
                      No entries yet. Add kilometers above.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-stone-50">
                      <td className="px-4 py-3 text-stone-900 sm:px-6 font-medium">
                        {typeof entry.brand === 'object' ? entry.brand.name : entry.brand}
                      </td>
                      <td className="px-4 py-3 text-stone-700 sm:px-6">{entry.kilometers}</td>
                      <td className="px-4 py-3 text-stone-500 text-sm sm:px-6">
                        {entry.createdAt
                          ? new Date(entry.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'totals' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {totals.length === 0 ? (
            <p className="col-span-full rounded-xl border border-stone-200 bg-white p-8 text-center text-stone-500">
              No totals yet. Add kilometers to see totals per brand.
            </p>
          ) : (
            totals.map((t) => (
              <div
                key={t.brandId}
                className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"
              >
                <p className="text-sm font-medium text-stone-500">{t.brandName}</p>
                <p className="mt-1 text-2xl font-bold text-success-600">
                  {t.totalKilometers.toLocaleString()} km
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
