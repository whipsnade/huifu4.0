import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  X, 
  Map as MapIcon, 
  Search,
  Plus,
  HelpCircle,
  Bell,
  Settings,
  User,
  Info,
  Flag,
  Briefcase
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CustomerRegion } from '../types';

interface Territory {
  id: string;
  name: string;
  type: 'continent' | 'country' | 'state' | 'city';
  children?: Territory[];
  isFallback?: boolean;
}

const GLOBAL_DIRECTORY: Territory[] = [
  {
    id: 'africa',
    name: 'Africa',
    type: 'continent',
    children: [
      { id: 'egypt', name: 'Egypt', type: 'country' },
      { id: 'nigeria', name: 'Nigeria', type: 'country' },
    ]
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    type: 'continent',
    children: []
  },
  {
    id: 'europe',
    name: 'Europe',
    type: 'continent',
    children: [
      { id: 'france', name: 'France', type: 'country' },
      { id: 'germany', name: 'Germany', type: 'country' },
      { id: 'italy', name: 'Italy', type: 'country' },
      { id: 'spain', name: 'Spain', type: 'country' },
      { id: 'uk', name: 'United Kingdom', type: 'country' },
    ]
  },
  {
    id: 'asia',
    name: 'Asia',
    type: 'continent',
    children: [
      { id: 'china', name: 'China', type: 'country' },
      { id: 'japan', name: 'Japan', type: 'country' },
      { id: 'thailand', name: 'Thailand', type: 'country' },
      { id: 'north korea', name: 'North Korea', type: 'country' },
      { id: 'korea', name: 'Korea', type: 'country' },
      { id: 'singapore', name: 'Singapore', type: 'country' },
    ]
  },
  {
    id: 'na',
    name: 'North America',
    type: 'continent',
    children: [
      { id: 'usa', name: 'United States', type: 'country' },
      { id: 'canada', name: 'Canada', type: 'country' },
    ]
  }
];

const TERRITORY_DETAILS: Record<string, Territory> = {
  'usa': {
    id: 'usa',
    name: 'United States',
    type: 'country',
    children: [
      {
        id: 'ca',
        name: 'California',
        type: 'state',
        children: [
          { id: 'sf', name: 'San Francisco', type: 'city' },
          { id: 'la', name: 'Los Angeles', type: 'city' },
          { id: 'sd', name: 'San Diego', type: 'city' },
        ]
      },
      {
        id: 'tx',
        name: 'Texas',
        type: 'state',
        children: [
          { id: 'aus', name: 'Austin', type: 'city' },
          { id: 'hou', name: 'Houston', type: 'city' },
        ]
      }
    ]
  },
  'germany': {
    id: 'germany',
    name: 'Germany',
    type: 'country',
    children: [
      {
        id: 'bavaria',
        name: 'Bavaria',
        type: 'state',
        children: [
          { id: 'munich', name: 'Munich', type: 'city' },
          { id: 'nuremberg', name: 'Nuremberg', type: 'city' },
        ]
      },
      {
        id: 'berlin_s',
        name: 'Berlin State',
        type: 'state',
        children: [
          { id: 'berlin_c', name: 'Berlin', type: 'city' },
        ]
      }
    ]
  },
  'france': {
    id: 'france',
    name: 'France',
    type: 'country',
    children: [
      {
        id: 'idf',
        name: 'Île-de-France',
        type: 'state',
        children: [
          { id: 'paris', name: 'Paris', type: 'city' },
          { id: 'versailles', name: 'Versailles', type: 'city' },
        ]
      }
    ]
  },
  'uk': {
    id: 'uk',
    name: 'United Kingdom',
    type: 'country',
    children: [
      {
        id: 'england',
        name: 'England',
        type: 'state',
        children: [
          { id: 'london', name: 'London', type: 'city' },
          { id: 'manchester', name: 'Manchester', type: 'city' },
        ]
      }
    ]
  },
  'china': {
    id: 'china',
    name: 'China',
    type: 'country',
    children: [
      {
        id: 'guangdong',
        name: 'Guangdong',
        type: 'state',
        children: [
          { id: 'guangzhou', name: 'Guangzhou', type: 'city' },
          { id: 'shenzhen', name: 'Shenzhen', type: 'city' },
        ]
      },
      {
        id: 'shanghai_s',
        name: 'Shanghai',
        type: 'state',
        children: [
          { id: 'shanghai_c', name: 'Shanghai', type: 'city' },
        ]
      }
    ]
  },
  'japan': {
    id: 'japan',
    name: 'Japan',
    type: 'country',
    children: [
      {
        id: 'kanto',
        name: 'Kanto',
        type: 'state',
        children: [
          { id: 'tokyo', name: 'Tokyo', type: 'city' },
          { id: 'yokohama', name: 'Yokohama', type: 'city' },
        ]
      }
    ]
  }
};

interface CountryCheckboxProps {
  id: string;
  name: string;
  isSelected: boolean;
  onToggle: (id: string, name: string) => void;
  key?: string | number;
}

