import type { POIFilters, POIResponse } from '../types/poi.types';
import type { AutocompleteResult } from '../types/autocomplete.types';

const API_BASE_URL = 'http://localhost:3000/api';

export const poisAPI = {
  async getPOIs(filters: any): Promise<POIResponse> {
    const params = new URLSearchParams();
    
    // Handle all filter properties dynamically
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      
      if (value === undefined || value === null || value === 'All') {
        return;
      }
      
      if (Array.isArray(value)) {
        // For arrays, append each value with the same key
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, value.toString());
      }
    });
    
    console.log('API URL:', `${API_BASE_URL}/pois?${params.toString()}`);
    
    const response = await fetch(`${API_BASE_URL}/pois?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch POIs');
    }
    
    return response.json();
  },

  async getFilterOptions(): Promise<{
    chains: string[];
    dmas: string[];
    categories: string[];
  }> {
    const response = await fetch(`${API_BASE_URL}/pois/filters`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch filter options');
    }
    
    return response.json();
  },

  async autocomplete(query: string): Promise<{ results: AutocompleteResult[] }> {
    const response = await fetch(`${API_BASE_URL}/pois/autocomplete?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch autocomplete results');
    }
    
    return response.json();
  },
};
