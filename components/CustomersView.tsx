import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { UserRole, User, CustomerLevel, CustomerRegion } from '../types';
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Store, 
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
  Trash2
} from 'lucide-react';

interface CustomersViewProps {
  regions?: CustomerRegion[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({ regions = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState(MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER));
  const availableVendors = MOCK_USERS.filter(u => u.role === UserRole.VENDOR);
  
  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterMinSpend, setFilterMinSpend] = useState<number>(0);
  const [filterMinStores, setFilterMinStores] = useState<number>(0);
  const [filterJoinDate, setFilterJoinDate] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const initialFormState = {
    name: '',
    enterpriseType: '连锁企业' as '连锁企业' | '个人企业',
    brands: [] as string[],
    email: '',
    address: '',
    adminPhone: '',
    discountRate: 0,
    totalPoints: 0,
    level: CustomerLevel.STANDARD,
    contractValidity: '',
    contractStartDate: '',
    contractEndDate: '',
    region: '',
    storesFile: null as File | null,
    vendors: [] as string[]
  };
  const [formData, setFormData] = useState(initialFormState);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesLevel = filterLevel === 'All' || c.customerLevel === filterLevel;
    const matchesSpend = (c.totalSpending || 0) >= filterMinSpend;
    const matchesStores = (c.storeCount || 0) >= filterMinStores;
    
    // Date comparison (Joined After)
    let matchesDate = true;
    if (filterJoinDate && c.joinDate) {
      matchesDate = new Date(c.joinDate) >= new Date(filterJoinDate);
    }

    return matchesSearch && matchesStatus && matchesLevel && matchesSpend && matchesStores && matchesDate;
  });

  const handleOpenAdd = () => {
    setSelectedCustomer(null);
    setFormData(initialFormState);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: User) => {
    setSelectedCustomer(customer);
    const [start, end] = (customer.contractValidity || '').split(' ~ ');
    setFormData({
      name: customer.name,
      enterpriseType: customer.enterpriseType || '连锁企业',
      region: customer.region || '',
      brands: customer.brands || [],
      email: customer.email,
      address: customer.address || '',
      adminPhone: customer.adminPhone || '',
      discountRate: customer.discountRate || 0,
      totalPoints: customer.totalPoints || 0,
      level: customer.customerLevel || CustomerLevel.STANDARD,
      contractValidity: customer.contractValidity || '',
      contractStartDate: start || '',
      contractEndDate: end || '',
      storesFile: null,
      vendors: customer.vendors || []
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const validity = formData.contractStartDate && formData.contractEndDate 
      ? `${formData.contractStartDate} ~ ${formData.contractEndDate}`
      : formData.contractValidity;

    if (isEditMode && selectedCustomer) {
      setCustomers(customers.map(c => 
        c.id === selectedCustomer.id 
          ? { 
              ...c, 
              name: formData.name, 
              enterpriseType: formData.enterpriseType,
              region: formData.region,
              brands: formData.brands,
              email: formData.email, 
              address: formData.address, 
              adminPhone: formData.adminPhone, 
              discountRate: formData.discountRate, 
              totalPoints: formData.totalPoints,
              customerLevel: formData.level,
              contractValidity: validity,
              vendors: formData.vendors
            } 
          : c
      ));
    } else {
      const newCustomer: User = {
        id: Date.now().toString(),
        name: formData.name,
        enterpriseType: formData.enterpriseType,
        region: formData.region,
        brands: formData.brands,
        email: formData.email,
        role: UserRole.CUSTOMER,
        status: 'Active',
        lastActive: new Date().toISOString().split('T')[0],
        joinDate: new Date().toISOString().split('T')[0],
        address: formData.address,
        adminPhone: formData.adminPhone,
        discountRate: formData.discountRate,
        totalPoints: formData.totalPoints,
        customerLevel: formData.level,
        contractValidity: validity,
        vendors: formData.vendors,
        storeCount: 0,
        recentOrderCount: 0,
        totalSpending: 0
      };
      setCustomers([newCustomer, ...customers]);
    }
    setIsModalOpen(false);
  };

  const getLevelBadge = (level?: CustomerLevel) => {
    switch (level) {
      case CustomerLevel.PLATINUM:
        return <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200">白金级</span>;
      case CustomerLevel.GOLD:
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">黄金级</span>;
      case CustomerLevel.SILVER:
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200">白银级</span>;
      default:
        return <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-medium border border-slate-100">标准级</span>;
    }
  };

  const clearFilters = () => {
    setFilterStatus('All');
    setFilterLevel('All');
    setFilterMinSpend(0);
    setFilterMinStores(0);
    setFilterJoinDate('');
    setSearchQuery('');
  };

  const activeFilterCount = [
    filterStatus !== 'All',
    filterLevel !== 'All',
    filterMinSpend > 0,
    filterMinStores > 0,
    filterJoinDate !== ''
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">客户管理</h1>
          <p className="text-slate-500 text-sm">跟踪客户增长、订单和合同详情</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> 新增客户
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
                placeholder="按名称搜索客户..." 
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
                <label className="block text-xs font-semibold text-slate-500 mb-1">客户等级</label>
                <select 
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">所有等级</option>
                  {Object.values(CustomerLevel).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Min Spend Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">最低消费</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 text-xs">$</span>
                  <input 
                    type="number" 
                    value={filterMinSpend || ''}
                    placeholder="0"
                    onChange={(e) => setFilterMinSpend(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Min Stores Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">最少门店</label>
                <div className="relative">
                  <Store className="w-3 h-3 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="number" 
                    value={filterMinStores || ''}
                    placeholder="0"
                    onChange={(e) => setFilterMinStores(Number(e.target.value))}
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
          {filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
               <Filter className="w-12 h-12 mb-3 opacity-20" />
               <p>没有符合您筛选条件的客户。</p>
               <button onClick={clearFilters} className="mt-2 text-indigo-600 hover:underline text-sm">清除筛选</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">客户名称</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">企业类型</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">加入日期</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">门店数</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">订单 (3月)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">总消费</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">等级</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => handleOpenEdit(customer)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{customer.company || customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        customer.enterpriseType === '个人企业' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {customer.enterpriseType || '连锁企业'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {customer.joinDate || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                        <Store className="w-4 h-4 text-slate-400" />
                        {customer.storeCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                        <BarChart className="w-4 h-4 text-slate-400" />
                        {customer.recentOrderCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        {(customer.totalSpending || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getLevelBadge(customer.customerLevel)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
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
                {isEditMode ? '编辑客户详情' : '添加新客户'}
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
                    <label className="block text-xs font-semibold text-slate-500 mb-1">公司 / 客户名称</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">企业类型</label>
                    <select 
                      value={formData.enterpriseType}
                      onChange={e => setFormData({...formData, enterpriseType: e.target.value as '连锁企业' | '个人企业'})}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="连锁企业">连锁企业</option>
                      <option value="个人企业">个人企业</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">区域</label>
                    <select 
                      value={formData.region}
                      onChange={e => setFormData({...formData, region: e.target.value})}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="">请选择区域</option>
                      {regions.map(r => (
                        <option key={r.id} value={r.regionName}>{r.regionName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">品牌 (多个品牌请用逗号分隔)</label>
                    <input 
                      type="text" 
                      value={formData.brands.join(', ')}
                      onChange={e => setFormData({...formData, brands: e.target.value.split(',').map(b => b.trim()).filter(Boolean)})}
                      placeholder="例如：KFC, Pizza Hut"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">邮箱地址</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">管理员电话</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.adminPhone}
                        onChange={e => setFormData({...formData, adminPhone: e.target.value})}
                        className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Business & Contract */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
                  合同与业务
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">客户等级</label>
                    <select 
                      value={formData.level}
                      onChange={e => setFormData({...formData, level: e.target.value as CustomerLevel})}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      {Object.values(CustomerLevel).map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">折扣率 (%)</label>
                    <div className="relative">
                      <Percent className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="number" 
                        value={formData.discountRate}
                        onChange={e => setFormData({...formData, discountRate: Number(e.target.value)})}
                        className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">总积分 (从充值记录同步)</label>
                    <input 
                      type="number" 
                      value={formData.totalPoints}
                      disabled
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">合同有效期</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input 
                          type="date" 
                          value={formData.contractStartDate}
                          onChange={e => setFormData({...formData, contractStartDate: e.target.value})}
                          className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input 
                          type="date" 
                          value={formData.contractEndDate}
                          onChange={e => setFormData({...formData, contractEndDate: e.target.value})}
                          className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
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

              {/* Section 3: Vendors List */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
                  供应商列表
                </h3>
                <div className="space-y-3">
                  {formData.vendors.length > 0 ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                      {formData.vendors.map(vendorId => {
                        const vendor = availableVendors.find(v => v.id === vendorId);
                        if (!vendor) return null;
                        return (
                          <div key={vendorId} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                {vendor.company ? vendor.company.charAt(0) : vendor.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">{vendor.company || vendor.name}</p>
                                <p className="text-xs text-slate-500">{vendor.name}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setFormData({...formData, vendors: formData.vendors.filter(id => id !== vendorId)})}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="移除供应商"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">暂无关联的供应商</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <select 
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      onChange={(e) => {
                        if (e.target.value && !formData.vendors.includes(e.target.value)) {
                          setFormData({...formData, vendors: [...formData.vendors, e.target.value]});
                        }
                        e.target.value = ''; // reset after selection
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>+ 添加供应商</option>
                      {availableVendors.filter(v => !formData.vendors.includes(v.id)).map(vendor => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.company || vendor.name} ({vendor.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Store Import */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">4</span>
                  门店位置
                </h3>
                <div className="space-y-4">
                  <div className={`bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3 ${formData.enterpriseType === '个人企业' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                     <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
                     <div>
                       <h4 className="text-sm font-bold text-blue-900">批量导入门店</h4>
                       <p className="text-xs text-blue-700 mt-1">上传包含以下列的 Excel 文件：StoreID, Name, Address, StorePhone。</p>
                       <label className={`mt-2 text-xs bg-white text-blue-600 px-3 py-1.5 rounded border border-blue-200 font-medium hover:bg-blue-50 shadow-sm flex items-center gap-2 w-max ${formData.enterpriseType === '个人企业' ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                         <UploadCloud className="w-3 h-3" /> 选择 Excel 文件
                         <input type="file" accept=".xlsx, .xls, .csv" className="hidden" disabled={formData.enterpriseType === '个人企业'} />
                       </label>
                     </div>
                  </div>

                  {/* Display existing stores if editing */}
                  {isEditMode && selectedCustomer?.stores && selectedCustomer.stores.length > 0 && (
                    <div className="border rounded-lg overflow-hidden border-slate-200">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-semibold text-slate-500">
                        现有门店 ({selectedCustomer.stores.length})
                      </div>
                      <div className="max-h-40 overflow-y-auto divide-y divide-slate-100">
                         {selectedCustomer.stores.map((store, i) => (
                           <div key={i} className="px-4 py-2 text-sm flex justify-between items-center hover:bg-slate-50">
                             <div>
                               <p className="font-medium text-slate-900">{store.name}</p>
                               <p className="text-xs text-slate-500">{store.address}</p>
                             </div>
                             <span className="text-xs text-slate-400">{store.storeNumber}</span>
                           </div>
                         ))}
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
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> 保存客户
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};