function CountryCheckbox({ id, name, isSelected, onToggle }: CountryCheckboxProps) {
  return (
    <div 
      onClick={() => onToggle(id, name)}
      className={cn(
        "w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-all cursor-pointer group",
        isSelected ? "bg-indigo-50/50 text-indigo-700" : "text-slate-500 hover:bg-slate-100"
      )}
    >
      <div className={cn(
        "w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0",
        isSelected ? "bg-indigo-600 border-indigo-600 shadow-sm" : "bg-white border-slate-300 group-hover:border-indigo-400"
      )}>
        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
      </div>
      <span className={cn("font-medium", isSelected && "font-bold")}>{name}</span>
    </div>
  );
}

interface GlobalRegionConfigProps {
  onSave?: (region: Omit<CustomerRegion, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  initialData?: CustomerRegion | null;
}

export default function GlobalRegionConfig({ onSave, onCancel, initialData }: GlobalRegionConfigProps) {
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [regionName, setRegionName] = useState(initialData?.regionName || '');
  const [markets, setMarkets] = useState<string[]>(initialData?.markets || []);
  const [marketInput, setMarketInput] = useState('');
  const [continentCountry, setContinentCountry] = useState(initialData?.continentCountry || '');
  const [selectedCountry, setSelectedCountry] = useState<{id: string, name: string} | null>(
    initialData?.country || null
  );
  
  const [countrySearch, setCountrySearch] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Flattened directory for search
  const flattenedCountries = useMemo(() => {
    const list: { id: string, name: string, continent: string }[] = [];
    GLOBAL_DIRECTORY.forEach(continent => {
      continent.children?.forEach(country => {
        list.push({ id: country.id, name: country.name, continent: continent.name });
      });
    });
    return list;
  }, []);

  const searchResults = useMemo(() => {
    if (!countrySearch.trim()) return [];
    return flattenedCountries.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.continent.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch, flattenedCountries]);

  const removeCountry = () => {
    setSelectedCountry(null);
    setContinentCountry('');
  };

  const handleSelectCountry = (country: {id: string, name: string, continent: string}) => {
    setContinentCountry(`${country.continent}/${country.name}`);
    setSelectedCountry({ id: country.id, name: country.name });
    setCountrySearch('');
    setShowSearchSuggestions(false);
  };

  const addMarket = () => {
    const trimmed = marketInput.trim();
    if (trimmed && !markets.includes(trimmed)) {
      setMarkets(prev => [...prev, trimmed]);
      setMarketInput('');
    }
  };

  const removeMarket = (m: string) => {
    setMarkets(prev => prev.filter(market => market !== m));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        customerName,
        regionName,
        markets,
        continentCountry,
        country: selectedCountry || undefined,
      });
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-50 overflow-hidden font-sans">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-12">
              <div className="mb-10">
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Region Configuration</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Configure region settings, markets, and country mappings for this customer.
                </p>
              </div>

              <div className="space-y-10">
                {/* Inputs Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/80 border border-slate-200 rounded-3xl p-10 shadow-sm">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block pl-1">客户名称 (Customer Name)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 text-lg font-medium bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                        placeholder="输入客户名称..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block pl-1">区域名称 (Region Name)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Globe className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={regionName}
                        onChange={(e) => setRegionName(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 text-lg font-medium bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                        placeholder="输入区域名称..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block pl-1">洲名/国家 (Continent/Country)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={countrySearch || continentCountry}
                        onFocus={() => setShowSearchSuggestions(true)}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 text-lg font-medium bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                        placeholder="搜索国家 (如: China)..."
                      />
                      
                      {showSearchSuggestions && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          {searchResults.map(country => (
                            <button
                              key={country.id}
                              onClick={() => handleSelectCountry(country)}
                              className="w-full flex items-center justify-between px-6 py-3 hover:bg-indigo-50 text-left transition-colors group"
                            >
                              <div>
                                <span className="font-bold text-slate-900 group-hover:text-indigo-700">{country.name}</span>
                                <span className="text-xs text-slate-400 ml-2">({country.continent})</span>
                              </div>
                              <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block pl-1">市场 (Markets)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Flag className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={marketInput}
                        onChange={(e) => setMarketInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addMarket();
                          }
                        }}
                        className="w-full h-14 pl-12 pr-12 text-lg font-medium bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                        placeholder="输入市场名称并回车..."
                      />
                      <button
                        onClick={addMarket}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                    {markets.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pl-1">
                        {markets.map(m => (
                          <span key={m} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                            {m}
                            <X className="w-3 h-3 cursor-pointer hover:text-indigo-900" onClick={() => removeMarket(m)} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Country Section */}
                {selectedCountry && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between px-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">已选国家 (Selected Country)</label>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div 
                        className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-3 rounded-2xl border border-indigo-100 shadow-sm animate-in zoom-in duration-300 group hover:border-indigo-300 transition-all"
                      >
                        <Globe className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-bold tracking-tight">{selectedCountry.name}</span>
                        <button 
                          className="p-1 hover:bg-red-100 hover:text-red-500 rounded-full transition-all ml-1"
                          onClick={removeCountry}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Local Footer */}
          <footer className="h-20 bg-slate-100 border-t border-slate-200 flex items-center justify-between px-12 shrink-0">
            <div className="text-xs text-slate-400 font-medium italic">
              © 2024 Nexus Workflow Architecture
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={onCancel}
                className="px-10 py-3 text-sm font-bold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-10 py-3 text-sm font-bold text-white bg-indigo-700 rounded-lg shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all min-w-[200px]"
              >
                Save Configuration
              </button>
            </div>
          </footer>
        </div>
      </div>
    );
}

function Check({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
