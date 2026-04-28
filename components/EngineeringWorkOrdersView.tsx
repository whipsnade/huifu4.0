import React, { useState, useMemo } from 'react';
import { EngineeringWorkOrder, MOCK_ENGINEERING_WORK_ORDERS, SubTask, TaskPackage } from '../data/engineering';
import { Search, Filter, ChevronLeft, FileText, Image as ImageIcon, Box, ChevronRight, ChevronDown, X, Upload } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { UserRole } from '../types';

const calculateEndDate = (startDate: string | undefined, durationDays: number) => {
  if (!startDate) return '';
  const date = new Date(startDate);
  if (isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + Math.max(0, durationDays - 1));
  return date.toISOString().split('T')[0];
};

const getSubTaskStatus = (st: SubTask): string => {
  if (st.actualProgress === 100) return 'COMPLETED';
  
  const now = new Date().getTime();
  const estEnd = st.estStartDate ? new Date(calculateEndDate(st.estStartDate, st.estDuration)).getTime() : null;
  const estStart = st.estStartDate ? new Date(st.estStartDate).getTime() : null;

  if (!st.actualStartDate) {
    if (estStart && now > estStart) return 'DELAYED';
    return 'PENDING';
  }
  
  if (estEnd && now > estEnd && st.actualProgress !== 100) {
    return 'DELAYED';
  }
  
  return 'IN PROCESS';
};

const calculatePackageProgress = (pkg: TaskPackage) => {
  if (!pkg.subTasks || pkg.subTasks.length === 0) return 0;
  let total = 0;
  pkg.subTasks.forEach(st => total += (st.actualProgress || 0));
  return Math.round(total / pkg.subTasks.length);
};

const getGanttDateRange = (workOrder: EngineeringWorkOrder) => {
  let minDate = new Date('2099-01-01').getTime();
  let maxDate = new Date('2000-01-01').getTime();
  let hasDates = false;

  workOrder.taskPackages?.forEach(pkg => {
    pkg.subTasks?.forEach(st => {
      const estStart = st.estStartDate ? new Date(st.estStartDate).getTime() : null;
      const estEnd = st.estStartDate ? new Date(calculateEndDate(st.estStartDate, st.estDuration)).getTime() : null;
      const actStart = st.actualStartDate ? new Date(st.actualStartDate).getTime() : null;
      const actEnd = st.actualEndDate ? new Date(st.actualEndDate).getTime() : null;

      [estStart, estEnd, actStart, actEnd].forEach(d => {
        if (d && !isNaN(d)) {
          hasDates = true;
          if (d < minDate) minDate = d;
          if (d > maxDate) maxDate = d;
        }
      });
    });
  });

  const now = new Date().getTime();
  if (!hasDates) {
    return { start: new Date(now - 7 * 86400000), end: new Date(now + 14 * 86400000) };
  }

  return {
    start: new Date(Math.min(minDate, now) - 7 * 86400000),
    end: new Date(Math.max(maxDate, now) + 14 * 86400000)
  };
};

const calculateWorkOrderStatus = (workOrder: EngineeringWorkOrder): string => {
  let allCompleted = true;
  let anyActualStarted = false;
  let allPlanned = true;
  let hasSubTasks = false;

  workOrder.taskPackages?.forEach(pkg => {
    pkg.subTasks?.forEach(st => {
      hasSubTasks = true;
      if (st.actualProgress !== 100) allCompleted = false;
      if (st.actualStartDate && st.actualStartDate.trim() !== '') anyActualStarted = true;
      
      const hasAssignee = st.assignee && st.assignee.trim() !== '';
      const hasEstStart = st.estStartDate && st.estStartDate.trim() !== '';
      const hasEstEnd = (st.estEndDate && st.estEndDate.trim() !== '') || (hasEstStart && st.estDuration > 0);
      
      if (!hasAssignee || !hasEstStart || !hasEstEnd) {
        allPlanned = false;
      }
    });
  });

  if (!hasSubTasks) return 'CREATED';
  if (allCompleted) return 'COMPLETED';
  if (anyActualStarted) return 'IN PROCESS';
  if (allPlanned) return 'PLANNED';
  return 'CREATED';
};

