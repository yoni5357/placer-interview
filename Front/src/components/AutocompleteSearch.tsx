import { useState, useEffect, useRef } from 'react';
import type { AutocompleteResult, SelectedFilter } from '../types/autocomplete.types';
import { poisAPI } from '../services/api';

interface AutocompleteSearchProps {
  selectedFilters: SelectedFilter[];
  onAddFilter: (filter: SelectedFilter) => void;
  onRemoveFilter: (filter: SelectedFilter) => void;
}

const fieldColors: Record<string, string> = {
  name: 'bg-indigo-100 text-indigo-800',
  chain_name: 'bg-blue-100 text-blue-800',
  state_name: 'bg-green-100 text-green-800',
  state_code: 'bg-green-100 text-green-800',
  city: 'bg-orange-100 text-orange-800',
  street_address: 'bg-purple-100 text-purple-800',
};

function AutocompleteSearch({ selectedFilters, onAddFilter, onRemoveFilter }: AutocompleteSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await poisAPI.autocomplete(searchQuery);
        setResults(response.results);
        setShowDropdown(true);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (result: AutocompleteResult) => {
    onAddFilter(result);
    setSearchQuery('');
    setResults([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search POIs by name, chain, state, city, or address..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {loading && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
            {results.map((result, index) => (
              <div
                key={`${result.field}-${result.value}-${index}`}
                onClick={() => handleSelectResult(result)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0"
              >
                <span className="text-sm text-gray-900">{result.value}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${fieldColors[result.field]}`}>
                  {result.fieldLabel}
                </span>
              </div>
            ))}
          </div>
        )}

        {showDropdown && results.length === 0 && !loading && searchQuery.length >= 2 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No results found
            </div>
          </div>
        )}
      </div>

      {/* Selected Filters */}
      {selectedFilters.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected Filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.map((filter, index) => (
              <div
                key={`${filter.field}-${filter.value}-${index}`}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${fieldColors[filter.field]}`}
              >
                <span>{filter.value}</span>
                <button
                  onClick={() => onRemoveFilter(filter)}
                  className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AutocompleteSearch;
