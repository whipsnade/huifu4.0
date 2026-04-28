import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { DesignerSidebar } from '../components/DesignerSidebar';
import { Canvas } from '../components/Canvas';
import { LogicGroup, Option, Process, Field } from '../types';
import { GripVertical } from 'lucide-react';
import { PropertyPanel } from '../components/PropertyPanel';
import { getFieldsForCustomer } from '../constants';

interface CusCaseLogicConfigViewProps {
  initialData?: Process | null;
  onSave: (groups: LogicGroup[]) => void;
}

export default function CusCaseLogicConfigView({ initialData, onSave }: CusCaseLogicConfigViewProps) {
  const [groups, setGroups] = useState<LogicGroup[]>(initialData?.groups || []);
  const [activeOption, setActiveOption] = useState<Option | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ groupId: string, nodeId: string } | null>(null);
  const [expandedFieldIds, setExpandedFieldIds] = useState<string[]>([]);

  const isReadonly = initialData?.status === 'deprecated';

  const customerFields = useMemo(() => {
    const allFields = getFieldsForCustomer(initialData?.customerName || '');
    return allFields.filter(f => f.id !== 'category');
  }, [initialData?.customerName]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const toggleSidebarField = (fieldId: string) => {
    setExpandedFieldIds(prev =>
      prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]
    );
  };

  const handleSelectNode = (groupId: string, nodeId: string) => {
    setSelectedNode({ groupId, nodeId });
    
    // Find the fieldId for the selected node and only expand that one
    const group = groups.find(g => g.id === groupId);
    const node = group?.nodes.find(n => n.id === nodeId);
    if (node) {
      setExpandedFieldIds([node.fieldId]);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'option') {
      setActiveOption(active.data.current.option);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOption(null);

    if (!over) return;

    const draggedOption = active.data.current?.option as Option;
    if (!draggedOption) return;

    const field = customerFields.find(f => f.id === draggedOption.fieldId);

    // Helper to get all parent IDs for an option (for hierarchical selection)
    const getOptionWithParents = (opt: Option): string[] => {
      const ids = [opt.id];
      if (!field) return ids;

      const findOptionById = (id: string, options: Option[]): Option | undefined => {
        for (const o of options) {
          if (o.id === id) return o;
          if (o.children) {
            const found = findOptionById(id, o.children);
            if (found) return found;
          }
        }
        return undefined;
      };

      let current = opt;
      while (current.parentId) {
        const parent = findOptionById(current.parentId, field.options);
        if (parent) {
          ids.push(parent.id);
          current = parent;
        } else {
          break;
        }
      }
      return ids;
    };

    const targetOptionIds = getOptionWithParents(draggedOption);

    if (over.data.current?.type === 'group') {
      const groupId = over.data.current.groupId;
      const nodeId = `node-${draggedOption.fieldId}-${Date.now()}`;
      
      setGroups(prev =>
        prev.map(group => {
          if (group.id === groupId) {
            const existingNodeIndex = group.nodes.findIndex(n => n.fieldId === draggedOption.fieldId);
            const targetNodeId = existingNodeIndex >= 0 
                ? group.nodes[existingNodeIndex].id 
                : nodeId;
            
            const newNode = {
              id: targetNodeId,
              fieldId: draggedOption.fieldId,
              selectedOptionIds: existingNodeIndex >= 0 
                ? Array.from(new Set([...group.nodes[existingNodeIndex].selectedOptionIds, ...targetOptionIds]))
                : targetOptionIds,
              value: field?.type === 'number' 
                ? (existingNodeIndex >= 0 ? group.nodes[existingNodeIndex].value : (field.defaultValue ?? 0))
                : undefined
            };

            const updatedNodes = [...group.nodes];
            if (existingNodeIndex >= 0) {
              updatedNodes[existingNodeIndex] = newNode;
            } else {
              updatedNodes.push(newNode);
            }

            return {
              ...group,
              nodes: updatedNodes,
            };
          }
          return group;
        })
      );
      
      // Auto-select
      const finalNodeId = groups.find(g => g.id === groupId)?.nodes.find(n => n.fieldId === draggedOption.fieldId)?.id || nodeId;
      setSelectedNode({ groupId, nodeId: finalNodeId });
      setExpandedFieldIds([draggedOption.fieldId]);
    } 
    else if (over.data.current?.type === 'canvas' || over.id === 'canvas-root') {
      const newGroupId = `group-${Date.now()}`;
      const newNodeId = `node-${Date.now()}`;
      const newGroup: LogicGroup = {
        id: newGroupId,
        name: `组合 ${groups.length + 1}`,
        nodes: [
          {
            id: newNodeId,
            fieldId: draggedOption.fieldId,
            selectedOptionIds: targetOptionIds,
            value: field?.type === 'number' ? (field.defaultValue ?? 0) : undefined
          },
        ],
      };
      setGroups(prev => [...prev, newGroup]);
      
      // Auto-select
      setSelectedNode({ groupId: newGroupId, nodeId: newNodeId });
      setExpandedFieldIds([draggedOption.fieldId]);
    }
  };

  const addGroup = () => {
    const newGroup: LogicGroup = {
      id: `group-${Date.now()}`,
      name: `新组合 ${groups.length + 1}`,
      nodes: [],
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const deleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const removeNodeFromGroup = (groupId: string, nodeId: string) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            nodes: group.nodes.filter(node => node.id !== nodeId),
          };
        }
        return group;
      })
    );
  };

  const renameGroup = (groupId: string, newName: string) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id === groupId) {
          return { ...group, name: newName };
        }
        return group;
      })
    );
  };

  const copyGroup = (groupId: string) => {
    const groupToCopy = groups.find(g => g.id === groupId);
    if (!groupToCopy) return;

    const newGroup: LogicGroup = {
      ...groupToCopy,
      id: `group-${Date.now()}`,
      name: `${groupToCopy.name} (副本)`,
      nodes: groupToCopy.nodes.map(node => ({
        ...node,
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const updateNodeOptions = (groupId: string, nodeId: string, newOptionIds: string[]) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            nodes: group.nodes.map(node => {
              if (node.id === nodeId) {
                return { ...node, selectedOptionIds: newOptionIds };
              }
              return node;
            }),
          };
        }
        return group;
      })
    );
  };

  const updateNodeValue = (groupId: string, nodeId: string, newValue: number) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            nodes: group.nodes.map(node => {
              if (node.id === nodeId) {
                return { ...node, value: newValue };
              }
              return node;
            }),
          };
        }
        return group;
      })
    );
  };

  const selectedNodeData = selectedNode 
    ? groups.find(g => g.id === selectedNode.groupId)?.nodes.find(n => n.id === selectedNode.nodeId)
    : null;

  return (
    <div className="flex flex-1 h-full bg-white overflow-hidden selection:bg-indigo-100 relative">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <DesignerSidebar 
          fields={customerFields}
          expandedFieldIds={expandedFieldIds} 
          onToggleField={toggleSidebarField}
          isReadonly={isReadonly}
        />
        <Canvas
          groups={groups}
          fields={customerFields}
          processMetadata={initialData || {}}
          onSave={() => onSave(groups)}
          onAddGroup={addGroup}
          onDeleteGroup={deleteGroup}
          onRemoveNode={removeNodeFromGroup}
          onCopyGroup={copyGroup}
          onRenameGroup={renameGroup}
          selectedNodeId={selectedNode?.nodeId}
          onSelectNode={handleSelectNode}
          onSelectField={(fieldId) => {
            if (!expandedFieldIds.includes(fieldId)) {
              setExpandedFieldIds(prev => [...prev, fieldId]);
            }
          }}
          isReadonly={isReadonly}
        />

        <PropertyPanel 
          fields={customerFields}
          node={selectedNodeData || null}
          groupId={selectedNode?.groupId || null}
          onUpdateOptions={updateNodeOptions}
          onUpdateValue={updateNodeValue}
          onClose={() => setSelectedNode(null)}
          isReadonly={isReadonly}
        />

        <DragOverlay adjustScale={true}>
          {activeOption ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-600 border border-indigo-700 rounded-md shadow-xl scale-105 pointer-events-none ring-4 ring-indigo-500/30">
              <GripVertical className="w-4 h-4 text-indigo-200" />
              <span className="text-sm font-bold text-white tracking-wide">
                {activeOption.label}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
