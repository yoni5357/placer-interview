import { useState } from 'react';

interface POIFiltersProps {
  onSearch: (filters: {
    chain_name: string;
    dma: string;
    category: string;
    is_open: boolean;
  }) => void;
  chains: string[];
  dmas: string[];
  categories?: string[];
}

function POIFilters({ onSearch, chains, dmas }: POIFiltersProps) {
  const [chainName, setChainName] = useState('All');
  const [dma, setDma] = useState('All');
  const [isOpen, setIsOpen] = useState(true);

  const handleSearch = () => {
    onSearch({
      chain_name: chainName,
      dma,
      category: 'All',
      is_open: isOpen,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Chain Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chain
          </label>
          <select
            value={chainName}
            onChange={(e) => setChainName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            {chains.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </div>

        {/* DMA Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DMA
          </label>
          <select
            value={dma}
            onChange={(e) => setDma(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            {dmas.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Is Open Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Is Open
          </label>
          <div className="flex items-center h-[42px]">
            {/* <span className="mr-3 text-sm text-gray-700">All</span> */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isOpen ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isOpen ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div>
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default POIFilters;
