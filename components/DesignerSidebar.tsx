import React from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  GripVertical,
  Layers,
  Database,
  Type,
  Box
} from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { Field, Option } from '../types';
import { cn } from '../lib/utils';

interface DraggableOptionProps {
  key?: string | number;
  option: Option;
  isReadonly?: boolean;
}

function DraggableOption({ option, isReadonly }: DraggableOptionProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = option.children && option.children.length > 0;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `option-${option.id}`,
    data: {
      type: 'option',
      option,
    },
    disabled: isReadonly
  });

  return (
    <div className="space-y-2">
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={cn(
          "group flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl transition-all shadow-sm",
          isReadonly ? "cursor-default opacity-60" : "cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-md",
          isDragging && "opacity-0"
        )}
      >
        <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 shrink-0" />
        <span className="text-xs font-semibold text-slate-700 tracking-wide flex-1 truncate">{option.label}</span>
        {hasChildren && (
          <button 
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors shrink-0"
          >
            {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="pl-4 space-y-2 border-l border-slate-100 ml-2 animate-in slide-in-from-left-1 duration-200">
          {option.children?.map(child => (
            <DraggableOption key={child.id} option={child} isReadonly={isReadonly} />
          ))}
        </div>
      )}
    </div>
  );
}

interface DesignerSidebarProps {
  fields: Field[];
  expandedFieldIds: string[];
  onToggleField: (fieldId: string) => void;
  isReadonly?: boolean;
}

export function DesignerSidebar({ fields, expandedFieldIds, onToggleField, isReadonly }: DesignerSidebarProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredFields = fields.map(field => {
    const matchedOptions = field.options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...field, matchedOptions };
  }).filter(field => field.matchedOptions.length > 0 || field.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-72 h-full bg-slate-50/50 border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">业务元素库</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Element Library</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索节点类型..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4 custom-scrollbar">
        {filteredFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <button
              onClick={() => onToggleField(field.id)}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-1 bg-white hover:bg-slate-50 font-bold text-xs text-slate-500 transition-colors uppercase tracking-widest",
                expandedFieldIds.includes(field.id) && "text-indigo-600"
              )}
            >
              {expandedFieldIds.includes(field.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="flex-1 text-left">{field.name}</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] text-slate-400">
                {field.type === 'number' ? 1 : field.options.length}
              </span>
            </button>

            {expandedFieldIds.includes(field.id) && (
              <div className="space-y-2.5 pl-1 animate-in slide-in-from-top-2 duration-200">
                {field.type === 'number' ? (
                  <DraggableOption 
                    option={{
                      id: `number-opt-${field.id}`,
                      label: `配置 ${field.name}`,
                      fieldId: field.id
                    }}
                    isReadonly={isReadonly}
                  />
                ) : (
                  field.options.map((option) => (
                    <DraggableOption 
                      key={option.id} 
                      option={option} 
                      isReadonly={isReadonly}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        ))}

        {/* Global/Special Element Categories */}
        <div className="pt-8 border-t border-slate-200">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 pl-2">全局逻辑块</h3>
          <div className="space-y-4">
            <div className="group flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl opacity-50 grayscale cursor-not-allowed">
              <Database className="w-4 h-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700">数据源映射</p>
                <p className="text-[9px] text-slate-400">Database Entry</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl opacity-50 grayscale cursor-not-allowed">
              <Type className="w-4 h-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700">静态文本</p>
                <p className="text-[9px] text-slate-400">Static Content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-indigo-600/5 border-t border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600/10 rounded-lg flex items-center justify-center shrink-0">
            <Box className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-[10px] font-medium text-indigo-800 leading-tight">
            拖拽元素至右侧画布<br/>
            以创建新的业务逻辑单元
          </p>
        </div>
      </div>
    </div>
  );
}
