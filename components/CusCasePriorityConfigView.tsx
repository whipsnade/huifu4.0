import React, { useState } from 'react';
import { Plus, X, AlertCircle, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerPriority {
  id: string;
  name: string;
  priorities: string[];
}

interface CusCasePriorityConfigViewProps {
  initialData?: any;
  onSave?: (priorities: string[]) => void;
  onBack?: () => void;
  isReadOnly?: boolean;
}

export const CusCasePriorityConfigView: React.FC<CusCasePriorityConfigViewProps> = ({ initialData, onSave, onBack, isReadOnly = false }) => {
  const [priorities, setPriorities] = useState<string[]>(initialData?.priorities || ['P1', 'P2', 'P3']);
  const [newPriorityName, setNewPriorityName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddPriority = () => {
    if (!newPriorityName.trim()) {
      setIsAdding(false);
      return;
    }
    if (priorities.includes(newPriorityName.trim())) {
      setNewPriorityName('');
      setIsAdding(false);
      return;
    }
    setPriorities([...priorities, newPriorityName.trim()]);
    setNewPriorityName('');
    setIsAdding(false);
  };

  const handleRemovePriority = (priority: string) => {
    setPriorities(priorities.filter(p => p !== priority));
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {initialData?.customerName ? `${initialData.customerName} - ` : ''}案件等级配置设计
            </h1>
            <p className="text-sm text-slate-500">
              {initialData?.processName || '自定义案件等级（Priority）'}
            </p>
          </div>
        </div>
        {!isReadOnly && (
          <button 
            onClick={() => onSave?.(priorities)}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100"
          >
            保存配置
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">配置等级列表</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {priorities.map((priority) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={priority}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 hover:bg-indigo-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 border border-slate-100 group-hover:border-indigo-200 shadow-sm">
                    <AlertCircle size={16} />
                  </div>
                  <span className="font-bold text-slate-900">{priority}</span>
                </div>
                {!isReadOnly && (
                  <button 
                    onClick={() => handleRemovePriority(priority)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {!isReadOnly && (
            isAdding ? (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-1 bg-white border-2 border-indigo-200 rounded-2xl shadow-lg ring-4 ring-indigo-50"
              >
                <input 
                  type="text"
                  value={newPriorityName}
                  onChange={(e) => setNewPriorityName(e.target.value)}
                  placeholder="输入等级名称..."
                  className="flex-1 px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddPriority();
                    if (e.key === 'Escape') setIsAdding(false);
                  }}
                  onBlur={handleAddPriority}
                />
              </motion.div>
            ) : (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
              >
                <Plus size={20} />
                <span className="font-bold text-sm">添加新等级</span>
              </button>
            )
          )}
        </div>

        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <ClipboardList className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">版本说明</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                保存后该版本将进入“待发布”状态。发布新版本后，之前的“已发布”版本将自动状态变更为“已弃用”。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
