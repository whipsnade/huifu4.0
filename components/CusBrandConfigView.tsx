import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Building2, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerBrand {
  id: string;
  customerName: string;
  brands: string[];
}

const INITIAL_DATA: CustomerBrand[] = [
  {
    id: 'yum-1',
    customerName: 'YUM',
    brands: ['肯德基', '必胜客', '塔可贝尔', '东方既白']
  },
  {
    id: '1',
    customerName: '阿里巴巴',
    brands: ['淘宝', '天猫', '阿里云', '钉钉', '盒马', '闲鱼', '飞猪', '优酷']
  },
  {
    id: '2',
    customerName: '腾讯',
    brands: ['微信', 'QQ', '腾讯云', '腾讯游戏', '腾讯视频', '腾讯音乐']
  },
  {
    id: '3',
    customerName: '字节跳动',
    brands: ['抖音', '今日头条', '飞书', '西瓜视频', '懂车帝', '番茄小说']
  }
];

export const CusBrandConfigView: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerBrand[]>(INITIAL_DATA);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  
  // Modal states for adding customer
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerBrands, setNewCustomerBrands] = useState('');

  // Modal states for adding brand to existing customer
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [newBrandName, setNewBrandName] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const removeBrand = (customerId: string, brandToRemove: string) => {
    setCustomers(prev => prev.map(cust => {
      if (cust.id === customerId) {
        return {
          ...cust,
          brands: cust.brands.filter(brand => brand !== brandToRemove)
        };
      }
      return cust;
    }));
  };

  const handleAddCustomer = () => {
    if (!newCustomerName.trim()) return;
    
    const brands = newCustomerBrands.split(',').map(b => b.trim()).filter(b => b);
    
    const newCustomer: CustomerBrand = {
      id: Date.now().toString(),
      customerName: newCustomerName,
      brands: brands
    };
    
    setCustomers([...customers, newCustomer]);
    setIsAddCustomerModalOpen(false);
    setNewCustomerName('');
    setNewCustomerBrands('');
  };

  const handleAddBrand = () => {
    if (!newBrandName.trim() || !activeCustomerId) return;
    
    setCustomers(prev => prev.map(cust => {
      if (cust.id === activeCustomerId) {
        // Avoid duplicates
        if (cust.brands.includes(newBrandName.trim())) return cust;
        return {
          ...cust,
          brands: [...cust.brands, newBrandName.trim()]
        };
      }
      return cust;
    }));
    
    setIsAddBrandModalOpen(false);
    setNewBrandName('');
    setActiveCustomerId(null);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">用户品牌设置</h1>
          <p className="text-sm text-slate-500">管理客户及其关联的品牌信息,来源于用户中心</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {/* Add New Customer Card */}
        <button 
          onClick={() => setIsAddCustomerModalOpen(true)}
          className="h-full min-h-[280px] flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-emerald-50/50 hover:border-emerald-300 hover:text-emerald-600 text-slate-500 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Plus size={32} className="text-slate-400 group-hover:text-emerald-500" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg mb-1">新增客户及品牌</h3>
            <p className="text-sm opacity-70">点击添加新的客户信息</p>
          </div>
        </button>

        {/* Customer Cards */}
        {customers.map((customer) => {
          const isExpanded = expandedCards[customer.id];
          const displayBrands = isExpanded ? customer.brands : customer.brands.slice(0, 5);
          const hasMore = customer.brands.length > 5;

          return (
            <motion.div 
              layout
              key={customer.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-slate-900 leading-tight">{customer.customerName}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Tag size={12} />
                    共 {customer.brands.length} 个品牌
                  </p>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  <AnimatePresence>
                    {displayBrands.map((brand) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={brand}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 group"
                      >
                        <span>{brand}</span>
                        <button 
                          onClick={() => removeBrand(customer.id, brand)}
                          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 text-slate-400 transition-colors"
                          title="移除品牌"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                  {hasMore ? (
                    <button 
                      onClick={() => toggleExpand(customer.id)}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                    >
                      {isExpanded ? (
                        <>收起 <ChevronUp size={16} /></>
                      ) : (
                        <>查看更多 ({customer.brands.length - 5}) <ChevronDown size={16} /></>
                      )}
                    </button>
                  ) : (
                    <div /> // Spacer
                  )}
                  
                  <button 
                    onClick={() => {
                      setActiveCustomerId(customer.id);
                      setIsAddBrandModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                    title="添加品牌"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Customer Modal */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddCustomerModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">新增客户及品牌</h3>
              <button 
                onClick={() => setIsAddCustomerModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">客户名称</label>
                <input 
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="例如：百度"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  品牌名称 <span className="text-[10px] font-normal text-slate-400 ml-2">(多个品牌请用逗号分隔)</span>
                </label>
                <textarea 
                  value={newCustomerBrands}
                  onChange={(e) => setNewCustomerBrands(e.target.value)}
                  placeholder="例如：百度搜索, 百度地图, 爱奇艺"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddCustomerModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleAddCustomer}
                disabled={!newCustomerName.trim()}
                className="px-6 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm shadow-emerald-200"
              >
                保存
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Brand Modal */}
      {isAddBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddBrandModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">添加品牌</h3>
              <button 
                onClick={() => setIsAddBrandModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">品牌名称</label>
              <input 
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="请输入品牌名称"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddBrand();
                  }
                }}
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddBrandModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleAddBrand}
                disabled={!newBrandName.trim()}
                className="px-6 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm shadow-emerald-200"
              >
                添加
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
