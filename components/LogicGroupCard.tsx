import React, { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { X, Plus, Filter, Copy, Edit2, Check, ArrowDown, Settings2, LayoutGrid, Clock, Phone, Timer } from 'lucide-react';
import { cn } from '../lib/utils';
import { LogicGroup, LogicNode, Field, Option } from '../types';

interface LogicGroupCardProps {
  key?: React.Key;
  group: LogicGroup;
  fields: Field[];
  selectedNodeId?: string;
  onRemoveNode: (groupId: string, nodeId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onCopyGroup: (groupId: string) => void;
  onRenameGroup: (groupId: string, newName: string) => void;
  onSelectNode: (groupId: string, nodeId: string) => void;
  onSelectField: (fieldId: string) => void;
  isReadonly?: boolean;
}

export function LogicGroupCard({ 
  group, 
  fields,
  onRemoveNode, 
  onDeleteGroup, 
  onCopyGroup, 
  onRenameGroup,
  selectedNodeId,
  onSelectNode,
  onSelectField,
  isReadonly
}: LogicGroupCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(group.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: `canvas-group-${group.id}`,
    disabled: isReadonly,
    data: {
      type: 'group',
      groupId: group.id,
    },
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (titleValue.trim()) {
      onRenameGroup(group.id, titleValue);
    } else {
      setTitleValue(group.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') {
      setTitleValue(group.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex flex-col min-w-[340px] h-full p-5 bg-white border-2 rounded-xl transition-all grow-0 shrink-0",
        isOver ? "border-indigo-500 bg-indigo-50/30 scale-[1.01] z-20" : "border-slate-200 shadow-sm",
        isReadonly && "opacity-95"
      )}
    >
      <div className="flex items-center justify-between mb-6 group/header">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1.5 bg-indigo-50 rounded-lg shrink-0">
            <Filter className="w-4 h-4 text-indigo-600" />
          </div>
          
          {isEditing && !isReadonly ? (
            <input
              ref={inputRef}
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="flex-1 px-1 py-0.5 text-sm font-semibold text-slate-800 bg-slate-50 border-b-2 border-indigo-500 outline-none truncate"
            />
          ) : (
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <h4 className="font-semibold text-slate-800 truncate">{group.name}</h4>
              {!isReadonly && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-slate-300 hover:text-indigo-500 opacity-0 group-hover/header:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {!isReadonly && (
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              onClick={() => onCopyGroup(group.id)}
              title="复制泳道"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteGroup(group.id)}
              title="删除泳道"
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto pr-1">
        {fields.map((field) => {
          const node = group.nodes.find(n => n.fieldId === field.id);
          
          const findOptionWithPath = (opts: Option[], id: string, path: string[] = []): { label: string, path: string[] } | null => {
            for (const opt of opts) {
              const currentPath = [...path, opt.label];
              if (opt.id === id) return { label: opt.label, path: currentPath };
              if (opt.children) {
                const found = findOptionWithPath(opt.children, id, currentPath);
                if (found) return found;
              }
            }
            return null;
          };

          const selectedItems = node?.selectedOptionIds?.map(id => findOptionWithPath(field.options, id)).filter(Boolean) as { label: string, path: string[] }[];
          
          return (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-slate-100 rounded">
                  {field.id === 'category' && <Filter className="w-3 h-3 text-slate-500" />}
                  {field.id === 'case-level' && <ArrowDown className="w-3 h-3 text-slate-500" />}
                  {field.id === 'grab' && <Check className="w-3 h-3 text-slate-500" />}
                  {field.id === 'it-stay' && <Settings2 className="w-3 h-3 text-slate-500" />}
                  {field.id === 'device' && <Plus className="w-3 h-3 text-slate-500" />}
                  {field.id === 'zone' && <LayoutGrid className="w-3 h-3 text-slate-500" />}
                  {field.id === 'it-stay-time' && <Clock className="w-3 h-3 text-slate-500" />}
                  {field.id === 'grab-time' && <Clock className="w-3 h-3 text-slate-500" />}
                  {field.id === 'phone-call-count' && <Phone className="w-3 h-3 text-slate-500" />}
                  {field.id === 'phone-call-duration' && <Timer className="w-3 h-3 text-slate-500" />}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {field.name}
                </span>
              </div>

              {node ? (
                <div 
                  onClick={() => {
                    onSelectNode(group.id, node.id);
                    onSelectField(field.id);
                  }}
                  className={cn(
                    "relative group animate-in zoom-in duration-300 cursor-pointer p-4 bg-white border rounded-xl shadow-sm transition-all",
                    selectedNodeId === node.id 
                      ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-md bg-indigo-50/10 scale-[1.02]" 
                      : "border-slate-200 hover:border-indigo-300 hover:shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1.5 max-w-[240px]">
                      {field.type === 'number' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-indigo-600">
                            {node.value ?? field.defaultValue ?? 0}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {field.name.includes('Mins') || field.name.includes('mins') ? 'MINS' : field.name.includes('次') ? '次' : '数值'}
                          </span>
                        </div>
                      ) : selectedItems && selectedItems.length > 0 ? (
                        selectedItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-700 break-words leading-tight">
                              {field.isTree ? item.path.join(' > ') : item.label}
                            </span>
                            {idx < selectedItems.length - 1 && <div className="h-1 w-1 bg-slate-200 rounded-full shrink-0" />}
                          </div>
                        ))
                      ) : (
                        <span className="text-sm font-semibold text-slate-400 italic">未选择选项</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="px-1.5 py-0.5 bg-indigo-600 text-white text-[9px] font-bold rounded">
                        已配置
                      </div>
                      {!isReadonly && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveNode(group.id, node.id);
                          }}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => !isReadonly && onSelectField(field.id)}
                  className={cn(
                    "border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30 p-4 flex items-center justify-center transition-all",
                    !isReadonly ? "group/slot hover:border-indigo-200 hover:bg-slate-50 cursor-pointer" : "opacity-40"
                  )}
                >
                  <div className="flex flex-col items-center gap-1 font-bold">
                    {!isReadonly ? (
                      <>
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center group-hover/slot:border-indigo-400 group-hover/slot:bg-indigo-50 transition-colors">
                          <Plus className="w-2.5 h-2.5 text-slate-400 group-hover/slot:text-indigo-600" />
                        </div>
                        <span className="text-[9px] text-slate-300 group-hover/slot:text-indigo-400 uppercase tracking-tighter">
                          DROP ASSET HERE
                        </span>
                      </>
                    ) : (
                      <span className="text-[9px] text-slate-300 uppercase tracking-tighter italic">
                        无配置内容
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
