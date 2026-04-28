import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { Option } from '../types';

interface DraggableOptionProps {
  key?: React.Key;
  option: Option;
  isReadonly?: boolean;
}

export function DraggableOption({ option, isReadonly }: DraggableOptionProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${option.id}`,
    data: {
      type: 'option',
      option,
    },
    disabled: isReadonly,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md shadow-sm transition-all group",
        isReadonly ? "opacity-60 cursor-not-allowed bg-slate-50" : "cursor-grab active:cursor-grabbing hover:border-indigo-400",
        isDragging && "opacity-50 border-indigo-500 ring-2 ring-indigo-500/20"
      )}
    >
      {!isReadonly && <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />}
      <span className={cn(
        "text-sm font-medium",
        isReadonly ? "text-slate-500" : "text-slate-700"
      )}>
        {option.label}
      </span>
    </div>
  );
}
