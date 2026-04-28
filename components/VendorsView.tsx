import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { UserRole, User, VendorLevel } from '../types';
import { useSharedDeviceCategories } from '../lib/deviceCategoryStore';
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Users as UsersIcon, 
  Calendar, 
  DollarSign, 
  BarChart, 
  X,
  FileSpreadsheet,
  UploadCloud,
  MapPin,
  Phone,
  FileText,
  Percent,
  Check,
  SlidersHorizontal,
  Filter,
  Building2,
  Signal,
  ChevronRight,
  Edit,
  UserPlus
} from 'lucide-react';

interface VendorsViewProps {
  initialVendorId?: string;
  initialReadOnly?: boolean;
  onClearParams?: () => void;
}

export const VendorsView: React.FC<VendorsViewProps> = ({ initialVendorId, initialReadOnly, onClearParams }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState(MOCK_USERS.filter(u => u.role === UserRole.VENDOR));
  
  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterMinRevenue, setFilterMinRevenue] = useState<number>(0);
  const [filterMinEngineers, setFilterMinEngineers] = useState<number>(0);
  const [filterJoinDate, setFilterJoinDate] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const { categories: deviceCategories } = useSharedDeviceCategories();

  // Form State
  const initialFormState = {
    name: '',
    email: '',
    address: '',
    adminPhone: '',
    commissionRate: 15,
    level: VendorLevel.TIER_3,
    engineersFile: null as File | null,
    parentId: undefined as string | undefined,
    supportedDeviceIds: [] as string[]
  };
  const [formData, setFormData] = useState(initialFormState);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  // Handle initial params
  React.useEffect(() => {
    if (initialVendorId) {
      const vendor = vendors.find(v => v.id === initialVendorId);
      if (vendor) {
        handleOpenEdit(vendor, initialReadOnly);
      }
      if (onClearParams) onClearParams();
    }
  }, [initialVendorId, initialReadOnly]);

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
    const matchesLevel = filterLevel === 'All' || v.vendorLevel === filterLevel;
    const matchesRevenue = (v.totalRevenue || 0) >= filterMinRevenue;
    const matchesEngineers = (v.registeredEngineers || 0) >= filterMinEngineers;
    
    // Date comparison (Joined After)
    let matchesDate = true;
    if (filterJoinDate && v.joinDate) {
      matchesDate = new Date(v.joinDate) >= new Date(filterJoinDate);
    }

    return matchesSearch && matchesStatus && matchesLevel && matchesRevenue && matchesEngineers && matchesDate;
  });

  const handleOpenAdd = () => {
    setSelectedVendor(null);
    setFormData(initialFormState);
    setIsEditMode(false);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleOpenAddSubVendor = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVendor(null);
    setFormData({ ...initialFormState, parentId });
    setIsEditMode(false);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (isEditMode && selectedVendor) {
      setVendors(vendors.map(v => v.id === selectedVendor.id ? {
        ...v,
        name: formData.name,
        company: formData.name,
        email: formData.email,
        address: formData.address,
        adminPhone: formData.adminPhone,
        commissionRate: formData.commissionRate,
        vendorLevel: formData.level,
        supportedDeviceIds: formData.supportedDeviceIds
      } : v));
    } else {
      const newVendor: User = {
        id: `VEND-${Date.now()}`,
        name: formData.name,
        company: formData.name,
        email: formData.email,
        role: UserRole.VENDOR,
        status: 'Active',
        lastActive: '刚刚',
        joinDate: new Date().toISOString().split('T')[0],
        address: formData.address,
        adminPhone: formData.adminPhone,
        commissionRate: formData.commissionRate,
        vendorLevel: formData.level,
        parentId: formData.parentId,
        supportedDeviceIds: formData.supportedDeviceIds
      };
      setVendors([newVendor, ...vendors]);
      if (formData.parentId) {
        setExpandedRows(prev => new Set(prev).add(formData.parentId!));
      }
    }
    setIsModalOpen(false);
  };

  const handleOpenEdit = (vendor: User, readOnly: boolean = false) => {
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      address: vendor.address || '',
      adminPhone: vendor.adminPhone || '',
      commissionRate: vendor.commissionRate || 15,
      level: vendor.vendorLevel || VendorLevel.TIER_3,
      engineersFile: null,
      supportedDeviceIds: vendor.supportedDeviceIds || []
    });
    setIsEditMode(true);
    setIsReadOnly(readOnly);
    setIsModalOpen(true);
  };

  const getLevelBadge = (level?: VendorLevel) => {
    switch (level) {
      case VendorLevel.PARTNER:
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">合作伙伴</span>;
      case VendorLevel.TIER_1:
        return <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200">一级</span>;
      case VendorLevel.TIER_2:
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">二级</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">三级</span>;
    }
  };

  const clearFilters = () => {
    setFilterStatus('All');
    setFilterLevel('All');
    setFilterMinRevenue(0);
    setFilterMinEngineers(0);
    setFilterJoinDate('');
    setSearchQuery('');
  };

  const activeFilterCount = [
    filterStatus !== 'All',
    filterLevel !== 'All',
    filterMinRevenue > 0,
    filterMinEngineers > 0,
    filterJoinDate !== ''
  ].filter(Boolean).length;

  const rootVendors = filteredVendors.filter(v => !v.parentId || !filteredVendors.some(fv => fv.id === v.parentId));
  
  const getVisibleVendors = () => {
    const visible: (User & { depth: number; hasChildren: boolean })[] = [];
    
    const traverse = (nodes: User[], depth: number) => {
      nodes.forEach(node => {
        const children = filteredVendors.filter(v => v.parentId === node.id);
        visible.push({ ...node, depth, hasChildren: children.length > 0 });
        if (expandedRows.has(node.id) && children.length > 0) {
          traverse(children, depth + 1);
        }
      });
    };
    
    traverse(rootVendors, 0);
    return visible;
  };

  const visibleVendors = getVisibleVendors();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">供应商管理</h1>
          <p className="text-slate-500 text-sm">管理供应商合作、工程师资源池和绩效</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> 添加供应商
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        {/* Toolbar & Filters */}
        <div className="border-b border-slate-100 bg-white z-10">
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="按名称搜索供应商..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                isFilterOpen || activeFilterCount > 0
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              筛选
              {activeFilterCount > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-4 animate-in slide-in-from-top-2 duration-200">
              
              {/* Status Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">状态</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">所有状态</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">供应商等级</label>
                <select 
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">所有等级</option>
                  {Object.values(VendorLevel).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Min Revenue Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">最低营收</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 text-xs">$</span>
                  <input 
                    type="number" 
                    value={filterMinRevenue || ''}
                    placeholder="0"
                    onChange={(e) => setFilterMinRevenue(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Min Engineers Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">最少工程师</label>
                <div className="relative">
                  <UsersIcon className="w-3 h-3 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="number" 
                    value={filterMinEngineers || ''}
                    placeholder="0"
                    onChange={(e) => setFilterMinEngineers(Number(e.target.value))}
                    className="w-full pl-8 pr-2 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Join Date Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">加入时间晚于</label>
                <input 
                  type="date" 
                  value={filterJoinDate}
                  onChange={(e) => setFilterJoinDate(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 text-slate-600"
                />
              </div>

              {/* Reset Button */}
              {activeFilterCount > 0 && (
                <div className="md:col-span-5 flex justify-end">
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> 清除所有筛选
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          {filteredVendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
               <Filter className="w-12 h-12 mb-3 opacity-20" />
               <p>没有符合您筛选条件的供应商。</p>
               <button onClick={clearFilters} className="mt-2 text-indigo-600 hover:underline text-sm">清除筛选</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">供应商名称</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">加入日期</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">注册工程师</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">在线</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">订单 (3月)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">总营收</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">等级</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleVendors.map((vendor) => (
                  <tr 
                    key={vendor.id} 
                    onClick={() => handleOpenEdit(vendor)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3" style={{ paddingLeft: `${vendor.depth * 24}px` }}>
                        {vendor.hasChildren ? (
                          <button 
                            onClick={(e) => toggleRow(vendor.id, e)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500"
                          >
                            <ChevronRight className={`w-4 h-4 transition-transform ${expandedRows.has(vendor.id) ? 'rotate-90' : ''}`} />
                          </button>
                        ) : (
                          <div className="w-6" /> // Spacer
                        )}
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shrink-0">
                          {vendor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{vendor.company || vendor.name}</p>
                          <p className="text-xs text-slate-500">{vendor.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {vendor.joinDate || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        vendor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-slate-700">
                        {vendor.registeredEngineers || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="flex items-center justify-center gap-1.5">
                         <span className="w-2 h-2 rounded-full bg-green-500"></span>
                         <span className="text-sm font-medium text-slate-900">{vendor.onlineEngineers || 0}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                        <BarChart className="w-4 h-4 text-slate-400" />
                        {vendor.recentOrderCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        {(vendor.totalRevenue || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getLevelBadge(vendor.vendorLevel)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(vendor); }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleOpenAddSubVendor(vendor.id, e)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                          title="添加子供应商"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit/Add Drawer (Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-slate-900">
                {isReadOnly ? '供应商详情' : isEditMode ? '编辑供应商详情' : '供应商入驻'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
              
              {/* Section 1: Basic Info */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
                  基本信息
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">公司 / 供应商名称</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.name}
                        disabled={isReadOnly}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">邮箱地址</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled={isReadOnly}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">管理员电话</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.adminPhone}
                        disabled={isReadOnly}
                        onChange={e => setFormData({...formData, adminPhone: e.target.value})}
                        className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">总部地址</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.address}
                        disabled={isReadOnly}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Business Details */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
                  合作详情
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">供应商等级</label>
                    <select 
                      value={formData.level}
                      disabled={isReadOnly}
                      onChange={e => setFormData({...formData, level: e.target.value as VendorLevel})}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      {Object.values(VendorLevel).map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">佣金比例 (%)</label>
                    <div className="relative">
                      <Percent className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="number" 
                        value={formData.commissionRate}
                        disabled={isReadOnly}
                        onChange={e => setFormData({...formData, commissionRate: Number(e.target.value)})}
                        className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-2">支持维修设备</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      {deviceCategories.map(cat => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox"
                            disabled={isReadOnly}
                            checked={formData.supportedDeviceIds?.includes(cat)}
                            onChange={(e) => {
                              const newSelection = e.target.checked 
                                ? [...(formData.supportedDeviceIds || []), cat]
                                : (formData.supportedDeviceIds || []).filter(id => id !== cat);
                              setFormData({ ...formData, supportedDeviceIds: newSelection });
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                          />
                          <span className={`text-xs ${formData.supportedDeviceIds?.includes(cat) ? 'text-indigo-700 font-medium' : 'text-slate-600'} group-hover:text-indigo-600 transition-colors`}>
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                     <label className="block text-xs font-semibold text-slate-500 mb-1">营业执照</label>
                     <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <FileText className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 font-medium">点击上传营业执照</p>
                        <p className="text-xs text-slate-400">PDF, JPG 或 PNG，最大 10MB</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Engineer Roster Import */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
                  工程师团队
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                     <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
                     <div>
                       <h4 className="text-sm font-bold text-blue-900">批量导入工程师</h4>
                       <p className="text-xs text-blue-700 mt-1">上传包含以下列的 Excel 花名册：Name, ID_Card, PhoneNumber。</p>
                       <label className="mt-2 text-xs bg-white text-blue-600 px-3 py-1.5 rounded border border-blue-200 font-medium hover:bg-blue-50 shadow-sm flex items-center gap-2 cursor-pointer w-max">
                         <UploadCloud className="w-3 h-3" /> 选择 Excel 文件
                         <input type="file" accept=".xlsx, .xls, .csv" className="hidden" />
                       </label>
                     </div>
                  </div>
                  
                  {isEditMode && selectedVendor && (
                     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="p-2 bg-white rounded shadow-sm border border-slate-100">
                           <Signal className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                           <p className="text-sm font-semibold text-slate-900">{selectedVendor.onlineEngineers || 0} / {selectedVendor.registeredEngineers || 0} 在线</p>
                           <p className="text-xs text-slate-500">当前工程师可用性</p>
                        </div>
                     </div>
                  )}
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                {isReadOnly ? '关闭' : '取消'}
              </button>
              {!isReadOnly && (
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> 保存供应商
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};