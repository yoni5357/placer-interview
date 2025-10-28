import { useState, useEffect } from 'react';
import AutocompleteSearch from '../components/AutocompleteSearch';
import POIFilters from '../components/POIFilters';
import POITable from '../components/POITable';
import Pagination from '../components/Pagination';
import { poisAPI } from '../services/api';
import type { POI } from '../types/poi.types';
import type { SelectedFilter } from '../types/autocomplete.types';

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
  
  // Autocomplete selected filters
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);
  
  // Filter options (extracted from data)
  const [chains, setChains] = useState<string[]>([]);
  const [dmas, setDmas] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch POIs
  const fetchPOIs = async (page: number, currentFilters: typeof filters, autocompleteFilters: SelectedFilter[]) => {
    try {
      setLoading(true);
      setError(null);
      
      // Combine manual filters with autocomplete filters
      const combinedFilters: any = {
        page,
        limit,
        is_open: currentFilters.is_open,
      };
      
      // Add manual filters if not "All"
      if (currentFilters.chain_name !== 'All') {
        combinedFilters.chain_name = currentFilters.chain_name;
      }
      if (currentFilters.dma !== 'All') {
        combinedFilters.dma = currentFilters.dma;
      }
      if (currentFilters.category !== 'All') {
        combinedFilters.category = currentFilters.category;
      }
      
      // Group autocomplete filters by field
      const grouped: Record<string, string[]> = {};
      autocompleteFilters.forEach(filter => {
        if (!grouped[filter.field]) {
          grouped[filter.field] = [];
        }
        grouped[filter.field].push(filter.value);
      });
      
      // Add grouped autocomplete filters to combined filters
      Object.keys(grouped).forEach(field => {
        combinedFilters[field] = grouped[field];
      });
      
      console.log('Sending filters to API:', combinedFilters);
      
      const response = await poisAPI.getPOIs(combinedFilters);
      
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
    fetchPOIs(1, filters, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle autocomplete filter add
  const handleAddFilter = (filter: SelectedFilter) => {
    setSelectedFilters(prev => [...prev, filter]);
  };

  // Handle autocomplete filter remove
  const handleRemoveFilter = (filterToRemove: SelectedFilter) => {
    setSelectedFilters(prev => 
      prev.filter(f => !(f.field === filterToRemove.field && f.value === filterToRemove.value))
    );
  };

  // Handle search
  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchPOIs(1, newFilters, selectedFilters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPOIs(page, filters, selectedFilters);
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
      
      <AutocompleteSearch
        selectedFilters={selectedFilters}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
      />
      
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
