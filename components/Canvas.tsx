import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus, Boxes, Save, Layout, Ban } from 'lucide-react';
import { cn } from '../lib/utils';
import { LogicGroup, Process, Field } from '../types';
import { LogicGroupCard } from './LogicGroupCard';

interface CanvasProps {
  groups: LogicGroup[];
  fields: Field[];
  selectedNodeId?: string;
  processMetadata?: Partial<Process>;
  onAddGroup: () => void;
  onDeleteGroup: (groupId: string) => void;
  onRemoveNode: (groupId: string, nodeId: string) => void;
  onCopyGroup: (groupId: string) => void;
  onRenameGroup: (groupId: string, newName: string) => void;
  onSelectNode: (groupId: string, nodeId: string) => void;
  onSelectField: (fieldId: string) => void;
  onSave: () => void;
  isReadonly?: boolean;
}

export function Canvas({ 
  groups, 
  fields,
  onAddGroup, 
  onDeleteGroup, 
  onRemoveNode, 
  onCopyGroup, 
  onRenameGroup,
  selectedNodeId,
  onSelectNode,
  onSelectField,
  processMetadata,
  onSave,
  isReadonly
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    disabled: isReadonly,
    data: {
      type: 'canvas',
    },
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      <header className="px-8 py-5 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg shadow-lg",
            isReadonly ? "bg-slate-400" : "bg-indigo-600 shadow-indigo-200"
          )}>
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg font-bold text-slate-900">{processMetadata?.processName || '未命名流程'}</h1>
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded-full",
                processMetadata?.status === 'published' && "bg-green-100 text-green-700",
                processMetadata?.status === 'draft' && "bg-orange-100 text-orange-700",
                processMetadata?.status === 'deprecated' && "bg-slate-100 text-slate-600 border border-slate-200"
              )}>
                {processMetadata?.status === 'published' ? '已发布' : 
                 processMetadata?.status === 'draft' ? '未发布' : '已弃用 (只读)'}
              </span>
            </div>
            <p className="text-xs text-slate-500">客户: {processMetadata?.customerName || '未指定客户'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isReadonly ? (
            <>
              <button
                onClick={onAddGroup}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
              >
                <Layout className="w-4 h-4" />
                新增泳道
              </button>
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-bold text-sm"
              >
                <Save className="w-4 h-4" />
                保存流程
              </button>
            </>
          ) : (
            <div className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg font-bold text-xs flex items-center gap-2 border border-slate-200">
              <Ban className="w-3.5 h-3.5" />
              只读模式
            </div>
          )}
        </div>
      </header>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-6 overflow-x-auto overflow-y-hidden scroll-smooth transition-colors duration-300 canvas-grid flex gap-6 items-stretch",
          isOver && "bg-slate-200/50"
        )}
      >
        {groups.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl bg-white/50 backdrop-blur-sm mx-auto max-w-2xl mt-10 h-[400px]">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium italic">
              {isReadonly ? '当前没有泳道数据' : '暂无泳道，请添加以开始排列组合'}
            </p>
            {!isReadonly && (
              <button
                onClick={onAddGroup}
                className="mt-6 px-6 py-2 border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition-all font-bold text-sm"
              >
                新建第一个泳道
              </button>
            )}
          </div>
        ) : (
          <>
            {groups.map((group) => (
              <LogicGroupCard
                key={group.id}
                group={group}
                fields={fields}
                onRemoveNode={onRemoveNode}
                onDeleteGroup={onDeleteGroup}
                onCopyGroup={onCopyGroup}
                onRenameGroup={onRenameGroup}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                onSelectField={onSelectField}
                isReadonly={isReadonly}
              />
            ))}
            
            {!isReadonly && (
              <div
                className={cn(
                  "min-w-[320px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all bg-white/30",
                  isOver ? "border-indigo-500 bg-indigo-50/50 scale-95" : "border-slate-300 hover:border-slate-400 hover:bg-white/50"
                )}
              >
                <Plus className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-400 text-center uppercase tracking-widest">拖拽到此处<br/>创建新泳道</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <footer className="px-8 py-3 bg-white border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
        <span>当前泳道数量: {groups.length}</span>
        <span>{isReadonly ? '当前版本为历史归档，不可编辑' : '提示：每个泳道可以单独进行复制和配置'}</span>
      </footer>
    </div>
  );
}