export const EngineeringWorkOrdersView: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<EngineeringWorkOrder[]>(MOCK_ENGINEERING_WORK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);

  // Detail View States
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedSubTaskId, setSelectedSubTaskId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});

  const togglePackage = (pkgId: string) => {
    setExpandedPackages(prev => ({ ...prev, [pkgId]: prev[pkgId] === false ? true : false }));
  };

  const selectedWorkOrder = useMemo(() => workOrders.find(wo => wo.id === selectedWorkOrderId), [workOrders, selectedWorkOrderId]);
  const selectedPackage = useMemo(() => selectedWorkOrder?.taskPackages?.find(p => p.id === selectedPackageId), [selectedWorkOrder, selectedPackageId]);
  
  const resolvedPackageId = useMemo(() => {
    if (selectedPackageId !== 'gantt') return selectedPackageId;
    for (const pkg of selectedWorkOrder?.taskPackages || []) {
      if (pkg.subTasks?.some(s => s.id === selectedSubTaskId)) {
        return pkg.id;
      }
    }
    return null;
  }, [selectedWorkOrder, selectedPackageId, selectedSubTaskId]);

  const selectedSubTask = useMemo(() => {
    if (selectedPackageId === 'gantt') {
      for (const pkg of selectedWorkOrder?.taskPackages || []) {
        const st = pkg.subTasks?.find(s => s.id === selectedSubTaskId);
        if (st) return st;
      }
      return undefined;
    }
    return selectedPackage?.subTasks?.find(s => s.id === selectedSubTaskId);
  }, [selectedWorkOrder, selectedPackage, selectedPackageId, selectedSubTaskId]);

  const engineers = useMemo(() => MOCK_USERS.filter(u => u.role === UserRole.ENGINEER), []);

  const actualEngineerCount = useMemo(() => {
    if (!selectedWorkOrder) return 0;
    const assignees = new Set<string>();
    selectedWorkOrder.taskPackages?.forEach(pkg => {
      pkg.subTasks?.forEach(st => {
        if (st.assignee && st.assignee.trim() !== '') {
          assignees.add(st.assignee.trim());
        }
      });
    });
    return assignees.size;
  }, [selectedWorkOrder]);

  const overallProgress = useMemo(() => {
    if (!selectedWorkOrder || !selectedWorkOrder.taskPackages || selectedWorkOrder.taskPackages.length === 0) return 0;
    let totalPkgProgress = 0;
    selectedWorkOrder.taskPackages.forEach(pkg => {
      totalPkgProgress += calculatePackageProgress(pkg);
    });
    return Math.round(totalPkgProgress / selectedWorkOrder.taskPackages.length);
  }, [selectedWorkOrder]);

  // Initialization when opening a work order
  React.useEffect(() => {
    if (selectedWorkOrder && !selectedPackageId) {
      setSelectedPackageId('gantt');
      setSelectedSubTaskId(null);
    }
  }, [selectedWorkOrder, selectedPackageId]);

  // Handlers for editable fields
  const handleUpdateSubTaskField = (pkgId: string, subTaskId: string, field: keyof SubTask, value: any) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== selectedWorkOrderId) return wo;
      
      const updatedTaskPackages = wo.taskPackages.map(pkg => {
        if (pkg.id !== pkgId) return pkg;
        return {
          ...pkg,
          subTasks: pkg.subTasks.map(st => {
            if (st.id !== subTaskId) return st;
            return { ...st, [field]: value };
          })
        };
      });

      const updatedWo = { ...wo, taskPackages: updatedTaskPackages };
      updatedWo.status = calculateWorkOrderStatus(updatedWo);
      return updatedWo;
    }));
  };

  const handleUpdateActualEquipmentQuantity = (eqId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    if (resolvedPackageId && selectedSubTaskId) {
      setWorkOrders(prev => prev.map(wo => {
        if (wo.id !== selectedWorkOrderId) return wo;
        return {
          ...wo,
          taskPackages: wo.taskPackages.map(pkg => {
            if (pkg.id !== resolvedPackageId) return pkg;
            return {
              ...pkg,
              subTasks: pkg.subTasks.map(st => {
                if (st.id !== selectedSubTaskId) return st;
                return {
                  ...st,
                  actualEquipment: (st.actualEquipment || []).map(eq => eq.id === eqId ? { ...eq, quantity: newQuantity } : eq)
                };
              })
            };
          })
        };
      }));
    }
  };

  const handleAddActualAcceptanceCriteria = () => {
    if (resolvedPackageId && selectedSubTaskId) {
      const name = prompt('请输入实际验收图片名称:');
      if (name && name.trim()) {
        setWorkOrders(prev => prev.map(wo => {
          if (wo.id !== selectedWorkOrderId) return wo;
          return {
            ...wo,
            taskPackages: wo.taskPackages.map(pkg => {
              if (pkg.id !== resolvedPackageId) return pkg;
              return {
                ...pkg,
                subTasks: pkg.subTasks.map(st => {
                  if (st.id !== selectedSubTaskId) return st;
                  return {
                    ...st,
                    actualAcceptanceCriteria: [
                      ...(st.actualAcceptanceCriteria || []),
                      { 
                        id: `act-ac-${Date.now()}`, 
                        name: name.trim(), 
                        imageUrl: `https://picsum.photos/seed/${Date.now()}/800/600`, 
                        thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/200/150` 
                      }
                    ]
                  };
                })
              };
            })
          };
        }));
      }
    }
  };

  const filteredWorkOrders = workOrders.filter(wo => 
    wo.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wo.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wo.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wo.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedWorkOrder) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedWorkOrderId(null)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{selectedWorkOrder.workOrderNumber}</h1>
              <p className="text-slate-500 text-sm">{selectedWorkOrder.customerName} - {selectedWorkOrder.projectName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">{selectedWorkOrder.status}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Top Row: Project Info & Drawings */}
          <div className="grid grid-cols-3 gap-6">
            {/* Project Info */}
            <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                项目信息
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">客户名</label>
                  <div className="font-medium text-slate-900">{selectedWorkOrder.customerName}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">项目名称</label>
                  <div className="font-medium text-slate-900">{selectedWorkOrder.projectName}</div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Est Total Cost (CNY)</label>
                  <div className="font-medium text-slate-900">¥{selectedWorkOrder.estTotalCost.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Est Total Duration (days)</label>
                  <div className="font-medium text-slate-900">{selectedWorkOrder.estTotalDuration}</div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">实际/计划工程师 (数量)</label>
                  <div className="font-medium text-slate-900">{actualEngineerCount} / {selectedWorkOrder.engineerCount}</div>
                </div>
                <div className="col-span-3 mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs text-slate-500">工单总进度</label>
                    <span className="text-sm font-bold text-indigo-600">{overallProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Engineering Drawings */}
            <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-500" />
                  工程图纸
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {!selectedWorkOrder.drawings || selectedWorkOrder.drawings.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-sm">暂无附件</div>
                ) : (
                  selectedWorkOrder.drawings.map(dwg => (
                    <div key={dwg.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-700 truncate">{dwg.name}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Task Packages Section */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto">
              <button
                onClick={() => {
                  setSelectedPackageId('gantt');
                  setSelectedSubTaskId(null);
                }}
                className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                  selectedPackageId === 'gantt' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                甘特图 (Gantt)
              </button>
              {(selectedWorkOrder.taskPackages || []).map(pkg => (
                <button
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPackageId(pkg.id);
                    setSelectedSubTaskId(pkg.subTasks[0]?.id || null);
                  }}
                  className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                    selectedPackageId === pkg.id 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {pkg.name}
                </button>
              ))}
            </div>

            {selectedPackageId === 'gantt' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h2 className="font-bold text-slate-800">项目甘特图</h2>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-400 rounded-sm"></div> Pending</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> In Process</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Completed</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Delayed</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div> Ahead</div>
                  </div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                  {/* Left Pane */}
                  <div className="w-1/3 border-r border-slate-200 flex flex-col overflow-y-auto">
                    <div className="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4 font-medium text-xs text-slate-500 flex-shrink-0">
                      <div className="flex-1">任务名称</div>
                      <div className="w-24">Assignee</div>
                      <div className="w-16 text-right">进度</div>
                    </div>
                    <div className="flex-1">
                      {selectedWorkOrder.taskPackages?.map(pkg => {
                        const isExpanded = expandedPackages[pkg.id] !== false;
                        const pkgProgress = calculatePackageProgress(pkg);
                        return (
                          <React.Fragment key={pkg.id}>
                            <div 
                              className="h-10 border-b border-slate-100 bg-slate-50/50 flex items-center px-4 cursor-pointer hover:bg-slate-100"
                              onClick={() => togglePackage(pkg.id)}
                            >
                              <div className="flex-1 font-bold text-sm text-slate-800 flex items-center gap-2">
                                {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400"/> : <ChevronRight className="w-4 h-4 text-slate-400"/>}
                                {pkg.name}
                              </div>
                              <div className="w-24 text-xs text-slate-500"></div>
                              <div className="w-16 text-right text-xs font-bold text-indigo-600">{pkgProgress}%</div>
                            </div>
                            {isExpanded && pkg.subTasks?.map(st => (
                              <div 
                                key={st.id} 
                                className={`h-12 border-b border-slate-50 flex items-center px-4 pl-10 cursor-pointer hover:bg-slate-100 ${selectedSubTaskId === st.id ? 'bg-indigo-50/30' : ''}`}
                                onClick={() => setSelectedSubTaskId(st.id)}
                              >
                                <div className="flex-1 text-sm text-slate-700 truncate pr-2" title={st.name}>{st.name}</div>
                                <div className="w-24 text-xs text-slate-600 truncate" title={st.assignee}>{st.assignee || '-'}</div>
                                <div className="w-16 text-right text-xs text-slate-600">{st.actualProgress || 0}%</div>
                              </div>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                  {/* Right Pane (Timeline) */}
                  <div className="flex-1 overflow-x-auto overflow-y-auto relative">
                    {(() => {
                      const { start, end } = getGanttDateRange(selectedWorkOrder);
                      const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
                      const dayWidth = 30;
                      const days = Array.from({ length: totalDays }, (_, i) => new Date(start.getTime() + i * 86400000));

                      return (
                        <>
                          <div className="h-10 border-b border-slate-200 bg-slate-50 flex flex-shrink-0" style={{ width: totalDays * dayWidth }}>
                            {days.map((d, i) => (
                              <div key={i} className="flex-shrink-0 border-r border-slate-200 flex items-center justify-center text-[10px] text-slate-500" style={{ width: dayWidth }}>
                                {d.getDate()}
                              </div>
                            ))}
                          </div>
                          <div className="relative" style={{ width: totalDays * dayWidth }}>
                            {/* Grid lines */}
                            <div className="absolute inset-0 flex pointer-events-none">
                              {days.map((_, i) => (
                                <div key={i} className="flex-shrink-0 border-r border-slate-100 h-full" style={{ width: dayWidth }} />
                              ))}
                            </div>
                            {/* Bars */}
                            {selectedWorkOrder.taskPackages?.map(pkg => {
                              const isExpanded = expandedPackages[pkg.id] !== false;
                              return (
                                <React.Fragment key={pkg.id}>
                                  <div className="h-10 border-b border-slate-100 relative"></div>
                                  {isExpanded && pkg.subTasks?.map(st => {
                                    const estStart = st.estStartDate ? new Date(st.estStartDate).getTime() : null;
                                    const estEnd = st.estStartDate ? new Date(calculateEndDate(st.estStartDate, st.estDuration)).getTime() : null;
                                    const actStart = st.actualStartDate ? new Date(st.actualStartDate).getTime() : null;
                                    const actEnd = st.actualEndDate ? new Date(st.actualEndDate).getTime() : null;

                                    const getLeft = (time: number) => Math.max(0, (time - start.getTime()) / 86400000 * dayWidth);
                                    const getWidth = (s: number, e: number) => Math.max(dayWidth, (e - s) / 86400000 * dayWidth);

                                    const status = getSubTaskStatus(st);
                                    const colorMap: Record<string, { planned: string, actual: string }> = {
                                      'PENDING': { planned: 'bg-slate-200', actual: 'bg-slate-400' },
                                      'IN PROCESS': { planned: 'bg-blue-200', actual: 'bg-blue-500' },
                                      'COMPLETED': { planned: 'bg-emerald-200', actual: 'bg-emerald-500' },
                                      'DELAYED': { planned: 'bg-red-200', actual: 'bg-red-500' },
                                      'AHEAD': { planned: 'bg-purple-200', actual: 'bg-purple-500' },
                                    };
                                    const colors = colorMap[status] || colorMap['PENDING'];

                                    return (
                                      <div 
                                        key={st.id} 
                                        className={`h-12 border-b border-slate-50 relative group cursor-pointer hover:bg-slate-50/50 ${selectedSubTaskId === st.id ? 'bg-indigo-50/10' : ''}`}
                                        onClick={() => setSelectedSubTaskId(st.id)}
                                      >
                                        {/* Planned Bar */}
                                        {estStart && estEnd && (
                                          <div 
                                            className={`absolute top-2 h-2 rounded-full opacity-50 ${colors.planned}`}
                                            style={{ left: getLeft(estStart), width: getWidth(estStart, estEnd) }}
                                            title={`Planned: ${st.estStartDate} to ${calculateEndDate(st.estStartDate, st.estDuration)}`}
                                          />
                                        )}
                                        {/* Actual Bar */}
                                        {actStart && (
                                          <div 
                                            className={`absolute top-5 h-4 rounded-full shadow-sm ${colors.actual}`}
                                            style={{ 
                                              left: getLeft(actStart), 
                                              width: actEnd ? getWidth(actStart, actEnd) : getWidth(actStart, new Date().getTime()) 
                                            }}
                                            title={`Actual: ${st.actualStartDate} to ${st.actualEndDate || 'Now'}`}
                                          >
                                            <div className="h-full bg-white/30 rounded-full" style={{ width: `${st.actualProgress || 0}%` }} />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : selectedPackage ? (() => {
              const pkg = selectedPackage;
              const pkgCost = pkg.subTasks.reduce((sum, st) => sum + st.estCost, 0);
              const activeTasks = pkg.subTasks.filter(st => st.status === 'IN PROGRESS').length;

              return (
                <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="p-4 bg-indigo-50/50 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Box className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800 text-lg">{pkg.name}</h2>
                        <p className="text-slate-500 text-sm">Core Infrastructure Deployment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-indigo-600 text-lg">¥{pkgCost.toLocaleString()} Total</div>
                      <div className="text-slate-500 text-xs font-medium uppercase">{activeTasks} TASKS ACTIVE</div>
                    </div>
                  </div>
                  
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th rowSpan={2} className="px-4 py-3 font-medium border-r border-slate-200">子任务名称</th>
                          <th rowSpan={2} className="px-4 py-3 font-medium border-r border-slate-200">Assignee</th>
                          <th colSpan={6} className="px-4 py-2 font-medium text-center border-b border-r border-slate-200 bg-slate-100/50">EST & PLANNED</th>
                          <th colSpan={4} className="px-4 py-2 font-medium text-center border-b border-slate-200 bg-slate-50">Actual</th>
                        </tr>
                        <tr>
                          <th className="px-4 py-2 font-medium bg-slate-100/50">Est cost(CNY)</th>
                          <th className="px-4 py-2 font-medium bg-slate-100/50">Est Duration(Days)</th>
                          <th className="px-4 py-2 font-medium bg-slate-100/50">Est Start Date</th>
                          <th className="px-4 py-2 font-medium bg-slate-100/50">Est End Date</th>
                          <th className="px-4 py-2 font-medium bg-slate-100/50">Progress</th>
                          <th className="px-4 py-2 font-medium bg-slate-100/50 border-r border-slate-200">Status</th>
                          <th className="px-4 py-2 font-medium">Actual Start Date</th>
                          <th className="px-4 py-2 font-medium">Actual End Date</th>
                          <th className="px-4 py-2 font-medium">Progress</th>
                          <th className="px-4 py-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pkg.subTasks.map(subTask => (
                          <tr 
                            key={subTask.id} 
                            onClick={() => setSelectedSubTaskId(subTask.id)}
                            className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedSubTaskId === subTask.id ? 'bg-indigo-50/30' : ''}`}
                          >
                            <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2 border-r border-slate-200">
                              <div className={`w-2 h-2 rounded-full ${subTask.status === 'IN PROGRESS' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                              {subTask.name}
                            </td>
                            <td className="px-4 py-3 border-r border-slate-200">
                              <div className="flex items-center gap-2">
                                <img src={`https://ui-avatars.com/api/?name=${subTask.assignee || 'Unassigned'}&background=random`} className="w-6 h-6 rounded-full" />
                                <input 
                                  type="text" 
                                  list={`engineers-list-${subTask.id}`}
                                  value={subTask.assignee || ''} 
                                  onChange={(e) => handleUpdateSubTaskField(pkg.id, subTask.id, 'assignee', e.target.value)}
                                  className="w-24 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:ring-0 px-1 py-0.5 text-sm"
                                  placeholder="Search assignee..."
                                />
                                <datalist id={`engineers-list-${subTask.id}`}>
                                  {engineers.map(eng => (
                                    <option key={eng.id} value={eng.name} />
                                  ))}
                                </datalist>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-indigo-600 font-medium">¥{subTask.estCost}</td>
                            <td className="px-4 py-3">{subTask.estDuration}</td>
                            <td className="px-4 py-3">
                              <input 
                                type="date" 
                                value={subTask.estStartDate || ''} 
                                onChange={(e) => handleUpdateSubTaskField(pkg.id, subTask.id, 'estStartDate', e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:ring-0 px-1 py-0.5 text-sm text-slate-600"
                              />
                            </td>
                            <td className="px-4 py-3 text-slate-500">
                              {calculateEndDate(subTask.estStartDate, subTask.estDuration) || '-'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${subTask.estProgress || 0}%` }} />
                                </div>
                                <span className="text-xs w-8 text-slate-600">{subTask.estProgress || 0}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-slate-200">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${subTask.status === 'IN PROGRESS' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                {subTask.status || 'PENDING'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="date" 
                                value={subTask.actualStartDate || ''} 
                                onChange={(e) => handleUpdateSubTaskField(pkg.id, subTask.id, 'actualStartDate', e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:ring-0 px-1 py-0.5 text-sm text-slate-600"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="date" 
                                value={subTask.actualEndDate || ''} 
                                onChange={(e) => handleUpdateSubTaskField(pkg.id, subTask.id, 'actualEndDate', e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:ring-0 px-1 py-0.5 text-sm text-slate-600"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${subTask.actualProgress || 0}%` }} />
                                </div>
                                <span className="text-xs w-8 text-slate-600">{subTask.actualProgress || 0}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{subTask.actualStatus || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })() : null}
          </div>

          {/* Equipment & Acceptance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col pb-6">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="text-slate-400 font-normal truncate max-w-[150px]" title={selectedSubTask?.name}>{selectedSubTask?.name || '未选择'}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                设备与验收
              </h2>
            </div>
            {(!selectedSubTask && selectedPackageId === 'gantt') ? null : (
              <div className="p-4 space-y-6">
                {!selectedSubTask ? (
                  <div className="text-center py-10 text-slate-400 text-sm">请先选择一个子任务</div>
                ) : (
                  <div className="grid grid-cols-2 gap-6 divide-x divide-slate-200">
                    {/* Left: Planned */}
                  <div className="pr-6 space-y-6">
                    <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">计划验收与设备</h3>
                    
                    {/* Planned Acceptance Criteria */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-700 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-indigo-500" />
                          计划验收标准
                        </h4>
                      </div>
                      {selectedSubTask.acceptanceCriteria.length === 0 ? (
                        <p className="text-sm text-slate-400">暂无计划验收标准</p>
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
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Planned Equipment */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-700 flex items-center gap-2">
                          <Box className="w-4 h-4 text-indigo-500" />
                          计划设备
                        </h4>
                      </div>
                      {selectedSubTask.equipment.length === 0 ? (
                        <p className="text-sm text-slate-400">暂无计划设备</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedSubTask.equipment.map(eq => (
                            <div key={eq.id} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium flex items-center gap-2">
                              {eq.name}
                              <div className="flex items-center gap-1 ml-2 border-l border-slate-300 pl-2">
                                <span className="text-slate-500">x{eq.quantity || 1}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actual */}
                  <div className="pl-6 space-y-6">
                    <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">实际验收与设备</h3>
                    
                    {/* Actual Acceptance Criteria */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-700 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-indigo-500" />
                          实际验收标准
                        </h4>
                        <button 
                          onClick={handleAddActualAcceptanceCriteria}
                          className="px-3 py-1.5 text-sm bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
                        >
                          <Upload className="w-4 h-4" />
                          上传图片
                        </button>
                      </div>
                      {(!selectedSubTask.actualAcceptanceCriteria || selectedSubTask.actualAcceptanceCriteria.length === 0) ? (
                        <p className="text-sm text-slate-400">暂无实际验收图片</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {selectedSubTask.actualAcceptanceCriteria.map(ac => (
                            <div 
                              key={ac.id} 
                              className="relative group cursor-pointer rounded-lg overflow-hidden border border-slate-200 aspect-video"
                              onClick={() => setPreviewImage(ac.imageUrl)}
                            >
                              <img src={ac.thumbnailUrl} alt="验收标准" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actual Equipment */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-700 flex items-center gap-2">
                          <Box className="w-4 h-4 text-indigo-500" />
                          实际设备
                        </h4>
                      </div>
                      {(!selectedSubTask.actualEquipment || selectedSubTask.actualEquipment.length === 0) ? (
                        <p className="text-sm text-slate-400">暂无实际设备</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedSubTask.actualEquipment.map(eq => (
                            <div key={eq.id} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium flex items-center gap-2">
                              {eq.name}
                              <div className="flex items-center gap-1 ml-2 border-l border-slate-300 pl-2">
                                <button onClick={() => handleUpdateActualEquipmentQuantity(eq.id, (eq.quantity || 1) - 1)} className="text-slate-400 hover:text-indigo-600">-</button>
                                <span className="w-6 text-center">{eq.quantity || 1}</span>
                                <button onClick={() => handleUpdateActualEquipmentQuantity(eq.id, (eq.quantity || 1) + 1)} className="text-slate-400 hover:text-indigo-600">+</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )}
              </div>
            )}
          </div>
        </div>
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
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">工程类工单</h1>
          <p className="text-slate-500 text-sm">管理和查看所有工程类工单</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="搜索工单号/客户/门店..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredWorkOrders.length === 0 ? (
            <div className="text-center py-10 text-slate-400">暂无工程类工单</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkOrders.map(wo => (
                <div 
                  key={wo.id} 
                  onClick={() => setSelectedWorkOrderId(wo.id)}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden cursor-pointer"
                >
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <span className="font-mono text-sm font-medium text-indigo-600">{wo.workOrderNumber}</span>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      {wo.status}
                    </span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">客户 / 项目名称</div>
                      <div className="font-medium text-slate-900">{wo.customerName} / {wo.projectName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">门店</div>
                      <div className="font-medium text-slate-900">{wo.storeName}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Est Total Cost</div>
                        <div className="font-semibold text-slate-800">¥{wo.estTotalCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Est Total Duration</div>
                        <div className="font-semibold text-slate-800">{wo.estTotalDuration} days</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-slate-500 mb-1">工程师数量</div>
                        <div className="font-semibold text-slate-800">{wo.engineerCount} 人</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
