import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Box, Tag, Layers, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSharedDeviceCategories } from '../lib/deviceCategoryStore';

const INITIAL_BRANDS = [
  '商米 (Sunmi)', '海信 (Hisense)', '爱普生 (Epson)', '惠普 (HP)', '联想 (Lenovo)', 
  '戴尔 (Dell)', '苹果 (Apple)', '华为 (Huawei)', '华硕 (ASUS)', '宏碁 (Acer)', 
  '得力 (Deli)', '斑马 (Zebra)', '新大陆 (Newland)', '客如云', '美团', 
  '中科英泰', '川田', '佳能 (Canon)', '兄弟 (Brother)', '极光'
];
const INITIAL_MODELS = [
  'Sunmi T2 PRO', 'Sunmi V2s', 'Hisense HK716', 'Epson TM-T82III', 'Epson TM-m30', 
  'HP ProBook 440', 'Lenovo ThinkPad T14', 'Dell Latitude 5420', 'MacBook Pro 14', 'MacBook Air M2', 
  'Huawei MateBook 14', 'ASUS ExpertBook', 'Acer TravelMate', 'Zebra ZD420', 'Zebra GK420t', 
  'Newland NLS-NVH200', 'Canon LBP2900', 'Brother HL-2240D', 'Deli DL-888C', '客如云 OnPOS'
];

interface ColumnProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  placeholder: string;
}

const ConfigColumn: React.FC<ColumnProps> = ({ title, icon, items, onAdd, onRemove, placeholder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState('');

  const displayItems = isExpanded ? items : items.slice(0, 5);
  const hasMore = items.length > 5;

  const handleAdd = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      onAdd(newItem.trim());
    }
    setNewItem('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">{title}</h3>
            <p className="text-xs text-slate-500 mt-1">共 {items.length} 项</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
          title={`新增${title}`}
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        {isAdding && (
          <div className="mb-4 flex gap-2">
            <input 
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
                if (e.key === 'Escape') setIsAdding(false);
              }}
            />
            <button 
              onClick={handleAdd}
              className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
            <button 
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              取消
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <AnimatePresence>
            {displayItems.map((item) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 group"
              >
                <span>{item}</span>
                <button 
                  onClick={() => onRemove(item)}
                  className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 text-slate-400 transition-colors"
                  title="移除"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-center border-t border-slate-100">
          {hasMore && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              {isExpanded ? (
                <>收起 <ChevronUp size={16} /></>
              ) : (
                <>查看更多 ({items.length - 5}) <ChevronDown size={16} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const DeviceCategoryAndBrandConfig: React.FC = () => {
  const { categories, setCategories } = useSharedDeviceCategories();
  const [brands, setBrands] = useState<string[]>(INITIAL_BRANDS);
  const [models, setModels] = useState<string[]>(INITIAL_MODELS);

  const [searchCategory, setSearchCategory] = useState('');
  const [searchBrand, setSearchBrand] = useState('');
  const [searchModel, setSearchModel] = useState('');

  const filteredCategories = categories.filter(c => c.toLowerCase().includes(searchCategory.toLowerCase()));
  const filteredBrands = brands.filter(b => b.toLowerCase().includes(searchBrand.toLowerCase()));
  const filteredModels = models.filter(m => m.toLowerCase().includes(searchModel.toLowerCase()));

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">设备类型与品牌配置</h1>
          <p className="text-sm text-slate-500">统一管理系统中的设备分类、品牌及型号信息</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索设备类型..." 
              value={searchCategory} 
              onChange={e => setSearchCategory(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
            />
          </div>
          <div className="relative w-full md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索品牌..." 
              value={searchBrand} 
              onChange={e => setSearchBrand(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
            />
          </div>
          <div className="relative w-full md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索型号..." 
              value={searchModel} 
              onChange={e => setSearchModel(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ConfigColumn 
          title="设备类型" 
          icon={<Box size={20} />} 
          items={filteredCategories} 
          onAdd={(item) => setCategories([...categories, item])}
          onRemove={(item) => setCategories(categories.filter(c => c !== item))}
          placeholder="例如：平板电脑"
        />
        
        <ConfigColumn 
          title="设备品牌" 
          icon={<Tag size={20} />} 
          items={filteredBrands} 
          onAdd={(item) => setBrands([...brands, item])}
          onRemove={(item) => setBrands(brands.filter(b => b !== item))}
          placeholder="例如：小米 (Xiaomi)"
        />
        
        <ConfigColumn 
          title="设备型号" 
          icon={<Layers size={20} />} 
          items={filteredModels} 
          onAdd={(item) => setModels([...models, item])}
          onRemove={(item) => setModels(models.filter(m => m !== item))}
          placeholder="例如：Xiaomi Pad 6"
        />
      </div>
    </div>
  );
};
