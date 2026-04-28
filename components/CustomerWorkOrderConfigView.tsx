import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit, Copy, Trash2, Image as ImageIcon, Box, ChevronRight, X, ChevronLeft, Upload, FileText, Search, Send, AlertCircle } from 'lucide-react';
import { TaskPackage, SubTask, AcceptanceCriteria, Equipment, MOCK_TASK_PACKAGES, MOCK_ENGINEERING_WORK_ORDERS, ProjectDrawing } from '../data/engineering';
import { MOCK_USERS } from '../constants';

interface Project {
  id: string;
  customerName: string;
  projectName: string;
  engineerCount: number;
  drawings: ProjectDrawing[];
  taskPackages: TaskPackage[];
  version?: string;
  creator?: string;
  createTime?: string;
  updater?: string;
  updateTime?: string;
  enabled?: boolean;
  publishStatus?: 'PUBLISHED' | 'UNPUBLISHED';
  publishTime?: string;
  lifecycleStatus?: 'ACTIVE' | 'DEPRECATED';
  originalId?: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    customerName: 'Alice Freeman',
    projectName: '上海南京路店网络改造',
    engineerCount: 2,
    drawings: [
      { id: 'dwg-1', name: '弱电平面图.pdf', url: '#' }
    ],
    taskPackages: JSON.parse(JSON.stringify([MOCK_TASK_PACKAGES[0]])), // Deep copy
    version: 'V1.0',
    creator: 'Admin',
    createTime: '2024-01-01T10:00:00Z',
    updater: 'Admin',
    updateTime: '2024-01-01T10:00:00Z',
    enabled: true,
    publishStatus: 'PUBLISHED',
    publishTime: '2024-01-02T10:00:00Z',
    lifecycleStatus: 'ACTIVE',
    originalId: 'orig-proj-1'
  }
];

