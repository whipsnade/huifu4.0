import React, { useState, useMemo } from 'react';
import { Plus, Edit, Copy, Trash2, Image as ImageIcon, Box, ChevronRight, X } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
}

interface AcceptanceCriteria {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
}

interface SubTask {
  id: string;
  name: string;
  estCost: number;
  estDuration: number;
  acceptanceCriteria: AcceptanceCriteria[];
  equipment: Equipment[];
}

interface TaskPackage {
  id: string;
  name: string;
  subTasks: SubTask[];
}

const MOCK_TASK_PACKAGES: TaskPackage[] = [
  {
    id: 'tp-1',
    name: '网络设备安装包',
    subTasks: [
      {
        id: 'st-1-1',
        name: '路由器安装',
        estCost: 500,
        estDuration: 1,
        acceptanceCriteria: [
          { id: 'ac-1', imageUrl: 'https://picsum.photos/seed/router1/800/600', thumbnailUrl: 'https://picsum.photos/seed/router1/150/150' },
          { id: 'ac-2', imageUrl: 'https://picsum.photos/seed/router2/800/600', thumbnailUrl: 'https://picsum.photos/seed/router2/150/150' }
        ],
        equipment: [
          { id: 'eq-1', name: '企业级路由器' },
          { id: 'eq-2', name: '网线' }
        ]
      },
      {
        id: 'st-1-2',
        name: '交换机配置',
        estCost: 800,
        estDuration: 2,
        acceptanceCriteria: [
          { id: 'ac-3', imageUrl: 'https://picsum.photos/seed/switch1/800/600', thumbnailUrl: 'https://picsum.photos/seed/switch1/150/150' }
        ],
        equipment: [
          { id: 'eq-3', name: '核心交换机' }
        ]
      }
    ]
  },
  {
    id: 'tp-2',
    name: '监控系统部署包',
    subTasks: [
      {
        id: 'st-2-1',
        name: '摄像头安装',
        estCost: 1200,
        estDuration: 3,
        acceptanceCriteria: [
          { id: 'ac-4', imageUrl: 'https://picsum.photos/seed/cam1/800/600', thumbnailUrl: 'https://picsum.photos/seed/cam1/150/150' }
        ],
        equipment: [
          { id: 'eq-4', name: '高清摄像头' },
          { id: 'eq-5', name: '支架' }
        ]
      }
    ]
  }
];

