import React, { useState } from 'react';
import { Plus, X, Copy, Trash2, Building2, Edit2, Check, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_SYS_CLOSURE_DATA, DEFAULT_SOLUTIONS } from './ClosedCaseCategoryAndSolutionConfigView';

interface CustomerClosureCategory {
  typeName: string;
  solutions: string[];
}

interface CusClosureConfig {
  id: string;
  customerName: string;
  categories: CustomerClosureCategory[]; 
}

const INITIAL_CUS_DATA: CusClosureConfig[] = [
  {
    id: 'cus-yum',
    customerName: 'YUM',
    categories: [
      { typeName: '驻场结案', solutions: ['硬件更换', '主板维修', '打印机清理'] },
      { typeName: '远程处理', solutions: ['软件重装', '远程重启'] },
      { typeName: '电话结案', solutions: ['指导调试'] }
    ]
  },
  {
    id: 'cus1',
    customerName: '星巴克',
    categories: [
      { typeName: '驻场结案', solutions: ['保外更换', '硬件维修', '硬件调试'] },
      { typeName: '远程处理', solutions: ['软件调试', '重启设备'] },
      { typeName: '电话结案', solutions: ['电话指导', '密码重置'] },
      { typeName: '无效报修', solutions: ['误报', '重复派单'] }
    ]
  },
  {
    id: 'cus2',
    customerName: '麦当劳',
    categories: [
      { typeName: '驻场结案', solutions: ['保外更换', '清洁设备', '重新插拔'] },
      { typeName: '远程处理', solutions: ['软件调试', '重启设备', '远程结案'] },
      { typeName: '电话结案', solutions: ['电话结案'] },
      { typeName: '无效报修', solutions: ['无效报修故障'] }
    ]
  }
];