export const CustomerWorkOrderConfigView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'DEPRECATED'>('ACTIVE');
  
  // List View States
  const [isEditingProjectModal, setIsEditingProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({});

  // Detail View States
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedSubTaskId, setSelectedSubTaskId] = useState<string | null>(null);
  const [packagePage, setPackagePage] = useState(0);
  const PACKAGES_PER_PAGE = 4;

  const [isAddingPackageModal, setIsAddingPackageModal] = useState(false);
  const [searchPackageQuery, setSearchPackageQuery] = useState('');

  const [isCreateWorkOrderModalOpen, setIsCreateWorkOrderModalOpen] = useState(false);
  const [createWoStoreId, setCreateWoStoreId] = useState('');

  const [isEditingSubTask, setIsEditingSubTask] = useState(false);
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editSubTaskName, setEditSubTaskName] = useState('');
  const [editSubTaskCost, setEditSubTaskCost] = useState(0);
  const [editSubTaskDuration, setEditSubTaskDuration] = useState(0);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState<{message: string, onConfirm?: () => void} | null>(null);

  const selectedProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [projects, selectedProjectId]);
  const selectedPackage = useMemo(() => selectedProject?.taskPackages.find(p => p.id === selectedPackageId), [selectedProject, selectedPackageId]);
  const selectedSubTask = useMemo(() => selectedPackage?.subTasks.find(s => s.id === selectedSubTaskId), [selectedPackage, selectedSubTaskId]);

  // Initialization when opening a project
  useEffect(() => {
    if (selectedProject && !selectedPackageId) {
      if (selectedProject.taskPackages.length > 0) {
        setSelectedPackageId(selectedProject.taskPackages[0].id);
        setSelectedSubTaskId(selectedProject.taskPackages[0].subTasks[0]?.id || null);
      }
    }
  }, [selectedProject, selectedPackageId]);

  // --- List View Actions ---
  const handleCreateProject = () => {
    setEditingProject({
      customerName: '',
      projectName: '',
      engineerCount: 1,
      drawings: [],
      taskPackages: [],
      version: 'V1.0',
      enabled: false,
      publishStatus: 'UNPUBLISHED',
      lifecycleStatus: 'ACTIVE'
    });
    setIsEditingProjectModal(true);
  };

  const handleEditProjectClick = (e: React.MouseEvent, proj: Project) => {
    e.stopPropagation();
    if (proj.publishStatus === 'PUBLISHED') {
      // Create a draft clone
      const draft: Project = {
        ...JSON.parse(JSON.stringify(proj)),
        id: `proj-${Date.now()}`,
        publishStatus: 'UNPUBLISHED',
        enabled: false,
        publishTime: undefined,
        updater: 'Current User',
        updateTime: new Date().toISOString()
      };
      setEditingProject(draft);
    } else {
      setEditingProject({ ...proj });
    }
    setIsEditingProjectModal(true);
  };

  const handleCopyProject = (e: React.MouseEvent, proj: Project) => {
    e.stopPropagation();
    const newProj: Project = {
      ...JSON.parse(JSON.stringify(proj)), // Deep copy
      id: `proj-${Date.now()}`,
      projectName: `${proj.projectName} (副本)`,
      version: 'V1.0',
      creator: 'Current User',
      createTime: new Date().toISOString(),
      updater: 'Current User',
      updateTime: new Date().toISOString(),
      enabled: false,
      publishStatus: 'UNPUBLISHED',
      publishTime: undefined,
      lifecycleStatus: 'ACTIVE',
      originalId: `orig-${Date.now()}`
    };
    setProjects([...projects, newProj]);
  };

  const handleDeleteProject = (e: React.MouseEvent, projId: string) => {
    e.stopPropagation();
    setProjects(prev => prev.filter(p => p.id !== projId));
  };

  const handlePublishProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    if (!project.enabled) {
      setAlertConfig({ message: "请先启用该项目，再进行发布" });
      return;
    }
    
    setProjects(prev => {
      const newProjects = [...prev];
      
      // Find the currently published version of this customerName and projectName
      const oldPublishedIndex = newProjects.findIndex(p => 
        (p.customerName || '').trim() === (project.customerName || '').trim() && 
        (p.projectName || '').trim() === (project.projectName || '').trim() && 
        p.publishStatus === 'PUBLISHED' && 
        p.lifecycleStatus === 'ACTIVE' && 
        p.id !== project.id
      );
      
      let nextVersion = 'V1.0';
      if (oldPublishedIndex >= 0) {
        // Deprecate the old one
        newProjects[oldPublishedIndex] = { ...newProjects[oldPublishedIndex], lifecycleStatus: 'DEPRECATED' };
        
        // Calculate next version
        const oldV = parseFloat(newProjects[oldPublishedIndex].version?.replace('V', '') || '1.0');
        nextVersion = `V${(oldV + 0.1).toFixed(1)}`;
      } else {
        const currentV = parseFloat(project.version?.replace('V', '') || '0.9');
        nextVersion = `V${(currentV + 0.1).toFixed(1)}`;
      }
      
      // Update current project
      const projIndex = newProjects.findIndex(p => p.id === project.id);
      if (projIndex >= 0) {
        newProjects[projIndex] = {
          ...newProjects[projIndex],
          publishStatus: 'PUBLISHED',
          publishTime: new Date().toISOString(),
          version: nextVersion,
          updater: 'Current User',
          updateTime: new Date().toISOString()
        };
      }
      
      return newProjects;
    });
  };

  const handleSaveProjectModal = () => {
    let savedProjectId = editingProject.id;
    if (editingProject.id) {
      setProjects(prev => {
        const exists = prev.some(p => p.id === editingProject.id);
        if (exists) {
          return prev.map(p => p.id === editingProject.id ? { ...p, ...editingProject, updater: 'Current User', updateTime: new Date().toISOString() } as Project : p);
        } else {
          return [...prev, { ...editingProject, updater: 'Current User', updateTime: new Date().toISOString() } as Project];
        }
      });
    } else {
      savedProjectId = `proj-${Date.now()}`;
      const newProj: Project = {
        ...(editingProject as Project),
        id: savedProjectId,
        drawings: [],
        taskPackages: [],
        version: 'V1.0',
        creator: 'Current User',
        createTime: new Date().toISOString(),
        updater: 'Current User',
        updateTime: new Date().toISOString(),
        enabled: false,
        publishStatus: 'UNPUBLISHED',
        lifecycleStatus: 'ACTIVE',
        originalId: `orig-${Date.now()}`
      };
      setProjects([...projects, newProj]);
    }
    setIsEditingProjectModal(false);
    if (savedProjectId) {
      setSelectedProjectId(savedProjectId);
    }
  };

  // --- Detail View Actions ---
  const updateCurrentProject = (updater: (proj: Project) => Project) => {
    if (selectedProjectId) {
      setProjects(prev => prev.map(p => p.id === selectedProjectId ? { ...updater(p), updater: 'Current User', updateTime: new Date().toISOString() } : p));
    }
  };

  const handleSaveAsDraft = () => {
    updateCurrentProject(p => p); // This will trigger the updater and updateTime
    setAlertConfig({ 
      message: '已保存为草稿',
      onConfirm: () => setSelectedProjectId(null)
    });
  };

  const handleSave = () => {
    updateCurrentProject(p => p); // This will trigger the updater and updateTime
    setSelectedProjectId(null);
  };

  // Project Info
  const handleProjectInfoChange = (field: keyof Project, value: any) => {
    updateCurrentProject(p => ({ ...p, [field]: value }));
  };

  // Drawings
  const handleAddDrawing = () => {
    const newDwg: ProjectDrawing = {
      id: `dwg-${Date.now()}`,
      name: `图纸_${Math.floor(Math.random() * 1000)}.pdf`,
      url: '#'
    };
    updateCurrentProject(p => ({ ...p, drawings: [...p.drawings, newDwg] }));
  };

  const handleDeleteDrawing = (dwgId: string) => {
    updateCurrentProject(p => ({ ...p, drawings: p.drawings.filter(d => d.id !== dwgId) }));
  };

  // Task Packages
  const handleAddPackageFromTemplate = (templatePkg: TaskPackage) => {
    const newPkg: TaskPackage = JSON.parse(JSON.stringify(templatePkg));
    newPkg.id = `tp-${Date.now()}-${Math.random()}`;
    // Re-id subtasks to avoid conflicts
    newPkg.subTasks = newPkg.subTasks.map(st => ({
      ...st,
      id: `st-${Date.now()}-${Math.random()}`
    }));

    updateCurrentProject(p => ({ ...p, taskPackages: [...p.taskPackages, newPkg] }));
    setIsAddingPackageModal(false);
    setSelectedPackageId(newPkg.id);
    setSelectedSubTaskId(newPkg.subTasks[0]?.id || null);
  };

  // Sub-tasks
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
      updateCurrentProject(p => ({
        ...p,
        taskPackages: p.taskPackages.map(pkg => 
          pkg.id === selectedPackageId ? { ...pkg, subTasks: [...pkg.subTasks, newSubTask] } : pkg
        )
      }));
      setSelectedSubTaskId(newSubTask.id);
      
      setEditingSubTaskId(newSubTask.id);
      setEditSubTaskName(newSubTask.name);
      setEditSubTaskCost(newSubTask.estCost);
      setEditSubTaskDuration(newSubTask.estDuration);
      setIsEditingSubTask(true);
    }
  };

  const handleEditSubTaskClick = (e: React.MouseEvent, subTask: SubTask) => {
    e.stopPropagation();
    setEditingSubTaskId(subTask.id);
    setEditSubTaskName(subTask.name);
    setEditSubTaskCost(subTask.estCost);
    setEditSubTaskDuration(subTask.estDuration);
    setIsEditingSubTask(true);
  };

  const handleSaveSubTask = () => {
    if (selectedPackageId && editingSubTaskId) {
      updateCurrentProject(p => ({
        ...p,
        taskPackages: p.taskPackages.map(pkg => 
          pkg.id === selectedPackageId ? {
            ...pkg,
            subTasks: pkg.subTasks.map(st => st.id === editingSubTaskId ? {
              ...st,
              name: editSubTaskName,
              estCost: editSubTaskCost,
              estDuration: editSubTaskDuration
            } : st)
          } : pkg
        )
      }));
    }
    setIsEditingSubTask(false);
    setEditingSubTaskId(null);
  };

  const handleCopySubTask = (e: React.MouseEvent, subTask: SubTask) => {
    e.stopPropagation();
    if (selectedPackageId) {
      updateCurrentProject(p => ({
        ...p,
        taskPackages: p.taskPackages.map(pkg => 
          pkg.id === selectedPackageId ? {
            ...pkg,
            subTasks: [...pkg.subTasks, { ...JSON.parse(JSON.stringify(subTask)), id: `st-${Date.now()}`, name: `${subTask.name} (副本)` }]
          } : pkg
        )
      }));
    }
  };

  const handleDeleteSubTask = (e: React.MouseEvent, subTaskId: string) => {
    e.stopPropagation();
    if (selectedPackageId) {
      updateCurrentProject(p => ({
        ...p,
        taskPackages: p.taskPackages.map(pkg => 
          pkg.id === selectedPackageId ? {
            ...pkg,
            subTasks: pkg.subTasks.filter(st => st.id !== subTaskId)
          } : pkg
        )
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
        updateCurrentProject(p => ({
          ...p,
          taskPackages: p.taskPackages.map(pkg => 
            pkg.id === selectedPackageId ? {
              ...pkg,
              subTasks: pkg.subTasks.map(st => st.id === selectedSubTaskId ? {
                ...st,
                equipment: [...st.equipment, { id: `eq-${Date.now()}`, name: eqName.trim(), quantity: 1 }]
              } : st)
            } : pkg
          )
        }));
      }
    }
  };

  const handleDeleteEquipment = (eqId: string) => {
    if (selectedPackageId && selectedSubTaskId) {
      updateCurrentProject(p => ({
        ...p,
        taskPackages: p.taskPackages.map(pkg => 
          pkg.id === selectedPackageId ? {
            ...pkg,
            subTasks: pkg.subTasks.map(st => st.id === selectedSubTaskId ? {
              ...st,
              equipment: st.equipment.filter(eq => eq.id !== eqId)
            } : st)
          } : pkg
        )
      }));
    }
  };

  const handleUpdateEquipmentQuantity = (eqId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (selectedPackageId && selectedSubTaskId) {
      updateCurrentProject(p => ({
        ...p,
        taskPackages: p.taskPackages.map(pkg => 
          pkg.id === selectedPackageId ? {
            ...pkg,
            subTasks: pkg.subTasks.map(st => st.id === selectedSubTaskId ? {
              ...st,
              equipment: st.equipment.map(eq => eq.id === eqId ? { ...eq, quantity: newQuantity } : eq)
            } : st)
          } : pkg
        )
      }));
    }
  };

  // Acceptance Criteria Actions
  const handleAddAcceptanceCriteria = () => {
    if (selectedPackageId && selectedSubTaskId) {
      const randomId = Math.floor(Math.random() * 1000);
      const newAc: AcceptanceCriteria = {
        id: `ac-${Date.now()}`,
        imageUrl: `https://picsum.photos/seed/${randomId}/800/600`,
        thumbnailUrl: `https://picsum.photos/seed/${randomId}/150/150`
      };
      
      updateCurrentProject(p => ({
        ...p,
        taskPackages: p.taskPackages.map(pkg => 
          pkg.id === selectedPackageId ? {
            ...pkg,
            subTasks: pkg.subTasks.map(st => st.id === selectedSubTaskId ? {
              ...st,
              acceptanceCriteria: [...st.acceptanceCriteria, newAc]
            } : st)
          } : pkg
        )
      }));
    }
  };

  const handleDeleteAcceptanceCriteria = (e: React.MouseEvent, acId: string) => {
    e.stopPropagation();
    if (selectedPackageId && selectedSubTaskId) {
      updateCurrentProject(p => ({
        ...p,
        taskPackages: p.taskPackages.map(pkg => 
          pkg.id === selectedPackageId ? {
            ...pkg,
            subTasks: pkg.subTasks.map(st => st.id === selectedSubTaskId ? {
              ...st,
              acceptanceCriteria: st.acceptanceCriteria.filter(ac => ac.id !== acId)
            } : st)
          } : pkg
        )
      }));
    }
  };

  // --- Render Helpers ---
  const calculateProjectTotals = (proj: Project) => {
    let totalCost = 0;
    let totalDuration = 0;
    proj.taskPackages.forEach(pkg => {
      pkg.subTasks.forEach(st => {
        totalCost += st.estCost;
        totalDuration += st.estDuration;
      });
    });
    return { totalCost, totalDuration };
  };

  const handleCreateWorkOrderClick = () => {
    setCreateWoStoreId('');
    setIsCreateWorkOrderModalOpen(true);
  };

  const handleConfirmCreateWorkOrder = () => {
    if (!selectedProject || !createWoStoreId) return;
    
    const customerUser = MOCK_USERS.find(u => u.name === selectedProject.customerName);
    const store = customerUser?.stores?.find(s => s.id === createWoStoreId);
    
    if (store) {
      const { totalCost, totalDuration } = calculateProjectTotals(selectedProject);
      
      MOCK_ENGINEERING_WORK_ORDERS.push({
        id: `wo-${Date.now()}`,
        workOrderNumber: `WO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        customerName: selectedProject.customerName,
        projectName: selectedProject.projectName,
        storeName: store.name,
        status: 'CREATED',
        estTotalCost: totalCost,
        estTotalDuration: totalDuration,
        engineerCount: selectedProject.engineerCount,
        drawings: JSON.parse(JSON.stringify(selectedProject.drawings)),
        taskPackages: JSON.parse(JSON.stringify(selectedProject.taskPackages)).map((pkg: any) => ({
          ...pkg,
          subTasks: pkg.subTasks.map((st: any) => ({
            ...st,
            status: 'PENDING',
            actualStatus: 'PENDING'
          }))
        }))
      });
      
      setIsCreateWorkOrderModalOpen(false);
      setAlertConfig({ message: '工单创建成功！请前往“工程类工单”查看。' });
    }
  };

  // --- Render List View ---
  if (!selectedProjectId) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">客户工单配置</h1>
            <p className="text-slate-500 text-sm">管理客户项目及工单模板</p>
          </div>
          <button onClick={handleCreateProject} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新增项目
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'ACTIVE' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            使用中
          </button>
          <button
            onClick={() => setActiveTab('DEPRECATED')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'DEPRECATED' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            已弃用
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
          {projects.filter(p => p.lifecycleStatus === activeTab).map(proj => {
            const { totalCost, totalDuration } = calculateProjectTotals(proj);
            return (
              <div 
                key={proj.id} 
                onClick={() => setSelectedProjectId(proj.id)}
                className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col ${
                  proj.publishStatus === 'PUBLISHED' ? 'border-emerald-200 hover:border-emerald-300' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <div className="text-xs font-medium text-indigo-600 mb-1">{proj.customerName}</div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center">
                      {proj.projectName}
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full ml-2 font-normal border border-slate-200">
                        {proj.version || 'V1.0'}
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {proj.lifecycleStatus !== 'DEPRECATED' && (
                      <>
                        {proj.publishStatus === 'UNPUBLISHED' && (
                          <button 
                            onClick={(e) => handlePublishProject(e, proj)} 
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="发布"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={(e) => handleEditProjectClick(e, proj)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="编辑">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleCopyProject(e, proj)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDeleteProject(e, proj.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-5 bg-slate-50/50 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Est Total Cost</div>
                      <div className="font-semibold text-slate-800">¥{totalCost.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Est Total Duration</div>
                      <div className="font-semibold text-slate-800">{totalDuration} days</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">工程师数量</div>
                      <div className="font-semibold text-slate-800">{proj.engineerCount} 人</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">发布状态</div>
                      <div className={`font-semibold text-xs inline-flex px-2 py-0.5 rounded-full ${
                        proj.lifecycleStatus === 'DEPRECATED' ? 'bg-slate-100 text-slate-400' :
                        proj.publishStatus === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {proj.lifecycleStatus === 'DEPRECATED' ? '已弃用' : proj.publishStatus === 'PUBLISHED' ? '已发布' : '未发布'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Project Modal */}
        {isEditingProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">{editingProject.id ? '编辑项目' : '新增项目'}</h3>
                <button onClick={() => setIsEditingProjectModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">客户名称</label>
                  <input 
                    type="text" 
                    value={editingProject.customerName || ''}
                    onChange={(e) => setEditingProject({...editingProject, customerName: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">项目名称</label>
                  <input 
                    type="text" 
                    value={editingProject.projectName || ''}
                    onChange={(e) => setEditingProject({...editingProject, projectName: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">工程师数量</label>
                  <input 
                    type="number" 
                    value={editingProject.engineerCount || 1}
                    onChange={(e) => setEditingProject({...editingProject, engineerCount: Number(e.target.value)})}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setIsEditingProjectModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">取消</button>
                <button onClick={handleSaveProjectModal} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">下一步</button>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        {alertConfig && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">提示</h3>
                <p className="text-slate-600">{alertConfig.message}</p>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                <button 
                  onClick={() => {
                    if (alertConfig.onConfirm) alertConfig.onConfirm();
                    setAlertConfig(null);
                  }} 
                  className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Render Detail View ---
  if (!selectedProject) return null;

  const isDeprecated = selectedProject.lifecycleStatus === 'DEPRECATED';
  const { totalCost, totalDuration } = calculateProjectTotals(selectedProject);

  const paginatedPackages = selectedProject.taskPackages.slice(packagePage * PACKAGES_PER_PAGE, (packagePage + 1) * PACKAGES_PER_PAGE);
  const totalPackagePages = Math.ceil((selectedProject.taskPackages.length + 1) / PACKAGES_PER_PAGE); // +1 for placeholder

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedProjectId(null)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{selectedProject.projectName}</h1>
            <p className="text-slate-500 text-sm">{selectedProject.customerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveAsDraft}
            disabled={isDeprecated}
            className={`px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg transition-colors font-medium ${isDeprecated ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
          >
            Save as Draft
          </button>
          <button 
            onClick={handleSave}
            disabled={isDeprecated}
            className={`px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg transition-colors font-medium ${isDeprecated ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
          >
            Save
          </button>
          <button 
            onClick={handleCreateWorkOrderClick} 
            disabled={selectedProject.publishStatus !== 'PUBLISHED' || isDeprecated}
            className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
              isDeprecated ? 'bg-slate-200 text-slate-400 cursor-not-allowed' :
              selectedProject.publishStatus === 'PUBLISHED' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Work Order
          </button>
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
                <div className="font-medium text-slate-900">{selectedProject.customerName}</div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-1">项目名称</label>
                <input 
                  type="text" 
                  value={selectedProject.projectName}
                  onChange={(e) => handleProjectInfoChange('projectName', e.target.value)}
                  disabled={isDeprecated}
                  className={`w-full border-b border-transparent focus:outline-none font-medium text-slate-900 transition-colors ${isDeprecated ? 'bg-transparent text-slate-500 cursor-not-allowed' : 'hover:border-slate-300 focus:border-indigo-500'}`}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Est Total Cost (CNY)</label>
                <div className="font-medium text-slate-900">¥{totalCost.toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Est Total Duration (days)</label>
                <div className="font-medium text-slate-900">{totalDuration}</div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">工程师 (数量)</label>
                <input 
                  type="number" 
                  value={selectedProject.engineerCount}
                  onChange={(e) => handleProjectInfoChange('engineerCount', Number(e.target.value))}
                  disabled={isDeprecated}
                  className={`w-24 border-b border-transparent focus:outline-none font-medium text-slate-900 transition-colors ${isDeprecated ? 'bg-transparent text-slate-500 cursor-not-allowed' : 'hover:border-slate-300 focus:border-indigo-500'}`}
                />
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
              {!isDeprecated && (
                <button onClick={handleAddDrawing} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                  <Upload className="w-3 h-3" /> 上传
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {selectedProject.drawings.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-sm">请上传至少一个附件</div>
              ) : (
                selectedProject.drawings.map(dwg => (
                  <div key={dwg.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-700 truncate">{dwg.name}</span>
                    </div>
                    {!isDeprecated && (
                      <button onClick={() => handleDeleteDrawing(dwg.id)} className="p-1 text-slate-400 hover:text-red-500 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Task Packages Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Box className="w-5 h-5 text-indigo-500" />
              任务包
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPackagePage(p => Math.max(0, p - 1))}
                disabled={packagePage === 0}
                className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-slate-500">{packagePage + 1} / {totalPackagePages || 1}</span>
              <button 
                onClick={() => setPackagePage(p => Math.min(totalPackagePages - 1, p + 1))}
                disabled={packagePage >= totalPackagePages - 1}
                className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {paginatedPackages.map(pkg => {
              const pkgCost = pkg.subTasks.reduce((sum, st) => sum + st.estCost, 0);
              const pkgDuration = pkg.subTasks.reduce((sum, st) => sum + st.estDuration, 0);
              const isSelected = selectedPackageId === pkg.id;

              return (
                <div 
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPackageId(pkg.id);
                    setSelectedSubTaskId(pkg.subTasks[0]?.id || null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <h3 className={`font-bold mb-3 truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`} title={pkg.name}>{pkg.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Est Cost:</span>
                      <span className="font-medium text-slate-700">¥{pkgCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Est Duration:</span>
                      <span className="font-medium text-slate-700">{pkgDuration}d</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sub-tasks:</span>
                      <span className="font-medium text-slate-700">{pkg.subTasks.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Placeholder Card for Adding */}
            {paginatedPackages.length < PACKAGES_PER_PAGE && !isDeprecated && (
              <div 
                onClick={() => setIsAddingPackageModal(true)}
                className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 min-h-[120px]"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-medium">添加任务包</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Sub-tasks & Equipment/Acceptance */}
        <div className="grid grid-cols-2 gap-6 pb-6">
          {/* Sub-tasks */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="text-slate-400 font-normal truncate max-w-[150px]" title={selectedPackage?.name}>{selectedPackage?.name || '未选择'}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                子任务
              </h2>
              {selectedPackage && !isDeprecated && (
                <button onClick={handleAddSubTask} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!selectedPackage ? (
                <div className="text-center py-10 text-slate-400 text-sm">请先选择一个任务包</div>
              ) : selectedPackage.subTasks.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">暂无子任务</div>
              ) : (
                selectedPackage.subTasks.map(subTask => {
                  const isSelected = selectedSubTaskId === subTask.id;
                  return (
                    <div 
                      key={subTask.id}
                      onClick={() => setSelectedSubTaskId(subTask.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{subTask.name}</h3>
                        {!isDeprecated && (
                          <div className="flex items-center gap-1">
                            <button onClick={(e) => handleEditSubTaskClick(e, subTask)} className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={(e) => handleCopySubTask(e, subTask)} className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={(e) => handleDeleteSubTask(e, subTask.id)} className="p-1 text-slate-400 hover:text-red-600 rounded">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
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

          {/* Equipment & Acceptance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="text-slate-400 font-normal truncate max-w-[150px]" title={selectedSubTask?.name}>{selectedSubTask?.name || '未选择'}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                设备与验收
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {!selectedSubTask ? (
                <div className="text-center py-10 text-slate-400 text-sm">请先选择一个子任务</div>
              ) : (
                <>
                  {/* Acceptance Criteria */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-indigo-500" />
                        验收标准
                      </h3>
                      {!isDeprecated && (
                        <button onClick={handleAddAcceptanceCriteria} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                          <Plus className="w-3 h-3" /> 上传图片
                        </button>
                      )}
                    </div>
                    {selectedSubTask.acceptanceCriteria.length === 0 ? (
                      <p className="text-sm text-slate-400">暂无验收标准</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
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
                            {!isDeprecated && (
                              <button 
                                onClick={(e) => handleDeleteAcceptanceCriteria(e, ac.id)}
                                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
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
                      {!isDeprecated && (
                        <button onClick={handleAddEquipment} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                          <Plus className="w-3 h-3" /> 添加设备
                        </button>
                      )}
                    </div>
                    {selectedSubTask.equipment.length === 0 ? (
                      <p className="text-sm text-slate-400">暂无设备</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedSubTask.equipment.map(eq => (
                          <div key={eq.id} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium flex items-center gap-2">
                            {eq.name}
                            <div className="flex items-center gap-1 ml-2 border-l border-slate-300 pl-2">
                              <button onClick={() => handleUpdateEquipmentQuantity(eq.id, (eq.quantity || 1) - 1)} disabled={isDeprecated} className={`text-slate-400 ${isDeprecated ? 'cursor-not-allowed opacity-50' : 'hover:text-indigo-600'}`}>-</button>
                              <span className="w-6 text-center">{eq.quantity || 1}</span>
                              <button onClick={() => handleUpdateEquipmentQuantity(eq.id, (eq.quantity || 1) + 1)} disabled={isDeprecated} className={`text-slate-400 ${isDeprecated ? 'cursor-not-allowed opacity-50' : 'hover:text-indigo-600'}`}>+</button>
                            </div>
                            {!isDeprecated && (
                              <button onClick={() => handleDeleteEquipment(eq.id)} className="text-slate-400 hover:text-red-500 ml-1">
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Version Info Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            版本信息
          </h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-xs text-slate-500 mb-1">创建人</label>
              <div className="text-sm text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">{selectedProject.creator || '-'}</div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">创建时间点</label>
              <div className="text-sm text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">{selectedProject.createTime ? new Date(selectedProject.createTime).toLocaleString() : '-'}</div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">更新人</label>
              <div className="text-sm text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">{selectedProject.updater || '-'}</div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">更新时间</label>
              <div className="text-sm text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">{selectedProject.updateTime ? new Date(selectedProject.updateTime).toLocaleString() : '-'}</div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">版本</label>
              <div className="text-sm text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">{selectedProject.version || 'V1.0'}</div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">启用</label>
              <div className="flex items-center h-9">
                <label className={`relative inline-flex items-center ${isDeprecated ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={selectedProject.enabled || false}
                    onChange={(e) => handleProjectInfoChange('enabled', e.target.checked)}
                    disabled={isDeprecated}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-700">{selectedProject.enabled ? '是' : '否'}</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">发布状态</label>
              <div className="text-sm text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">{isDeprecated ? '已弃用' : selectedProject.publishStatus === 'PUBLISHED' ? '已发布' : '未发布'}</div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">发布时间</label>
              <div className="text-sm text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">{selectedProject.publishTime ? new Date(selectedProject.publishTime).toLocaleString() : '-'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Package Modal (Search from Basic Config) */}
      {isAddingPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">添加任务包 (从基础配置)</h3>
              <button onClick={() => setIsAddingPackageModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="搜索任务包名称..." 
                  value={searchPackageQuery}
                  onChange={(e) => setSearchPackageQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {MOCK_TASK_PACKAGES.filter(pkg => pkg.name.toLowerCase().includes(searchPackageQuery.toLowerCase())).map(pkg => (
                <div 
                  key={pkg.id} 
                  className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors"
                  onClick={() => handleAddPackageFromTemplate(pkg)}
                >
                  <div>
                    <h4 className="font-bold text-slate-800">{pkg.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">包含 {pkg.subTasks.length} 个子任务</p>
                  </div>
                  <button className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100">
                    选择
                  </button>
                </div>
              ))}
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

      {/* Create Work Order Modal */}
      {isCreateWorkOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">创建工程类工单</h3>
              <button onClick={() => setIsCreateWorkOrderModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">客户名/项目名称</label>
                <input 
                  type="text" 
                  disabled
                  value={`${selectedProject.customerName} / ${selectedProject.projectName}`}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">门店名称</label>
                <select 
                  value={createWoStoreId}
                  onChange={(e) => setCreateWoStoreId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">请选择门店...</option>
                  {(MOCK_USERS.find(u => u.name === selectedProject.customerName)?.stores || []).map(store => (
                    <option key={store.id} value={store.id}>{store.name} ({store.storeNumber})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setIsCreateWorkOrderModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">取消</button>
              <button 
                onClick={handleConfirmCreateWorkOrder} 
                disabled={!createWoStoreId}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertConfig && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">提示</h3>
              <p className="text-slate-600">{alertConfig.message}</p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button 
                onClick={() => {
                  if (alertConfig.onConfirm) alertConfig.onConfirm();
                  setAlertConfig(null);
                }} 
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
