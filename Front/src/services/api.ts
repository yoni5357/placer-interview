import type { POIFilters, POIResponse } from '../types/poi.types';

const API_BASE_URL = 'http://localhost:3000/api';

export const poisAPI = {
  async getPOIs(filters: POIFilters): Promise<POIResponse> {
    const params = new URLSearchParams();
    
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());
    
    if (filters.chain_name && filters.chain_name !== 'All') {
      params.append('chain_name', filters.chain_name);
    }
    
    if (filters.dma && filters.dma !== 'All') {
      params.append('dma', filters.dma);
    }
    
    if (filters.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    
    if (filters.is_open !== undefined) {
      params.append('is_open', filters.is_open.toString());
    }
    
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
};
