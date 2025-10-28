import { useState, useEffect } from 'react';
import POIFilters from '../components/POIFilters';
import POITable from '../components/POITable';
import Pagination from '../components/Pagination';
import { poisAPI } from '../services/api';
import type { POI } from '../types/poi.types';

function POIs() {
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;
  
  // Filter state
  const [filters, setFilters] = useState({
    chain_name: 'All',
    dma: 'All',
    category: 'All',
    is_open: true,
  });
  
  // Filter options (extracted from data)
  const [chains, setChains] = useState<string[]>([]);
  const [dmas, setDmas] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch POIs
  const fetchPOIs = async (page: number, currentFilters: typeof filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await poisAPI.getPOIs({
        page,
        limit,
        chain_name: currentFilters.chain_name,
        dma: currentFilters.dma,
        category: currentFilters.category,
        is_open: currentFilters.is_open,
      });
      
      setPois(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options from initial data
  const fetchFilterOptions = async () => {
    try {
      const options = await poisAPI.getFilterOptions();
      
      setChains(options.chains);
      setDmas(options.dmas);
      setCategories(options.categories);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFilterOptions();
    fetchPOIs(1, filters);
  }, []);

  // Handle search
  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchPOIs(1, newFilters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPOIs(page, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Points of Interest</h1>
      
      <POIFilters
        onSearch={handleSearch}
        chains={chains}
        dmas={dmas}
        categories={categories}
      />
      
      <POITable pois={pois} loading={loading} />
      
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default POIs;
