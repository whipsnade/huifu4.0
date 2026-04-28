import React, { useState, useMemo } from 'react';
import { Settings2, X, ChevronDown, Search, Check, Square, CheckSquare, List, TreePine, ChevronRight, Layout } from 'lucide-react';
import { LogicNode, Field, Option } from '../types';
import { cn } from '../lib/utils';

interface PropertyPanelProps {
  fields: Field[];
  node: LogicNode | null;
  groupId: string | null;
  onUpdateOptions: (groupId: string, nodeId: string, newOptionIds: string[]) => void;
  onUpdateValue: (groupId: string, nodeId: string, newValue: number) => void;
  onClose: () => void;
  isReadonly?: boolean;
}

type ViewMode = 'hierarchical' | 'flat';

interface CheckboxTreeItemProps {
  key?: React.Key;
  option: Option;
  selectedIds: string[];
  onToggle: (id: string) => void;
  level?: number;
  isReadonly?: boolean;
}

function CheckboxTreeItem({ 
  option, 
  selectedIds, 
  onToggle, 
  level = 0,
  isReadonly
}: CheckboxTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedIds.includes(option.id);
  const hasChildren = option.children && option.children.length > 0;

  return (
    <div className="space-y-1">
      <div 
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all group",
          isSelected ? "bg-indigo-50" : "hover:bg-slate-50"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-slate-200 rounded text-slate-400 transition-colors"
          >
            {isOpen ? <ChevronDown className="w-3" /> : <ChevronRight className="w-3" />}
          </button>
        ) : (
          <div className="w-5" />
        )}
        
        <button 
          onClick={() => !isReadonly && onToggle(option.id)}
          disabled={isReadonly}
          className={cn(
            "flex items-center gap-2 flex-1 text-left",
            isReadonly && "cursor-default"
          )}
        >
          {isSelected ? (
            <CheckSquare className={cn("w-4 h-4", isReadonly ? "text-slate-400" : "text-indigo-600")} />
          ) : (
            <Square className="w-4 h-4 text-slate-300" />
          )}
          <span className={cn(
            "text-sm",
            isSelected ? "text-indigo-900 font-bold" : "text-slate-600 font-medium",
            isReadonly && isSelected && "text-slate-700"
          )}>
            {option.label}
          </span>
        </button>
      </div>

      {hasChildren && isOpen && (
        <div className="space-y-1">
          {option.children?.map(child => (
            <CheckboxTreeItem 
              key={child.id} 
              option={child} 
              selectedIds={selectedIds} 
              onToggle={onToggle} 
              level={level + 1}
              isReadonly={isReadonly}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PropertyPanel({ fields, node, groupId, onUpdateOptions, onUpdateValue, onClose, isReadonly }: PropertyPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchical');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  
  const field = useMemo(() => 
    node ? fields.find(f => f.id === node.fieldId) : null
  , [node, fields]);

  const flatOptions = useMemo(() => {
    if (!field) return [];
    const collect = (opts: Option[], path: string[] = [], parentId: string | null = null): (Option & { path: string[], parentId: string | null })[] => {
      return opts.reduce((acc, opt) => {
        const currentPath = [...path, opt.label];
        acc.push({ ...opt, path: currentPath, parentId });
        if (opt.children) {
          acc.push(...collect(opt.children, currentPath, opt.id));
        }
        return acc;
      }, [] as (Option & { path: string[], parentId: string | null })[]);
    };
    return collect(field.options);
  }, [field]);

  const filteredFlatOptions = useMemo(() => {
    let result = flatOptions;
    if (searchTerm) {
      result = result.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (showSelectedOnly && node) {
      result = result.filter(opt => node.selectedOptionIds.includes(opt.id));
    }
    return result;
  }, [flatOptions, searchTerm, showSelectedOnly, node]);

  // Helper to check if an option or its descendants match the search term
  const matchesSearchRecursive = (opt: Option): boolean => {
    if (!searchTerm) return true;
    if (opt.label.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    if (opt.children) {
      return opt.children.some(child => matchesSearchRecursive(child));
    }
    return false;
  };

  const toggleOption = (id: string) => {
    if (!node || !groupId || isReadonly) return;
    const current = [...(node.selectedOptionIds || [])];
    const isAdding = !current.includes(id);

    if (isAdding) {
      const toAdd = new Set<string>();
      
      // 1. Add target and all descendants
      const collectDescendants = (targetId: string) => {
        toAdd.add(targetId);
        const item = flatOptions.find(o => o.id === targetId);
        if (item && item.children) {
          item.children.forEach(child => collectDescendants(child.id));
        }
      };
      collectDescendants(id);

      // 2. Add all ancestors
      const collectAncestors = (targetId: string) => {
        const item = flatOptions.find(o => o.id === targetId);
        if (item && item.parentId) {
          toAdd.add(item.parentId);
          collectAncestors(item.parentId);
        }
      };
      collectAncestors(id);

      // Unique merged list
      const next = Array.from(new Set([...current, ...Array.from(toAdd)]));
      onUpdateOptions(groupId, node.id, next);
    } else {
      // Removing: Remove target and all descendants
      const toRemove = new Set<string>();
      const collectDescendants = (targetId: string) => {
        toRemove.add(targetId);
        const item = flatOptions.find(o => o.id === targetId);
        if (item && item.children) {
          item.children.forEach(child => collectDescendants(child.id));
        }
      };
      collectDescendants(id);

      const next = current.filter(oid => !toRemove.has(oid));
      onUpdateOptions(groupId, node.id, next);
    }
  };

  if (!node || !groupId) {
    return (
      <div className="w-80 h-full border-l border-slate-200 bg-white flex flex-col items-center justify-center p-8 text-center animate-in slide-in-from-right duration-300">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
          <Settings2 className="w-8 h-8 text-slate-200" />
        </div>
        <h3 className="text-slate-900 font-bold mb-1">属性面板</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          选择一个卡片以开始配置
        </p>
      </div>
    );
  }

  return (
    <div className="w-96 h-full border-l border-slate-200 bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 z-50">
      <header className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900">
                节点设置
              </h2>
              {isReadonly && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded border border-slate-200 uppercase tracking-tighter shrink-0">
                  ReadOnly
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              正在配置: {field?.name || '未知字段'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-6">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-indigo-600 text-white shadow-md shadow-indigo-100">
              <Layout className="w-3 h-3" />
              属性
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {field?.type === 'number' ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                数值配置
              </label>
              <div className="relative">
                <input
                  type="number"
                  disabled={isReadonly}
                  value={node.value ?? field.defaultValue ?? 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateValue(groupId, node.id, isNaN(val) ? 0 : val);
                  }}
                  className={cn(
                    "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-bold text-lg text-slate-800",
                    isReadonly && "opacity-60 cursor-not-allowed"
                  )}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
                  {field.name.includes('Mins') || field.name.includes('mins') ? '分钟' : field.name.includes('次') ? '次' : '数值'}
                </div>
              </div>
            </div>

            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 space-y-3">
              <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                配置说明
              </h4>
              <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                正在配置规则中的数值参数。该数值将作为触发后续流程或判断条件的依据。
                {field.id === 'it-stay-time' && " 设置 IT 停留的最大允许时间。逾期将触发报警。"}
                {field.id === 'grab-time' && " 设置单据抢单的有效时长。"}
                {field.id === 'phone-call-count' && " 设置系统自动拨打确认电话的尝试次数。"}
                {field.id === 'phone-call-duration' && " 每次通知电话的呼叫时长限制。"}
              </p>
            </div>
          </div>
        ) : field?.isTree ? (
            /* Tree Field Content */
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索属性..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>

                <div className="flex p-1 bg-slate-100 rounded-xl">
                  <button 
                    onClick={() => setViewMode('hierarchical')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all",
                      viewMode === 'hierarchical' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 font-medium"
                    )}
                  >
                    <TreePine className="w-3.5 h-3.5" />
                    层级视图
                  </button>
                  <button 
                    onClick={() => setViewMode('flat')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all",
                      viewMode === 'flat' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 font-medium"
                    )}
                  >
                    <List className="w-3.5 h-3.5" />
                    列表视图
                  </button>
                </div>
              </div>

              {viewMode === 'flat' ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                    className={cn(
                      "w-full py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all",
                      showSelectedOnly ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    <Check className="w-4 h-4" />
                    仅查看已选
                  </button>

                  <div className="space-y-2 pb-10">
                    {filteredFlatOptions.slice(0, 50).map(opt => (
                      <div 
                        key={opt.id}
                        onClick={() => toggleOption(opt.id)}
                        className={cn(
                          "relative overflow-hidden p-4 bg-white border rounded-2xl transition-all",
                          isReadonly ? "cursor-default" : "cursor-pointer hover:shadow-md",
                          node.selectedOptionIds.includes(opt.id) ? "border-indigo-500 shadow-sm shadow-indigo-50" : "border-slate-100 shadow-sm shadow-slate-50"
                        )}
                      >
                        {node.selectedOptionIds.includes(opt.id) && (
                          <div className={cn("absolute left-0 top-0 bottom-0 w-1", isReadonly ? "bg-slate-400" : "bg-indigo-500")} />
                        )}
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shadow-sm",
                            node.selectedOptionIds.includes(opt.id) 
                              ? (isReadonly ? "bg-slate-400 border-slate-400 text-white" : "bg-indigo-600 border-indigo-600 text-white") 
                              : "border-slate-300 bg-white"
                          )}>
                            {node.selectedOptionIds.includes(opt.id) && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div className={isReadonly ? "opacity-75" : ""}>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">
                              {opt.path.slice(0, -1).join(' > ') || 'ROOT'}
                            </div>
                            <div className="text-sm font-bold text-slate-900">
                              {opt.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredFlatOptions.length > 50 && (
                      <p className="text-center text-[10px] text-slate-400 py-4 italic">由于选项过多，仅展示前50条。请使用搜索缩小范围。</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">层级配置</label>
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 min-h-[400px]">
                      {field.options
                        .filter(opt => !searchTerm || matchesSearchRecursive(opt))
                        .map(opt => (
                        <CheckboxTreeItem 
                          key={opt.id} 
                          option={opt} 
                          selectedIds={node.selectedOptionIds} 
                          onToggle={toggleOption} 
                          isReadonly={isReadonly}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )
            }
          </div>
          ) : (
            /* Non-Tree Field Content (Restored Style) */
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  选项值设置 (单选模式)
                </label>
                
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索选项..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
                  />
                </div>

                <div className="max-h-[400px] overflow-y-auto border border-slate-100 rounded-2xl space-y-1.5 p-1.5 bg-slate-50/30">
                  {field?.options
                    .filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((opt) => (
                      <button
                        key={opt.id}
                        disabled={isReadonly}
                        onClick={() => !isReadonly && onUpdateOptions(groupId, node.id, [opt.id])} // Previous style was single select
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between group",
                          isReadonly && "cursor-default",
                          node.selectedOptionIds.includes(opt.id)
                            ? (isReadonly ? "bg-slate-400 text-white font-bold" : "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100")
                            : "hover:bg-white hover:shadow-sm text-slate-600 font-medium"
                        )}
                      >
                        <span className="truncate">{opt.label}</span>
                        {node.selectedOptionIds.includes(opt.id) && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                </div>
              </div>

              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <h4 className="text-xs font-bold text-indigo-900 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                  节点说明
                </h4>
                <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                  普通字段目前采用标准选择模式。如果该字段需要支持分层管理，请在配置中开启 Tree 属性。
                </p>
              </div>
            </div>
          )
        }
      </div>

      <footer className="p-8 border-t border-slate-100 bg-white">
        {!isReadonly ? (
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            保存配置
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm border border-slate-200 transition-all active:scale-[0.98]"
          >
            返回画布
          </button>
        )}
      </footer>
    </div>
  );
}