export const CusClosedCaseCategoryAndSolutionConfigView: React.FC = () => {
  const [configs, setConfigs] = useState<CusClosureConfig[]>(INITIAL_CUS_DATA);

  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({});

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newConfigForm, setNewConfigForm] = useState({ customerName: '' });

  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [configToCopy, setConfigToCopy] = useState<CusClosureConfig | null>(null);
  const [copyCustomerName, setCopyCustomerName] = useState('');

  // Inline Edits
  const [editingCustomerCardId, setEditingCustomerCardId] = useState<string | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');

  // Adding category
  const [addingCategoryFor, setAddingCategoryFor] = useState<string | null>(null);
  const [newCategoryValue, setNewCategoryValue] = useState('');

  // Adding Solution
  const [addingSolutionFor, setAddingSolutionFor] = useState<{configId: string, categoryName: string} | null>(null);
  const [newSolutionValue, setNewSolutionValue] = useState('');

  // Expands (key is configId for "all" or "configId_categoryName")
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const toggleExpand = (key: string) => setExpandedSolutions(prev => ({ ...prev, [key]: !prev[key] }));

  const handleAddConfig = () => {
    if (!newConfigForm.customerName.trim()) return;

    const newConfig: CusClosureConfig = {
      id: Date.now().toString(),
      customerName: newConfigForm.customerName.trim(),
      categories: []
    };

    setConfigs([...configs, newConfig]);
    setIsAddModalOpen(false);
    setNewConfigForm({ customerName: '' });
  };

  const handleCopyConfig = () => {
    if (!configToCopy || !copyCustomerName.trim()) return;

    const copiedConfig: CusClosureConfig = {
      ...configToCopy,
      id: Date.now().toString(),
      customerName: copyCustomerName.trim(),
      categories: configToCopy.categories.map(c => ({ ...c, solutions: [...c.solutions] }))
    };

    setConfigs([...configs, copiedConfig]);
    setIsCopyModalOpen(false);
    setConfigToCopy(null);
    setCopyCustomerName('');
  };

  const handleRemoveConfig = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id));
  };

  const handleSaveCustomerName = (id: string) => {
    if (!editCustomerName.trim()) {
      setEditingCustomerCardId(null);
      return;
    }
    setConfigs(configs.map(c => c.id === id ? { ...c, customerName: editCustomerName.trim() } : c));
    setEditingCustomerCardId(null);
  };

  const handleAddCategory = (configId: string) => {
    if (!newCategoryValue.trim()) return;
    const catName = newCategoryValue.trim();

    const sysCat = INITIAL_SYS_CLOSURE_DATA.find(sys => sys.typeName === catName);
    const initialSolutions = sysCat ? [...sysCat.solutions] : [];

    setConfigs(configs.map(c => {
      if (c.id === configId) {
        if (c.categories.some(cat => cat.typeName === catName)) return c;
        return {
          ...c,
          categories: [...c.categories, { typeName: catName, solutions: initialSolutions }]
        };
      }
      return c;
    }));
    setActiveTabs(prev => ({ ...prev, [configId]: catName }));
    setAddingCategoryFor(null);
    setNewCategoryValue('');
  };

  const handleRemoveCategory = (configId: string, categoryName: string) => {
    if (window.confirm(`确定要移除结案类型 "${categoryName}" 吗？`)) {
      setConfigs(configs.map(c => {
        if (c.id === configId) {
          return { ...c, categories: c.categories.filter(cat => cat.typeName !== categoryName) };
        }
        return c;
      }));
      setActiveTabs(prev => {
        if (prev[configId] === categoryName) return { ...prev, [configId]: 'all' };
        return prev;
      });
    }
  };

  const handleRemoveSolution = (configId: string, categoryName: string, solutionToRemove: string) => {
    setConfigs(configs.map(c => {
      if (c.id === configId) {
        return {
          ...c,
          categories: c.categories.map(cat => 
            cat.typeName === categoryName 
              ? { ...cat, solutions: cat.solutions.filter(s => s !== solutionToRemove) }
              : cat
          )
        };
      }
      return c;
    }));
  };

  const handleClearAllSolutions = (configId: string, categoryName: string) => {
    if (window.confirm('确定要清除此类型下的所有常见解决方案吗？')) {
      setConfigs(configs.map(c => {
        if (c.id === configId) {
          return {
            ...c,
            categories: c.categories.map(cat => 
              cat.typeName === categoryName 
                ? { ...cat, solutions: [] }
                : cat
            )
          };
        }
        return c;
      }));
    }
  };

  const handleAddSolution = (configId: string, categoryName: string) => {
    if (!newSolutionValue.trim()) return;

    setConfigs(configs.map(c => {
      if (c.id === configId) {
        return {
          ...c,
          categories: c.categories.map(cat => {
            if (cat.typeName === categoryName && !cat.solutions.includes(newSolutionValue.trim())) {
              return { ...cat, solutions: [...cat.solutions, newSolutionValue.trim()] };
            }
            return cat;
          })
        };
      }
      return c;
    }));
    setNewSolutionValue('');
    setAddingSolutionFor(null);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">客户结案类型与解决方案</h1>
          <p className="text-sm text-slate-500">管理各客户的专属结案类型及常见解决方案</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {configs.map((config) => {
            const activeTab = activeTabs[config.id] || 'all';
            
            let solutionsToDisplay: string[] = [];
            if (activeTab === 'all') {
              const allSols = new Set<string>();
              config.categories.forEach(cat => cat.solutions.forEach(s => allSols.add(s)));
              solutionsToDisplay = Array.from(allSols);
            } else {
              const cat = config.categories.find(c => c.typeName === activeTab);
              if (cat) solutionsToDisplay = cat.solutions;
            }

            const expandKey = activeTab === 'all' ? `${config.id}_all` : `${config.id}_${activeTab}`;
            const isExpanded = expandedSolutions[expandKey];
            const visibleSolutions = isExpanded ? solutionsToDisplay : solutionsToDisplay.slice(0, 6);
            const hasMore = solutionsToDisplay.length > 6;
            
            const availableSolutions = DEFAULT_SOLUTIONS.filter(s => !solutionsToDisplay.includes(s));
            const availableSystemCategories = INITIAL_SYS_CLOSURE_DATA.filter(sys => !config.categories.some(c => c.typeName === sys.typeName));

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={config.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full relative"
              >
                {/* 1. 客户 (Customer) Area */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <Building2 size={20} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">客户配置</span>
                        {editingCustomerCardId === config.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editCustomerName}
                              onChange={(e) => setEditCustomerName(e.target.value)}
                              className="w-full px-2 py-1 text-sm font-bold text-slate-900 bg-white border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveCustomerName(config.id);
                                if (e.key === 'Escape') setEditingCustomerCardId(null);
                              }}
                            />
                            <button onClick={() => setEditingCustomerCardId(null)} className="p-1 text-slate-400 hover:text-slate-600"><X size={14} /></button>
                            <button onClick={() => handleSaveCustomerName(config.id)} className="p-1 text-blue-600 hover:text-blue-700"><Check size={14} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">{config.customerName}</h3>
                            <button
                              onClick={() => {
                                setEditingCustomerCardId(config.id);
                                setEditCustomerName(config.customerName);
                              }}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              title="编辑客户名称"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setConfigToCopy(config);
                          setCopyCustomerName(`${config.customerName} (副本)`);
                          setIsCopyModalOpen(true);
                        }}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm"
                        title="复制此配置"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveConfig(config.id)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center justify-center transition-colors shadow-sm"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. 结案类型 Tabs Area */}
                <div className="pt-3 px-3 border-b border-slate-100 bg-white flex items-center gap-1 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setActiveTabs(prev => ({...prev, [config.id]: 'all'}))}
                    className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'all' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                  >
                    所有
                  </button>
                  {config.categories.map(cat => (
                    <div key={cat.typeName} className={`flex items-center group rounded-t-lg border-b-2 transition-colors shrink-0 ${activeTab === cat.typeName ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                      <button
                        onClick={() => setActiveTabs(prev => ({...prev, [config.id]: cat.typeName}))}
                        className="px-3 py-2 text-sm font-semibold whitespace-nowrap"
                      >
                        {cat.typeName}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveCategory(config.id, cat.typeName); }}
                        className={`pr-2 transition-opacity ${activeTab === cat.typeName ? 'text-blue-500 hover:text-red-500' : 'text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100'}`}
                        title="移除此结案类型"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Add Category Button/Form */}
                  {addingCategoryFor === config.id ? (
                    <div className="flex items-center gap-1 mx-2 shrink-0 bg-slate-50 border border-blue-200 p-1 rounded">
                       <input 
                         list={`sys-categories-${config.id}`}
                         value={newCategoryValue}
                         onChange={e => setNewCategoryValue(e.target.value)}
                         placeholder="选择或输入新类型"
                         className="text-sm border border-slate-200 bg-white rounded px-2 py-1 outline-none focus:border-blue-500 w-36"
                         autoFocus
                         onKeyDown={(e) => {
                           if (e.key === 'Enter' && newCategoryValue.trim()) {
                             handleAddCategory(config.id);
                           }
                         }}
                       />
                       <datalist id={`sys-categories-${config.id}`}>
                         {availableSystemCategories.map(sys => (
                           <option key={sys.typeName} value={sys.typeName} />
                         ))}
                       </datalist>
                       <button onClick={() => setAddingCategoryFor(null)} className="text-slate-400 hover:text-slate-600 p-1"><X size={14}/></button>
                       <button onClick={() => handleAddCategory(config.id)} disabled={!newCategoryValue.trim()} className="text-blue-600 disabled:opacity-30 p-1 hover:text-blue-800"><Check size={14}/></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAddingCategoryFor(config.id);
                        setNewCategoryValue('');
                      }}
                      className="px-3 py-2 text-sm font-semibold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors shrink-0"
                      title="添加结案类型"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>

                {/* 3. 常见解决方案 (Common Solutions) Area */}
                <div className="p-5 flex-1 flex flex-col bg-slate-50/20">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Tag size={16} className="text-orange-500" />
                      常见解决方案
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                        {solutionsToDisplay.length}
                      </span>
                    </h4>
                    {activeTab !== 'all' && (
                      <div className="flex items-center gap-3">
                        {solutionsToDisplay.length > 0 && (
                          <button
                            onClick={() => handleClearAllSolutions(config.id, activeTab)}
                            className="text-xs text-orange-500 hover:text-orange-700 transition-colors"
                          >
                            清空方案
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveCategory(config.id, activeTab)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors font-medium flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          删除当前结案类型
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                    {visibleSolutions.map((solution) => (
                      <div key={solution} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
                        <span>{solution}</span>
                        {activeTab !== 'all' && (
                          <button
                            onClick={() => handleRemoveSolution(config.id, activeTab, solution)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 text-slate-400 transition-colors ml-1"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    {solutionsToDisplay.length === 0 && (
                      <div className="text-sm text-slate-400 italic py-1">此类型下暂无解决方案</div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between min-h-[36px]">
                    {hasMore ? (
                      <button
                        onClick={() => toggleExpand(expandKey)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                      >
                        {isExpanded ? (
                          <><ChevronUp size={16} /> 收起</>
                        ) : (
                          <><ChevronDown size={16} /> 查看更多 ({solutionsToDisplay.length - 6})</>
                        )}
                      </button>
                    ) : (
                      <div />
                    )}

                    {activeTab !== 'all' && (
                      addingSolutionFor?.configId === config.id && addingSolutionFor?.categoryName === activeTab ? (
                        <div className="flex items-center gap-2 bg-white p-1 border border-blue-200 rounded-lg shadow-sm">
                          <input
                            list={`sys-solutions-${config.id}`}
                            value={newSolutionValue}
                            onChange={(e) => setNewSolutionValue(e.target.value)}
                            placeholder="选择或输入新方案"
                            className="w-40 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded outline-none focus:border-blue-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newSolutionValue.trim()) {
                                handleAddSolution(config.id, activeTab);
                              }
                            }}
                          />
                          <datalist id={`sys-solutions-${config.id}`}>
                            {availableSolutions.map(s => (
                              <option key={s} value={s} />
                            ))}
                          </datalist>
                          <button onClick={() => setAddingSolutionFor(null)} className="text-slate-400 hover:text-slate-600 px-1"><X size={16} /></button>
                          <button onClick={() => handleAddSolution(config.id, activeTab)} disabled={!newSolutionValue.trim()} className="text-blue-500 hover:text-blue-700 px-1 disabled:opacity-50"><Check size={16} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAddingSolutionFor({ configId: config.id, categoryName: activeTab });
                            setNewSolutionValue('');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium transition-colors"
                        >
                          <Plus size={14} /> 添加方案
                        </button>
                      )
                    )}
                    {activeTab === 'all' && (
                       <span className="text-xs text-slate-400 italic">请切换到具体类型以编辑方案</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Placeholder Card */}
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center min-h-[350px] cursor-pointer group"
            onClick={() => setIsAddModalOpen(true)}
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-blue-500" />
              </div>
              <h3 className="text-base font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                新增客户配置
              </h3>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">新增客户配置</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">客户名称</label>
                  <input
                    type="text"
                    value={newConfigForm.customerName}
                    onChange={(e) => setNewConfigForm({ customerName: e.target.value })}
                    placeholder="例如：屈臣氏"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleAddConfig()}
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors">取消</button>
                <button onClick={handleAddConfig} disabled={!newConfigForm.customerName.trim()} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors">新建</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Copy Modal */}
      <AnimatePresence>
        {isCopyModalOpen && configToCopy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">复制配置</h3>
                <button onClick={() => setIsCopyModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800">
                    复制 <strong>{configToCopy.customerName}</strong> 的配置，包含 {configToCopy.categories.length} 个结案类型及其解决方案。
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">新客户名称</label>
                  <input
                    type="text"
                    value={copyCustomerName}
                    onChange={(e) => setCopyCustomerName(e.target.value)}
                    placeholder="输入新客户名称"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleCopyConfig()}
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setIsCopyModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors">取消</button>
                <button onClick={handleCopyConfig} disabled={!copyCustomerName.trim()} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors">确认复制</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
