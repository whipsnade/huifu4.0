import React, { useState } from 'react';
import { Plus, X, Copy, Trash2, FileCheck, Edit2, Settings, Check, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DEFAULT_SOLUTIONS = [
  '保外更换', '保外维修', '故障消失', '软件调试', '重新插拔', '清洁设备', 
  '硬件维修', '硬件调试', '硬件更换', '重启设备', '远程结案', '无效报修', '电话结案'
];

export interface SysClosureConfig {
  id: string;
  typeName: string;
  solutions: string[];
}

export const INITIAL_SYS_CLOSURE_DATA: SysClosureConfig[] = [
  { id: 'sys1', typeName: '驻场结案', solutions: [...DEFAULT_SOLUTIONS] },
  { id: 'sys2', typeName: '远程处理', solutions: [...DEFAULT_SOLUTIONS] },
  { id: 'sys3', typeName: '电话结案', solutions: [...DEFAULT_SOLUTIONS] },
  { id: 'sys4', typeName: '无效报修', solutions: [...DEFAULT_SOLUTIONS] }
];

export const ClosedCaseCategoryAndSolutionConfigView: React.FC = () => {
  const [configs, setConfigs] = useState<SysClosureConfig[]>(INITIAL_SYS_CLOSURE_DATA);
  
  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  // Copy Modal State
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [configToCopy, setConfigToCopy] = useState<SysClosureConfig | null>(null);
  const [copyTypeName, setCopyTypeName] = useState('');

  // Inline Edit Type Name
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editTypeName, setEditTypeName] = useState('');

  // Add Solution
  const [addingSolutionFor, setAddingSolutionFor] = useState<string | null>(null);
  const [newSolutionValue, setNewSolutionValue] = useState('');

  // Expand Solutions
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => setExpandedSolutions(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAddConfig = () => {
    if (!newTypeName.trim()) return;

    const newConfig: SysClosureConfig = {
      id: Date.now().toString(),
      typeName: newTypeName.trim(),
      solutions: [] // Start with empty, or could default to DEFAULT_SOLUTIONS
    };

    setConfigs([...configs, newConfig]);
    setIsAddModalOpen(false);
    setNewTypeName('');
  };

  const handleCopyConfig = () => {
    if (!configToCopy || !copyTypeName.trim()) return;

    const copiedConfig: SysClosureConfig = {
      ...configToCopy,
      id: Date.now().toString(),
      typeName: copyTypeName.trim(),
      solutions: [...configToCopy.solutions]
    };

    setConfigs([...configs, copiedConfig]);
    setIsCopyModalOpen(false);
    setConfigToCopy(null);
    setCopyTypeName('');
  };

  const handleRemoveConfig = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id));
  };

  const handleSaveTypeName = (id: string) => {
    if (!editTypeName.trim()) {
      setEditingCardId(null);
      return;
    }
    setConfigs(configs.map(c => c.id === id ? { ...c, typeName: editTypeName.trim() } : c));
    setEditingCardId(null);
  };

  const handleRemoveSolution = (configId: string, solutionToRemove: string) => {
    setConfigs(configs.map(c => {
      if (c.id === configId) {
        return { ...c, solutions: c.solutions.filter(s => s !== solutionToRemove) };
      }
      return c;
    }));
  };

  const handleClearAllSolutions = (configId: string) => {
    if (window.confirm('确定要清除所有常见解决方案吗？')) {
      setConfigs(configs.map(c => c.id === configId ? { ...c, solutions: [] } : c));
    }
  };

  const handleAddSolution = (configId: string) => {
    if (!newSolutionValue.trim()) return;

    setConfigs(configs.map(c => {
      if (c.id === configId && !c.solutions.includes(newSolutionValue.trim())) {
        return { ...c, solutions: [...c.solutions, newSolutionValue.trim()] };
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">结案类型与解决方案</h1>
          <p className="text-sm text-slate-500">管理系统级别的结案类型及其对应的常见解决方案</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {configs.map((config) => {
            const isExpanded = expandedSolutions[config.id];
            const visibleSolutions = isExpanded ? config.solutions : config.solutions.slice(0, 8);
            const hasMore = config.solutions.length > 8;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={config.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full"
              >
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <FileCheck size={20} />
                      </div>
                      <div className="flex-1">
                        {editingCardId === config.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editTypeName}
                              onChange={(e) => setEditTypeName(e.target.value)}
                              className="w-full px-2 py-1 text-sm font-bold text-slate-900 bg-white border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTypeName(config.id);
                                if (e.key === 'Escape') setEditingCardId(null);
                              }}
                            />
                            <button onClick={() => setEditingCardId(null)} className="p-1 text-slate-400 hover:text-slate-600"><X size={14} /></button>
                            <button onClick={() => handleSaveTypeName(config.id)} className="p-1 text-blue-600 hover:text-blue-700"><Check size={14} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">{config.typeName}</h3>
                            <button
                              onClick={() => {
                                setEditingCardId(config.id);
                                setEditTypeName(config.typeName);
                              }}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              title="编辑结案类型"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {editingCardId !== config.id && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setConfigToCopy(config);
                            setCopyTypeName(`${config.typeName} (副本)`);
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
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      常见解决方案
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                        {config.solutions.length}
                      </span>
                    </h4>
                    {config.solutions.length > 0 && (
                      <button
                        onClick={() => handleClearAllSolutions(config.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        一键清除
                      </button>
                    )}
                  </div>

                  {config.solutions.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-6 text-slate-400">
                      <AlertCircle size={24} className="mb-2 opacity-20" />
                      <p className="text-sm">暂无解决方案，请添加</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {visibleSolutions.map((solution) => (
                        <div key={solution} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100 text-sm font-medium text-orange-800">
                          <span>{solution}</span>
                          <button
                            onClick={() => handleRemoveSolution(config.id, solution)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-orange-200 hover:text-orange-900 text-orange-400 transition-colors ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                    {hasMore ? (
                      <button
                        onClick={() => toggleExpand(config.id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                      >
                        {isExpanded ? (
                          <><ChevronUp size={16} /> 收起</>
                        ) : (
                          <><ChevronDown size={16} /> 查看更多 ({config.solutions.length - 8})</>
                        )}
                      </button>
                    ) : (
                      <div />
                    )}

                    {addingSolutionFor === config.id ? (
                      <div className="flex items-center gap-2 bg-slate-50 p-1 border border-slate-200 rounded-lg">
                        <input
                          type="text"
                          value={newSolutionValue}
                          onChange={(e) => setNewSolutionValue(e.target.value)}
                          placeholder="输入解决方案"
                          className="w-32 px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddSolution(config.id);
                            if (e.key === 'Escape') setAddingSolutionFor(null);
                          }}
                        />
                        <button onClick={() => setAddingSolutionFor(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                        <button onClick={() => handleAddSolution(config.id)} className="text-blue-500 hover:text-blue-700"><Check size={14} /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAddingSolutionFor(config.id);
                          setNewSolutionValue('');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                      >
                        <Plus size={14} /> 添加
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center min-h-[300px] cursor-pointer group"
            onClick={() => setIsAddModalOpen(true)}
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-blue-500" />
              </div>
              <h3 className="text-base font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                新增结案类型
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
                <h3 className="text-lg font-bold text-slate-900">新增结案类型</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">结案类型名称</label>
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="例如：自修结案"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddConfig()}
                />
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors">取消</button>
                <button onClick={handleAddConfig} disabled={!newTypeName.trim()} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors">新建</button>
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
                    复制 <strong>{configToCopy.typeName}</strong> 的配置，包含 {configToCopy.solutions.length} 个常见解决方案。
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">新结案类型名称</label>
                  <input
                    type="text"
                    value={copyTypeName}
                    onChange={(e) => setCopyTypeName(e.target.value)}
                    placeholder="输入新结案类型名称"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleCopyConfig()}
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setIsCopyModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors">取消</button>
                <button onClick={handleCopyConfig} disabled={!copyTypeName.trim()} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors">确认复制</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