export const EngineeringBasicConfigView: React.FC = () => {
  const [taskPackages, setTaskPackages] = useState<TaskPackage[]>(MOCK_TASK_PACKAGES);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(MOCK_TASK_PACKAGES[0]?.id || null);
  const [selectedSubTaskId, setSelectedSubTaskId] = useState<string | null>(MOCK_TASK_PACKAGES[0]?.subTasks[0]?.id || null);
  
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [editPackageName, setEditPackageName] = useState('');

  const [isEditingSubTask, setIsEditingSubTask] = useState(false);
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editSubTaskName, setEditSubTaskName] = useState('');
  const [editSubTaskCost, setEditSubTaskCost] = useState(0);
  const [editSubTaskDuration, setEditSubTaskDuration] = useState(0);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const selectedPackage = useMemo(() => taskPackages.find(p => p.id === selectedPackageId), [taskPackages, selectedPackageId]);
  const selectedSubTask = useMemo(() => selectedPackage?.subTasks.find(s => s.id === selectedSubTaskId), [selectedPackage, selectedSubTaskId]);

  const handlePackageSelect = (pkg: TaskPackage) => {
    setSelectedPackageId(pkg.id);
    setSelectedSubTaskId(pkg.subTasks[0]?.id || null);
  };

  const handleSubTaskSelect = (subTask: SubTask) => {
    setSelectedSubTaskId(subTask.id);
  };

  // Task Package Actions
  const handleAddPackage = () => {
    const newPkg: TaskPackage = {
      id: `tp-${Date.now()}`,
      name: '新任务包',
      subTasks: []
    };
    setTaskPackages([...taskPackages, newPkg]);
    setSelectedPackageId(newPkg.id);
    setSelectedSubTaskId(null);
    
    // Auto open edit modal
    setEditingPackageId(newPkg.id);
    setEditPackageName(newPkg.name);
    setIsEditingPackage(true);
  };

  const handleEditPackage = (e: React.MouseEvent, pkg: TaskPackage) => {
    e.stopPropagation();
    setEditingPackageId(pkg.id);
    setEditPackageName(pkg.name);
    setIsEditingPackage(true);
  };

  const handleSavePackage = () => {
    if (editingPackageId) {
      setTaskPackages(prev => prev.map(p => p.id === editingPackageId ? { ...p, name: editPackageName } : p));
    }
    setIsEditingPackage(false);
    setEditingPackageId(null);
  };

  const handleCopyPackage = (e: React.MouseEvent, pkg: TaskPackage) => {
    e.stopPropagation();
    const newPkg: TaskPackage = {
      ...pkg,
      id: `tp-${Date.now()}`,
      name: `${pkg.name} (副本)`,
      subTasks: pkg.subTasks.map(st => ({ ...st, id: `st-${Date.now()}-${Math.random()}` }))
    };
    setTaskPackages([...taskPackages, newPkg]);
  };

  const handleDeletePackage = (e: React.MouseEvent, pkgId: string) => {
    e.stopPropagation();
    setTaskPackages(prev => prev.filter(p => p.id !== pkgId));
    if (selectedPackageId === pkgId) {
      setSelectedPackageId(null);
      setSelectedSubTaskId(null);
    }
  };

  // Sub-task Actions
  const handleEditSubTask = (e: React.MouseEvent, subTask: SubTask) => {
    e.stopPropagation();
    setEditingSubTaskId(subTask.id);
    setEditSubTaskName(subTask.name);
    setEditSubTaskCost(subTask.estCost);
    setEditSubTaskDuration(subTask.estDuration);
    setIsEditingSubTask(true);
  };

  const handleSaveSubTask = () => {
    if (selectedPackageId && editingSubTaskId) {
      setTaskPackages(prev => prev.map(p => {
        if (p.id === selectedPackageId) {
          return {
            ...p,
            subTasks: p.subTasks.map(st => st.id === editingSubTaskId ? {
              ...st,
              name: editSubTaskName,
              estCost: editSubTaskCost,
              estDuration: editSubTaskDuration
            } : st)
          };
        }
        return p;
      }));
    }
    setIsEditingSubTask(false);
    setEditingSubTaskId(null);
  };

  const handleCopySubTask = (e: React.MouseEvent, subTask: SubTask) => {
    e.stopPropagation();
    if (selectedPackageId) {
      setTaskPackages(prev => prev.map(p => {
        if (p.id === selectedPackageId) {
          return {
            ...p,
            subTasks: [...p.subTasks, { ...subTask, id: `st-${Date.now()}`, name: `${subTask.name} (副本)` }]
          };
        }
        return p;
      }));
    }
  };

  const handleAddSubTask = () => {
    if (selectedPackageId) {
      const newSubTask: SubTask = {
        id: `st-${Date.now()}`,
        name: '新子任务',
        estCost: 0,
        estDuration: 0,
        acceptanceCriteria: [],
        equipment: []
      };
      setTaskPackages(prev => prev.map(p => {
        if (p.id === selectedPackageId) {
          return { ...p, subTasks: [...p.subTasks, newSubTask] };
        }
        return p;
      }));
      setSelectedSubTaskId(newSubTask.id);
      
      // Auto open edit modal
      setEditingSubTaskId(newSubTask.id);
      setEditSubTaskName(newSubTask.name);
      setEditSubTaskCost(newSubTask.estCost);
      setEditSubTaskDuration(newSubTask.estDuration);
      setIsEditingSubTask(true);
    }
  };

  const handleDeleteSubTask = (e: React.MouseEvent, subTaskId: string) => {
    e.stopPropagation();
    if (selectedPackageId) {
      setTaskPackages(prev => prev.map(p => {
        if (p.id === selectedPackageId) {
          return {
            ...p,
            subTasks: p.subTasks.filter(st => st.id !== subTaskId)
          };
        }
        return p;
      }));
      if (selectedSubTaskId === subTaskId) {
        setSelectedSubTaskId(null);
      }
    }
  };

  // Equipment Actions
  const handleAddEquipment = () => {
    if (selectedPackageId && selectedSubTaskId) {
      const eqName = prompt('请输入设备名称:');
      if (eqName && eqName.trim()) {
        setTaskPackages(prev => prev.map(p => {
          if (p.id === selectedPackageId) {
            return {
              ...p,
              subTasks: p.subTasks.map(st => {
                if (st.id === selectedSubTaskId) {
                  return {
                    ...st,
                    equipment: [...st.equipment, { id: `eq-${Date.now()}`, name: eqName.trim() }]
                  };
                }
                return st;
              })
            };
          }
          return p;
        }));
      }
    }
  };

  const handleDeleteEquipment = (eqId: string) => {
    if (selectedPackageId && selectedSubTaskId) {
      setTaskPackages(prev => prev.map(p => {
        if (p.id === selectedPackageId) {
          return {
            ...p,
            subTasks: p.subTasks.map(st => {
              if (st.id === selectedSubTaskId) {
                return {
                  ...st,
                  equipment: st.equipment.filter(eq => eq.id !== eqId)
                };
              }
              return st;
            })
          };
        }
        return p;
      }));
    }
  };

  // Acceptance Criteria Actions
  const handleAddAcceptanceCriteria = () => {
    if (selectedPackageId && selectedSubTaskId) {
      // Mock image upload
      const randomId = Math.floor(Math.random() * 1000);
      const newAc: AcceptanceCriteria = {
        id: `ac-${Date.now()}`,
        imageUrl: `https://picsum.photos/seed/${randomId}/800/600`,
        thumbnailUrl: `https://picsum.photos/seed/${randomId}/150/150`
      };
      
      setTaskPackages(prev => prev.map(p => {
        if (p.id === selectedPackageId) {
          return {
            ...p,
            subTasks: p.subTasks.map(st => {
              if (st.id === selectedSubTaskId) {
                return {
                  ...st,
                  acceptanceCriteria: [...st.acceptanceCriteria, newAc]
                };
              }
              return st;
            })
          };
        }
        return p;
      }));
    }
  };

  const handleDeleteAcceptanceCriteria = (e: React.MouseEvent, acId: string) => {
    e.stopPropagation();
    if (selectedPackageId && selectedSubTaskId) {
      setTaskPackages(prev => prev.map(p => {
        if (p.id === selectedPackageId) {
          return {
            ...p,
            subTasks: p.subTasks.map(st => {
              if (st.id === selectedSubTaskId) {
                return {
                  ...st,
                  acceptanceCriteria: st.acceptanceCriteria.filter(ac => ac.id !== acId)
                };
              }
              return st;
            })
          };
        }
        return p;
      }));
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">工程基础配置</h1>
          <p className="text-slate-500 text-sm">管理工程类工单的任务包、子任务及验收标准</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Column 1: Task Packages */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">任务包</h2>
            <button onClick={handleAddPackage} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {taskPackages.map(pkg => {
              const totalCost = pkg.subTasks.reduce((sum, st) => sum + st.estCost, 0);
              const totalDuration = pkg.subTasks.reduce((sum, st) => sum + st.estDuration, 0);
              const isSelected = selectedPackageId === pkg.id;

              return (
                <div 
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{pkg.name}</h3>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => handleEditPackage(e, pkg)} className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => handleCopyPackage(e, pkg)} className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => handleDeletePackage(e, pkg.id)} className="p-1 text-slate-400 hover:text-red-600 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div>
                      <span className="text-slate-400 text-xs">Est Cost:</span>
                      <span className="ml-1 font-medium text-slate-700">¥{totalCost}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs">Est Duration:</span>
                      <span className="ml-1 font-medium text-slate-700">{totalDuration} days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Sub-tasks */}
        {selectedPackage && (
          <div className="w-1/3 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-left-4 duration-300">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="text-slate-400 font-normal truncate max-w-[100px]" title={selectedPackage.name}>{selectedPackage.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                子任务
              </h2>
              <button onClick={handleAddSubTask} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedPackage.subTasks.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">暂无子任务</div>
              ) : (
                selectedPackage.subTasks.map(subTask => {
                  const isSelected = selectedSubTaskId === subTask.id;
                  return (
                    <div 
                      key={subTask.id}
                      onClick={() => handleSubTaskSelect(subTask)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{subTask.name}</h3>
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => handleEditSubTask(e, subTask)} className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={(e) => handleCopySubTask(e, subTask)} className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={(e) => handleDeleteSubTask(e, subTask.id)} className="p-1 text-slate-400 hover:text-red-600 rounded">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div>
                          <span className="text-slate-400 text-xs">Est Cost:</span>
                          <span className="ml-1 font-medium text-slate-700">¥{subTask.estCost}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Est Duration:</span>
                          <span className="ml-1 font-medium text-slate-700">{subTask.estDuration} days</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Column 3: Details (Acceptance Criteria & Equipment) */}
        {selectedSubTask && (
          <div className="w-1/3 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-left-4 duration-300">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="text-slate-400 font-normal truncate max-w-[100px]" title={selectedSubTask.name}>{selectedSubTask.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                详情
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Acceptance Criteria */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                    验收标准
                  </h3>
                  <button onClick={handleAddAcceptanceCriteria} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    <Plus className="w-3 h-3" /> 上传图片
                  </button>
                </div>
                {selectedSubTask.acceptanceCriteria.length === 0 ? (
                  <p className="text-sm text-slate-400">暂无验收标准</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedSubTask.acceptanceCriteria.map(ac => (
                      <div 
                        key={ac.id} 
                        className="relative group cursor-pointer rounded-lg overflow-hidden border border-slate-200 aspect-video"
                        onClick={() => setPreviewImage(ac.imageUrl)}
                      >
                        <img src={ac.thumbnailUrl} alt="验收标准" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <button 
                          onClick={(e) => handleDeleteAcceptanceCriteria(e, ac.id)}
                          className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100" />

              {/* Equipment */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Box className="w-4 h-4 text-indigo-500" />
                    设备
                  </h3>
                  <button onClick={handleAddEquipment} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    <Plus className="w-3 h-3" /> 添加设备
                  </button>
                </div>
                {selectedSubTask.equipment.length === 0 ? (
                  <p className="text-sm text-slate-400">暂无设备</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSubTask.equipment.map(eq => (
                      <div key={eq.id} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium flex items-center gap-2">
                        {eq.name}
                        <button onClick={() => handleDeleteEquipment(eq.id)} className="text-slate-400 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Task Package Modal */}
      {isEditingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">编辑任务包</h3>
              <button onClick={() => setIsEditingPackage(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">任务包名称</label>
                <input 
                  type="text" 
                  value={editPackageName}
                  onChange={(e) => setEditPackageName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Est Cost (CNY)</label>
                  <input 
                    type="text" 
                    disabled
                    value={taskPackages.find(p => p.id === editingPackageId)?.subTasks.reduce((sum, st) => sum + st.estCost, 0) || 0}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">自动汇总子任务成本</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Est Duration (days)</label>
                  <input 
                    type="text" 
                    disabled
                    value={taskPackages.find(p => p.id === editingPackageId)?.subTasks.reduce((sum, st) => sum + st.estDuration, 0) || 0}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">自动汇总子任务工期</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setIsEditingPackage(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">取消</button>
              <button onClick={handleSavePackage} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sub Task Modal */}
      {isEditingSubTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">编辑子任务</h3>
              <button onClick={() => setIsEditingSubTask(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">子任务名称</label>
                <input 
                  type="text" 
                  value={editSubTaskName}
                  onChange={(e) => setEditSubTaskName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Est Cost (CNY)</label>
                  <input 
                    type="number" 
                    value={editSubTaskCost}
                    onChange={(e) => setEditSubTaskCost(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Est Duration (days)</label>
                  <input 
                    type="number" 
                    value={editSubTaskDuration}
                    onChange={(e) => setEditSubTaskDuration(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setIsEditingSubTask(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">取消</button>
              <button onClick={handleSaveSubTask} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full p-4 flex justify-center">
            <button 
              onClick={() => setPreviewImage(null)} 
              className="absolute top-0 right-0 p-2 text-white/70 hover:text-white bg-black/50 rounded-full m-4"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" referrerPolicy="no-referrer" />
          </div>
        </div>
      )}
    </div>
  );
};
