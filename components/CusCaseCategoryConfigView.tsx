import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, X, ChevronDown, ChevronUp, Layers, Building2, ChevronLeft, 
  ChevronRight, List, Layout, Search, Upload, Download 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSharedDeviceCategories } from '../lib/deviceCategoryStore';

interface ReadOnlyColumnProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

const ReadOnlyConfigColumn: React.FC<ReadOnlyColumnProps> = ({ title, icon, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayItems = isExpanded ? items : items.slice(0, 5);
  const hasMore = items.length > 5;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[300px]">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">{title}</h3>
            <p className="text-xs text-slate-500 mt-1">共 {items.length} 项 (只读)</p>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-4">
          <AnimatePresence>
            {displayItems.map((item) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700"
              >
                <span>{item}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-center border-t border-slate-100">
          {hasMore && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1 transition-colors"
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

// === Tree Node Structure ===
interface CategoryNode {
  id: string;
  name: string;
  children: CategoryNode[];
}

interface FlattenedCategory {
  customerId: string;
  customerName: string;
  levels: string[];
}

interface CustomerCategoryMap {
  id: string;
  name: string;
  rootNode: CategoryNode;
}

const INITIAL_CUS_DATA: CustomerCategoryMap[] = [
  { 
    id: '1', 
    name: 'YUM', 
    rootNode: {
      id: 'root-1',
      name: 'YUM',
      children: [
        { id: '1-1', name: '硬件故障', children: [
          { id: '1-1-1', name: '餐厅硬件故障', children: [
            { id: '1-1-1-1', name: '点餐屏故障', children: [
              { id: '1-1-1-1-1', name: '屏幕显示异常', children: [
                { id: '1-1-1-1-1-1', name: '亮点/暗点', children: [] }
              ]}
            ]}
          ]},
          { id: '1-1-2', name: '网络设备故障', children: [] }
        ]},
        { id: '1-2', name: '软件报错', children: [
          { id: '1-2-1', name: '餐厅软件报错', children: [
            { id: '1-2-1-1', name: '支付系统异常', children: [
              { id: '1-2-1-1-1', name: '微信支付报错', children: [
                { id: '1-2-1-1-1-1', name: '签名验证失败', children: [] },
                { id: '1-2-1-1-1-2', name: '二维码生成失败', children: [] },
                { id: '1-2-1-1-1-3', name: '交易查询超时', children: [] }
              ]}
            ]}
          ]},
          { id: '1-2-2', name: '支付异常', children: [] }
        ]}
      ]
    } 
  },
  { 
    id: '2', 
    name: '汉堡王', 
    rootNode: {
      id: 'root-2',
      name: '汉堡王',
      children: [
        { id: '2-1', name: '网络连接失败', children: [] },
        { id: '2-2', name: '厨房系统卡顿', children: [] },
        { id: '2-3', name: '扫描枪无反应', children: [] }
      ]
    } 
  }
];

// Recursive Mind Map Node Component
const MindMapNode: React.FC<{ 
  node: CategoryNode; 
  onAdd: (parentId: string) => void;
  onUpdate: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  isRoot?: boolean;
  suggestions?: string[];
}> = ({ node, onAdd, onUpdate, onRemove, isRoot = false, suggestions = [] }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on current input, or show all if empty
  const filteredSuggestions = suggestions.filter(
    s => node.name.trim() === '' || (s.toLowerCase().includes(node.name.toLowerCase()) && s !== node.name)
  );

  return (
    <div className="flex items-center" style={{ zIndex: isFocused ? 50 : 'auto', position: isFocused ? 'relative' : 'static' }}>
      {/* Node element */}
      <div className={`relative group flex items-center ${isFocused ? 'z-50' : ''}`}>
        <div className={`relative z-20 px-4 py-2 my-1 min-w-[140px] max-w-[200px] text-center shadow-sm transition-all duration-200 
          ${isRoot 
            ? 'border-[3px] border-indigo-400 bg-indigo-50 font-bold rounded-xl' 
            : 'border border-slate-300 bg-white hover:border-indigo-300 rounded-lg'
          }`}
        >
          <input 
            ref={inputRef}
            value={node.name}
            onChange={(e) => onUpdate(node.id, e.target.value)}
            onFocus={(e) => {
              setIsFocused(true);
              if (node.name === '新分类') {
                onUpdate(node.id, '');
              }
            }}
            onBlur={(e) => {
              // Delay hiding to allow click events on suggestions to fire before losing selection context
              setTimeout(() => {
                setIsFocused(false);
                // Use DOM value to avoid stale closure state overriding click updates
                const domValue = inputRef.current?.value ?? '';
                if (domValue.trim() === '') {
                  onUpdate(node.id, '新分类'); // Revert if empty
                }
              }, 200);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsFocused(false);
                inputRef.current?.blur();
              }
            }}
            className="w-full bg-transparent text-center focus:outline-none placeholder-slate-400 text-sm"
            placeholder="分类名称"
            title={node.name}
          />
          <button
            onClick={() => onAdd(node.id)}
            className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-indigo-600 ${isRoot ? '-right-4 w-8 h-8' : ''}`}
            title="添加子节点"
          >
            <Plus size={isRoot ? 16 : 14} />
          </button>
          {!isRoot && (
            <button
              onClick={() => onRemove(node.id)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-red-200"
              title="删除此节点"
            >
              <X size={12} />
            </button>
          )}

          {/* Suggestions Dropdown */}
          {!isRoot && isFocused && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto w-48 text-left">
              {filteredSuggestions.map((suggestion) => (
                <div 
                  key={suggestion}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Keep input focused initially
                  }}
                  onClick={() => {
                    onUpdate(node.id, suggestion);
                    setIsFocused(false);
                    inputRef.current?.blur();
                  }}
                  className="px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer border-b border-slate-50 last:border-0"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Line extending right if has children */}
        {node.children.length > 0 && (
          <div className="w-8 h-[2px] bg-indigo-200 z-10 relative" />
        )}
      </div>

      {/* Children elements */}
      {node.children.length > 0 && (
        <div className="flex flex-col justify-center relative">
          {node.children.map((child, index) => {
            const isFirst = index === 0;
            const isLast = index === node.children.length - 1;
            const isOnly = node.children.length === 1;

            return (
              <div key={child.id} className="flex relative items-stretch py-1.5 min-h-[46px] focus-within:z-50">
                {/* Vertical connector line */}
                {!isOnly && (
                  <div 
                    className="absolute left-0 w-[2px] bg-indigo-200 pointer-events-none"
                    style={{
                      top: isFirst ? '50%' : '0',
                      bottom: isLast ? '50%' : '0',
                    }}
                  />
                )}
                {/* Horizontal lead line from vertical to child node */}
                <div className="w-8 relative flex items-center pointer-events-none">
                  <div className="w-full h-[2px] bg-indigo-200" />
                </div>
                {/* Recursion */}
                <MindMapNode 
                  node={child} 
                  onAdd={onAdd}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                  suggestions={suggestions}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const CusCaseCategoryConfigView: React.FC = () => {
  const { categories: globalCategories } = useSharedDeviceCategories();
  const [activeTab, setActiveTab] = useState<'global' | 'customer'>('global');
  const [displayMode, setDisplayMode] = useState<'tree' | 'table'>('tree');
  const [tableSearch, setTableSearch] = useState('');
  
  const [customers, setCustomers] = useState<CustomerCategoryMap[]>(INITIAL_CUS_DATA);
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  const flattenedData = useMemo(() => {
    const results: FlattenedCategory[] = [];
    
    customers.forEach(customer => {
      const traverse = (node: CategoryNode, currentPath: string[]) => {
        const fullPath = [...currentPath, node.name];
        if (node.children.length === 0) {
          results.push({
            customerId: customer.id,
            customerName: customer.name,
            levels: fullPath
          });
        } else {
          node.children.forEach(child => traverse(child, fullPath));
        }
      };
      
      // Start traversal from children of the customer root node
      customer.rootNode.children.forEach(child => traverse(child, []));
    });
    
    return results;
  }, [customers]);

  const maxDepth = useMemo(() => {
    return Math.max(...flattenedData.map(d => d.levels.length), 0);
  }, [flattenedData]);

  const filteredTableData = useMemo(() => {
    if (!tableSearch.trim()) return flattenedData;
    const searchLower = tableSearch.toLowerCase();
    return flattenedData.filter(item => 
      item.customerName.toLowerCase().includes(searchLower) ||
      item.levels.some(l => l.toLowerCase().includes(searchLower))
    );
  }, [flattenedData, tableSearch]);

  const activeCustomer = customers.find(c => c.id === activeCustomerId);

  const handleAddCustomer = () => {
    if (!newCustomerName.trim()) return;
    const newId = Date.now().toString();
    const newCustomer: CustomerCategoryMap = {
      id: newId,
      name: newCustomerName.trim(),
      rootNode: {
        id: `root-${newId}`,
        name: newCustomerName.trim(),
        children: []
      }
    };
    setCustomers([...customers, newCustomer]);
    setActiveCustomerId(newId);
    setIsAddCustomerModalOpen(false);
    setNewCustomerName('');
    
    // Automatically scroll to the end
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }, 100);
  };

  // Node Helpers
  const addNodeToTree = (node: CategoryNode, parentId: string, newNodeId: string): CategoryNode => {
    if (node.id === parentId) {
      return { ...node, children: [...node.children, { id: newNodeId, name: '新分类', children: [] }] };
    }
    return { ...node, children: node.children.map(child => addNodeToTree(child, parentId, newNodeId)) };
  };

  const updateNodeInTree = (node: CategoryNode, id: string, name: string): CategoryNode => {
    if (node.id === id) {
      return { ...node, name };
    }
    return { ...node, children: node.children.map(child => updateNodeInTree(child, id, name)) };
  };

  const removeNodeFromTree = (node: CategoryNode, id: string): CategoryNode | null => {
    if (node.id === id) return null;
    return {
      ...node,
      children: node.children.map(child => removeNodeFromTree(child, id)).filter((n): n is CategoryNode => n !== null)
    };
  };

  const handleAddNode = (parentId: string) => {
    if (!activeCustomerId) return;
    setCustomers(customers.map(c => {
      if (c.id === activeCustomerId) {
        return { ...c, rootNode: addNodeToTree(c.rootNode, parentId, Date.now().toString()) };
      }
      return c;
    }));
  };

  const handleUpdateNode = (id: string, name: string) => {
    if (!activeCustomerId) return;
    setCustomers(customers.map(c => {
      if (c.id === activeCustomerId) {
        if (id === c.rootNode.id) {
           return { ...c, name: name.trim(), rootNode: updateNodeInTree(c.rootNode, id, name) }
        }
        return { ...c, rootNode: updateNodeInTree(c.rootNode, id, name) };
      }
      return c;
    }));
  };

  const handleRemoveNode = (id: string) => {
    if (!activeCustomerId) return;
    setCustomers(customers.map(c => {
      if (c.id === activeCustomerId) {
         const newRoot = removeNodeFromTree(c.rootNode, id);
         return { ...c, rootNode: newRoot || c.rootNode }; 
      }
      return c;
    }));
  };

  return (
    <div className="p-6 w-full flex flex-col gap-6 text-left">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">报修分类配置</h1>
        <p className="text-sm text-slate-500">统一管理系统的基础报修分类，及维护特定客户专属的报修分类，支持多级节点设定</p>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-2">
        <button 
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-3 text-center rounded-lg font-bold transition-all ${activeTab === 'global' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          全局报修分类
        </button>
        <button 
          onClick={() => setActiveTab('customer')}
          className={`flex-1 py-3 text-center rounded-lg font-bold transition-all ${activeTab === 'customer' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          客户及专属分类
        </button>
      </div>

      {activeTab === 'global' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
            <ReadOnlyConfigColumn 
              title="基础报修分类 (与系统设置同步)" 
              icon={<Layers size={20} />} 
              items={globalCategories} 
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Horizontal Customer Cards List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
               <button onClick={scrollLeft} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 shrink-0 text-slate-400 hover:text-slate-700 transition-colors">
                 <ChevronLeft size={18} />
               </button>
               <div className="flex-1 overflow-x-auto flex gap-3 scrollbar-hide py-1" ref={scrollRef}>
                 {customers.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setActiveCustomerId(c.id)}
                      className={`min-w-[140px] px-4 py-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-center
                        ${activeCustomerId === c.id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-200 hover:border-indigo-300'}`}
                    >
                       <div className="font-bold text-slate-800 text-sm truncate" title={c.name}>{c.name}</div>
                       <div className="text-xs text-slate-500 mt-0.5">定制分类</div>
                    </div>
                 ))}
                 <div 
                   onClick={() => setIsAddCustomerModalOpen(true)}
                   className="min-w-[140px] px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 cursor-pointer flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors group"
                 >
                    <Plus size={18} className="mr-1 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">新建客户</span>
                 </div>
               </div>
               <button onClick={scrollRight} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 shrink-0 text-slate-400 hover:text-slate-700 transition-colors">
                 <ChevronRight size={18} />
               </button>
            </div>
          </div>

          {/* Preview and Edit Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex-1 min-h-[500px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 size={20} className="text-indigo-600" />
                客户及专属分类预览与制作
              </h3>
              
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-1 rounded-lg mr-2">
                  <button 
                    onClick={() => setDisplayMode('tree')}
                    className={`p-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${displayMode === 'tree' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    title="思维导图模式"
                  >
                    <Layout size={14} /> 脑图模式
                  </button>
                  <button 
                    onClick={() => setDisplayMode('table')}
                    className={`p-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${displayMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    title="表格模式"
                  >
                    <List size={14} /> 表格模式
                  </button>
                </div>
                <button 
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Upload size={14} /> 导入分类
                </button>
              </div>
            </div>
            
            {displayMode === 'table' ? (
              <div className="flex flex-col gap-4 text-left">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="模糊搜索报修分类 (客户、分类名称)..." 
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 font-bold text-slate-700 whitespace-nowrap">客户</th>
                        {Array.from({ length: maxDepth }).map((_, i) => (
                          <th key={i} className="px-4 py-3 font-bold text-slate-700 whitespace-nowrap">{i + 1}级分类</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-4 py-4 font-bold text-slate-900 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-white border border-indigo-100 text-indigo-600 rounded-lg text-xs shadow-sm font-bold">
                              {row.customerName}
                            </span>
                          </td>
                          {Array.from({ length: maxDepth }).map((_, i) => (
                            <td key={i} className="px-4 py-4 text-slate-600 whitespace-nowrap font-medium">
                              {row.levels[i] || <span className="text-slate-300">-</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {filteredTableData.length === 0 && (
                        <tr>
                          <td colSpan={maxDepth + 1} className="px-4 py-16 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <Search size={32} className="mb-2 opacity-20" />
                              <p className="font-medium">未找到符合条件的分类</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="overflow-auto max-h-[600px] min-h-[400px] p-8 bg-slate-50/50 rounded-xl border border-slate-200 relative" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                 {activeCustomer ? (
                    <div className="min-w-fit">
                       <MindMapNode 
                        node={activeCustomer.rootNode} 
                        isRoot 
                        onAdd={handleAddNode} 
                        onUpdate={handleUpdateNode} 
                        onRemove={handleRemoveNode}
                        suggestions={globalCategories}
                      />
                    </div>
                 ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                       <Layers size={48} className="mb-4 opacity-30" />
                       <p className="font-medium text-sm">请在上方选择一个客户卡片，或点击"新建客户"开始制作多级分类</p>
                    </div>
                 )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      <AnimatePresence>
        {isAddCustomerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-left"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">新建客户</h3>
                <button 
                  onClick={() => setIsAddCustomerModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">客户名称</label>
                <input 
                  type="text" 
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="例如：星巴克"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCustomer();
                  }}
                />
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsAddCustomerModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddCustomer}
                  disabled={!newCustomerName.trim()}
                  className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-lg shadow-indigo-100"
                >
                  确定创建
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Categories Modal */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900 leading-none">批量导入报修分类</h2>
                <button 
                  onClick={() => setIsImportModalOpen(false)} 
                  className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-4">
                  <div className="p-2.5 bg-white rounded-lg text-indigo-600 shadow-sm border border-indigo-50">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-indigo-900 text-sm">下载导入模板</h3>
                    <p className="text-xs text-indigo-700 mt-1 mb-3">
                      请使用标准模板填写分类，支持导入多级级联数据。
                    </p>
                    <button className="text-xs font-bold bg-white text-indigo-600 px-4 py-2 rounded-lg border border-indigo-200 hover:bg-slate-50 transition-all shadow-sm">
                      下载 Excel 模板 (.xlsx)
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 px-1 italic border-l-4 border-indigo-500 pl-3">导入字段说明</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed grid grid-cols-2 gap-x-6 gap-y-2 font-medium">
                    <p><span className="font-bold text-slate-900 text-[11px] bg-slate-200 px-1 rounded mr-1">客户名称</span> (必填)</p>
                    <p><span className="font-bold text-slate-900 text-[11px] bg-slate-200 px-1 rounded mr-1">一级分类</span> (必填)</p>
                    <p><span className="font-bold text-slate-900 text-[11px] bg-slate-200 px-1 rounded mr-1">二级分类</span> (选填)</p>
                    <p><span className="font-bold text-slate-900 text-[11px] bg-slate-200 px-1 rounded mr-1">三级分类</span> (选填)</p>
                    <p><span className="font-bold text-slate-900 text-[11px] bg-slate-200 px-1 rounded mr-1">四级分类</span> (选填)</p>
                    <p><span className="font-bold text-slate-900 text-[11px] bg-slate-200 px-1 rounded mr-1">五级分类</span> (选填)</p>
                    <p><span className="font-bold text-slate-900 text-[11px] bg-slate-200 px-1 rounded mr-1">N级分类</span> (选填)</p>
                  </div>
                </div>

                <div 
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all cursor-pointer group shadow-inner"
                  onClick={() => document.getElementById('category-import-file')?.click()}
                >
                  <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300 ring-4 ring-slate-100 group-hover:ring-indigo-100">
                    <Upload className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">选择文件或拖拽至此处</p>
                  <p className="text-xs text-slate-500 mt-2">支持 .xlsx, .csv 格式 (最大文件限制 5MB)</p>
                  <input id="category-import-file" type="file" className="hidden" accept=".xlsx, .csv" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsImportModalOpen(false)} 
                  className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    alert('数据格式校验通过，已成功导入 48 条报修分类记录！');
                    setIsImportModalOpen(false);
                  }}
                  className="px-8 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                >
                  确认导入
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
