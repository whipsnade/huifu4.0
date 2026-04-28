import React, { useState, useMemo, useRef } from 'react';
import { MOCK_USERS, MOCK_WORK_ORDERS } from '../constants';
import { UserRole, User, Complexity } from '../types';
import { EngineerDetailView } from './EngineerDetailView';
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import { 
  MapPin, 
  Star, 
  Award, 
  Briefcase, 
  Clock, 
  Search, 
  MoreHorizontal,
  Mail,
  User as UserIcon,
  Activity,
  SlidersHorizontal,
  Building2,
  ChevronDown,
  ChevronRight,
  Filter,
  Plus,
  DollarSign,
  Calendar,
  X,
  Check,
  Phone,
  CreditCard,
  Image as ImageIcon,
  LayoutGrid,
  List,
  UserPlus,
  Users,
  MonitorCheck,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Timer,
  ArrowUp,
  ArrowDown,
  Upload,
  Download
} from 'lucide-react';

export const EngineersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ROSTER' | 'RECRUITMENT'>('DASHBOARD');
  
  // Data
  const [engineers, setEngineers] = useState(MOCK_USERS.filter(u => u.role === UserRole.ENGINEER));
  
  // Roster Filter States
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tree expansion state for device nodes (types and brands)
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) ? prev.filter(n => n !== nodeId) : [...prev, nodeId]
    );
  };
  
  // Tree expansion state for city nodes
  const [expandedCities, setExpandedCities] = useState<string[]>([]);
  const toggleCityNode = (city: string) => {
    setExpandedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const cityTreeData = [
    { city: '北京', districts: ['朝阳区', '海淀区', '西城区', '东城区', '丰台区'] },
    { city: '上海', districts: ['浦东新区', '黄浦区', '静安区', '徐汇区', '长宁区'] },
    { city: '广州', districts: ['天河区', '越秀区', '海珠区', '白云区', '番禺区'] },
    { city: '深圳', districts: ['南山区', '福田区', '宝安区', '龙岗区', '罗湖区'] }
  ];

  const deviceTreeData = [
    {
      type: '空调 (Air Conditioner)',
      brands: [
        { brand: '海尔 (Haier)', models: ['KFR-35GW', 'KFR-50GW', 'KFR-72LW'] },
        { brand: '格力 (Gree)', models: ['云佳', '云锦 II', '云海'] },
        { brand: '美的 (Midea)', models: ['酷省电', '风尊 II', '静新风'] }
      ]
    },
    {
      type: '冰箱 (Refrigerator)',
      brands: [
        { brand: '西门子 (Siemens)', models: ['BCD-502W', 'BCD-610W'] },
        { brand: '海尔 (Haier)', models: ['BCD-458W', 'BCD-545W'] }
      ]
    },
    {
      type: '洗衣机 (Washing Machine)',
      brands: [
        { brand: '小天鹅 (Little Swan)', models: ['TG100V88WMUI', 'TG100V62ADS5'] },
        { brand: '松下 (Panasonic)', models: ['XQG100-EA10', 'XQG100-EG10'] }
      ]
    }
  ];
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterLocation, setFilterLocation] = useState<{city: string, district: string}>({city: 'All', district: 'All'});
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterEngType, setFilterEngType] = useState('All');
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'VIEW' | 'EDIT' | 'ADD'>('VIEW');
  const [selectedEngineer, setSelectedEngineer] = useState<User | null>(null);

  const vendors = useMemo(() => MOCK_USERS.filter(u => u.role === UserRole.VENDOR), []);

  const initialFormState = {
    name: '',
    city: '',
    district: '',
    phoneNumber: '',
    engType: '' as '个人工程师' | '供应商工程师' | '',
    level: '' as 'Junior' | 'Mid' | 'Senior' | 'Expert' | '',
    serviceStations: [] as string[],
    distanceSettings: [] as string[],
    idCardPhoto: null as File | null,
    avatar: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isCityPopoverOpen, setIsCityPopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- DERIVED LISTS ---
  
  // 1. Active Roster (Non-applicants)
  const rosterEngineers = useMemo(() => {
    return engineers.filter(e => !['Applicant', 'Interviewing', 'Rejected'].includes(e.status));
  }, [engineers]);

  // 2. Applicants
  const applicants = useMemo(() => {
    return engineers.filter(e => ['Applicant', 'Interviewing'].includes(e.status));
  }, [engineers]);

  // 3. Filtered & Sorted Roster
  const filteredRoster = useMemo(() => {
    let result = rosterEngineers.filter(eng => {
      const matchesSearch = eng.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = filterLocation.city === 'All' || eng.city === filterLocation.city;
      const matchesDistrict = filterLocation.district === 'All' || eng.district === filterLocation.district;
      const matchesLevel = filterLevel === 'All' || eng.level === filterLevel;
      const matchesStatus = filterStatus === 'All' || eng.status === filterStatus;
      const matchesEngType = filterEngType === 'All' || eng.engType === filterEngType;
      return matchesSearch && matchesCity && matchesDistrict && matchesLevel && matchesStatus && matchesEngType;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        // @ts-ignore - Dynamic access with fallback
        const valA = a[sortConfig.key] ?? 0;
        // @ts-ignore
        const valB = b[sortConfig.key] ?? 0;

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rosterEngineers, searchQuery, filterLocation, filterLevel, filterStatus, sortConfig]);

  // --- DASHBOARD DATA ---
  
  const statusData = [
    { name: 'Active', value: rosterEngineers.filter(e => e.status === 'Active').length, color: '#10b981' },
    { name: 'Busy', value: rosterEngineers.filter(e => e.status === 'Busy').length, color: '#f59e0b' },
    { name: 'Inactive', value: rosterEngineers.filter(e => e.status === 'Inactive').length, color: '#94a3b8' },
  ];

  // Calculate total hours for top engineers based on "Busy Rate" proxy for demo
  const workloadData = rosterEngineers
    .sort((a, b) => (b.busyRate || 0) - (a.busyRate || 0))
    .slice(0, 5)
    .map(e => ({
      name: e.name.split(' ')[0],
      busyRate: e.busyRate || 0,
      estimatedHours: Math.round((e.busyRate || 0) * 0.4) // Approx 40h week
    }));

  const recruitmentStats = {
    total: applicants.length,
    interviewing: applicants.filter(a => a.status === 'Interviewing').length,
    new: applicants.filter(a => a.status === 'Applicant').length,
    avgScore: Math.round(applicants.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / (applicants.length || 1))
  };

  // --- HANDLERS ---

  const handleRowClick = (engineer: User) => {
    setSelectedEngineer(engineer);
    setViewMode('VIEW');
    setIsDrawerOpen(true);
  };

  const handleEditClick = (engineer: User) => {
    setSelectedEngineer(engineer);
    setFormData({
      name: engineer.name,
      city: engineer.city || '',
      district: engineer.district || '',
      phoneNumber: engineer.phoneNumber || '',
      engType: engineer.engType || '',
      level: 'Junior',
      serviceStations: engineer.serviceStations || [],
      distanceSettings: (engineer as any).distanceSettings || [],
      idCardPhoto: null,
      avatar: engineer.avatar || ''
    });
    setViewMode('EDIT');
    setIsDrawerOpen(true);
  };

  const handleAddClick = () => {
    setSelectedEngineer(null);
    setFormData({ ...initialFormState, level: 'Junior' });
    setViewMode('ADD');
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (viewMode === 'ADD') {
      const newEngineer: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        role: UserRole.ENGINEER,
        status: 'Applicant',
        lastActive: '刚刚',
        city: formData.city,
        district: formData.district,
        phoneNumber: formData.phoneNumber,
        engType: formData.engType as '个人工程师' | '供应商工程师',
        serviceStations: formData.serviceStations,
        avatar: formData.avatar,
        joinDate: new Date().toISOString().split('T')[0],
        busyRate: 0,
        csat: 0,
        level: 'Junior',
        totalIncome: 0,
        recentOrderCount: 0
      };
      setEngineers(prev => [newEngineer, ...prev]);
    } else if (viewMode === 'EDIT' && selectedEngineer) {
      setEngineers(prev => prev.map(e => e.id === selectedEngineer.id ? {
        ...e,
        name: formData.name,
        city: formData.city,
        district: formData.district,
        phoneNumber: formData.phoneNumber,
        engType: formData.engType as '个人工程师' | '供应商工程师',
        serviceStations: formData.serviceStations,
        avatar: formData.avatar
      } : e));
    }
    setIsDrawerOpen(false);
  };

  const updateApplicantStatus = (id: string, newStatus: 'Active' | 'Rejected' | 'Interviewing') => {
    setEngineers(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const handleSort = (key: keyof User) => {
    setSortConfig(current => {
      if (current?.key === key && current.direction === 'desc') {
        return { key, direction: 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  // Unique lists for dropdowns
  const uniqueLevels = Array.from(new Set(rosterEngineers.map(e => e.level).filter(Boolean)));

  const activeFiltersCount = [
    filterLocation.city !== 'All',
    filterLevel !== 'All',
    filterStatus !== 'All',
    filterEngType !== 'All'
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterLocation({city: 'All', district: 'All'});
    setFilterLevel('All');
    setFilterStatus('All');
    setFilterEngType('All');
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ECN 管理</h1>
          <p className="text-slate-500 text-sm">工程师合作网络：招聘、监控和名册管理</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('DASHBOARD')}
             className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'DASHBOARD' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <MonitorCheck className="w-4 h-4"/> 概览
           </button>
           <button 
             onClick={() => setActiveTab('ROSTER')}
             className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'ROSTER' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <List className="w-4 h-4"/> 花名册
           </button>
           <button 
             onClick={() => setActiveTab('RECRUITMENT')}
             className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'RECRUITMENT' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <UserPlus className="w-4 h-4"/> 招聘 
             {applicants.length > 0 && <span className="bg-indigo-600 text-white text-[10px] px-1.5 rounded-full">{applicants.length}</span>}
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm">
        
        {/* --- VIEW: DASHBOARD --- */}
        {activeTab === 'DASHBOARD' && (
          <div className="h-full overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            
            {/* KPI Cards - Bento Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><Briefcase className="w-6 h-6"/></div>
                   <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                     <ArrowUp className="w-3 h-3"/> 12%
                   </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{rosterEngineers.length}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">活跃工程师</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600"><Activity className="w-6 h-6"/></div>
                   <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">实时</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{statusData.find(s => s.name === 'Active')?.value || 0}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">当前在线</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600"><Clock className="w-6 h-6"/></div>
                   <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">高负荷</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{statusData.find(s => s.name === 'Busy')?.value || 0}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">工作中</p>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Timer className="w-6 h-6"/></div>
                   <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">本周</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{workloadData.reduce((a, b) => a + b.estimatedHours, 0)}h</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">总服务时长</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Workload Chart */}
               <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">工程师效能排行 (小时/周)</h3>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                      查看详情 <ChevronRight className="w-3 h-3"/>
                    </button>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={workloadData} layout="vertical" margin={{ left: 30, right: 30 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          tick={{fontSize: 12, fontWeight: 500, fill: '#64748b'}} 
                          width={80} 
                          axisLine={false}
                          tickLine={false}
                        />
                        <RechartsTooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                        />
                        <Bar 
                          dataKey="estimatedHours" 
                          fill="#6366f1" 
                          radius={[0, 6, 6, 0]} 
                          barSize={24} 
                          name="工作时长" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 实际工时</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-200"></span> 预计工时</span>
                  </div>
               </div>

               {/* Status Chart & Top Performers */}
               <div className="space-y-6">
                 <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">资源分布</h3>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {statusData.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{backgroundColor: s.color}}></span>
                            <span className="text-slate-600">{s.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">{s.value}</span>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">高分工程师</h3>
                    <div className="space-y-4">
                      {rosterEngineers
                        .sort((a, b) => (b.csat || 0) - (a.csat || 0))
                        .slice(0, 3)
                        .map((eng, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                              {eng.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{eng.name}</p>
                              <p className="text-xs text-slate-500 truncate">{eng.specialization}</p>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3 h-3 fill-current"/>
                              <span className="text-sm font-bold">{eng.csat}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* --- VIEW: ROSTER --- */}
        {activeTab === 'ROSTER' && (
          <div className="flex flex-col h-full bg-slate-50/30">
            {/* Quick Stats Bar */}
            <div className="px-6 py-4 flex items-center gap-8 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Users className="w-4 h-4"/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">总计</p>
                  <p className="text-sm font-bold text-slate-900">{rosterEngineers.length}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Activity className="w-4 h-4"/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">在线</p>
                  <p className="text-sm font-bold text-slate-900">{rosterEngineers.filter(e => e.status === 'Active').length}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Building2 className="w-4 h-4"/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">供应商工程师</p>
                  <p className="text-sm font-bold text-slate-900">{rosterEngineers.filter(e => e.engType === '供应商工程师').length}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><UserIcon className="w-4 h-4"/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">个人工程师</p>
                  <p className="text-sm font-bold text-slate-900">{rosterEngineers.filter(e => e.engType === '个人工程师').length}</p>
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="p-4 border-b border-slate-100 bg-white z-10 space-y-4">
              <div className="flex items-center justify-between gap-4">
                 <div className="relative flex-1 max-w-md">
                   <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   <input 
                     type="text" 
                     placeholder="搜索花名册..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   />
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                        isFilterOpen || activeFiltersCount > 0
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      筛选
                      {activeFiltersCount > 0 && (
                        <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={() => setIsImportModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Upload className="w-4 h-4" /> 导入
                    </button>
                    <button 
                      onClick={handleAddClick}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> 添加工程师
                    </button>
                 </div>
              </div>

              {/* Collapsible Filter Panel */}
              {isFilterOpen && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg animate-in slide-in-from-top-2 duration-200">
                   <div>
                     <label className="block text-xs font-semibold text-slate-500 mb-1">城市/地区</label>
                     <div className="border border-slate-200 rounded-lg p-2 bg-white max-h-48 overflow-y-auto">
                        <div 
                          onClick={() => setFilterLocation({city: 'All', district: 'All'})}
                          className={`px-2 py-1 text-sm rounded cursor-pointer mb-1 ${filterLocation.city === 'All' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                          所有城市
                        </div>
                        {cityTreeData.map(item => (
                          <div key={item.city} className="space-y-1">
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => toggleCityNode(item.city)}
                                className="p-0.5 hover:bg-slate-100 rounded"
                              >
                                {expandedCities.includes(item.city) ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                              </button>
                              <div 
                                onClick={() => setFilterLocation({city: item.city, district: 'All'})}
                                className={`flex-1 px-1 py-0.5 text-sm rounded cursor-pointer ${filterLocation.city === item.city && filterLocation.district === 'All' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
                              >
                                {item.city}
                              </div>
                            </div>
                            {expandedCities.includes(item.city) && (
                              <div className="ml-4 pl-2 border-l border-slate-100 space-y-1">
                                {item.districts.map(d => (
                                  <div 
                                    key={d}
                                    onClick={() => setFilterLocation({city: item.city, district: d})}
                                    className={`px-2 py-0.5 text-xs rounded cursor-pointer ${filterLocation.district === d ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-50 text-slate-500'}`}
                                  >
                                    {d}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                     </div>
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-slate-500 mb-1">级别</label>
                     <select 
                       value={filterLevel}
                       onChange={e => setFilterLevel(e.target.value)}
                       className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                     >
                       <option value="All">所有级别</option>
                       {uniqueLevels.map(l => <option key={l} value={l}>{l}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-slate-500 mb-1">状态</label>
                     <select 
                       value={filterStatus}
                       onChange={e => setFilterStatus(e.target.value)}
                       className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                     >
                       <option value="All">所有状态</option>
                       <option value="Active">Active</option>
                       <option value="Busy">Busy</option>
                       <option value="Inactive">Inactive</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-slate-500 mb-1">类型</label>
                     <select 
                       value={filterEngType}
                       onChange={e => setFilterEngType(e.target.value)}
                       className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                     >
                       <option value="All">所有类型</option>
                       <option value="个人工程师">个人工程师</option>
                       <option value="供应商工程师">供应商工程师</option>
                     </select>
                   </div>
                   <div className="flex items-end">
                      <button 
                         onClick={clearFilters}
                         className="w-full p-2 text-sm text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                         <X className="w-4 h-4" /> 清除筛选
                      </button>
                   </div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">工程师</th>
                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">类型</th>
                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
                     <th 
                       className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                       onClick={() => handleSort('busyRate')}
                     >
                        <div className="flex items-center gap-1">
                           利用率
                           {sortConfig?.key === 'busyRate' && (
                              sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>
                           )}
                        </div>
                     </th>
                     <th 
                       className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                       onClick={() => handleSort('totalIncome')}
                     >
                        <div className="flex items-center gap-1">
                           收入
                           {sortConfig?.key === 'totalIncome' && (
                              sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>
                           )}
                        </div>
                     </th>
                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">城市/地区</th>
                     <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRoster.map((eng) => (
                    <tr 
                      key={eng.id} 
                      onClick={() => handleRowClick(eng)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                             {eng.avatar ? <img src={eng.avatar} alt="" className="w-full h-full rounded-full object-cover"/> : eng.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{eng.name}</p>
                            <p className="text-xs text-slate-500">{eng.specialization} • {eng.level}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                           eng.engType === '供应商工程师' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                         }`}>
                           {eng.engType || '个人工程师'}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                           eng.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                           eng.status === 'Busy' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                           'bg-slate-50 text-slate-600 border-slate-200'
                         }`}>
                           {eng.status}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[60px]">
                              <div className="h-full bg-indigo-500 rounded-full" style={{width: `${eng.busyRate}%`}}></div>
                           </div>
                           <span className="text-xs text-slate-500">{eng.busyRate}%</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                        ${(eng.totalIncome || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {eng.city}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"><MoreHorizontal className="w-4 h-4"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- VIEW: RECRUITMENT --- */}
        {activeTab === 'RECRUITMENT' && (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
               <div className="flex gap-6 overflow-x-auto">
                  <div className="flex-1 min-w-[200px] bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                     <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>新申请</span>
                        <span className="font-bold text-slate-900">{recruitmentStats.new}</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1 rounded-full"><div className="bg-blue-500 h-1 rounded-full" style={{width: '60%'}}></div></div>
                  </div>
                   <div className="flex-1 min-w-[200px] bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                     <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>面试中</span>
                        <span className="font-bold text-slate-900">{recruitmentStats.interviewing}</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1 rounded-full"><div className="bg-amber-500 h-1 rounded-full" style={{width: '40%'}}></div></div>
                  </div>
                   <div className="flex-1 min-w-[200px] bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                     <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>平均匹配度</span>
                        <span className="font-bold text-slate-900">{recruitmentStats.avgScore}%</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1 rounded-full"><div className="bg-green-500 h-1 rounded-full" style={{width: `${recruitmentStats.avgScore}%`}}></div></div>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
               <div className="grid gap-4">
                 {applicants.map(app => (
                   <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-lg border border-slate-200">
                         {app.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                           <div>
                              <h3 className="font-bold text-slate-900">{app.name}</h3>
                              <p className="text-sm text-slate-500">{app.specialization} • {app.city}</p>
                           </div>
                           <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                             app.status === 'Interviewing' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                           }`}>
                             {app.status}
                           </span>
                         </div>
                         <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> 申请时间: {app.applicationDate}</span>
                            <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> {app.certifications?.length} 项认证</span>
                            <span className="flex items-center gap-1 font-bold text-indigo-600"><Award className="w-3 h-3"/> {app.matchScore}% 匹配</span>
                         </div>
                      </div>
                      <div className="flex gap-2 border-l border-slate-100 pl-4">
                         {app.status === 'Applicant' && (
                           <button 
                             onClick={() => updateApplicantStatus(app.id, 'Interviewing')}
                             className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors" title="安排面试"
                           >
                             <Calendar className="w-5 h-5"/>
                           </button>
                         )}
                         <button 
                           onClick={() => updateApplicantStatus(app.id, 'Rejected')}
                           className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="拒绝"
                         >
                           <ThumbsDown className="w-5 h-5"/>
                         </button>
                         <button 
                           onClick={() => updateApplicantStatus(app.id, 'Active')}
                           className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors" title="通过并入职"
                         >
                           <ThumbsUp className="w-5 h-5"/>
                         </button>
                      </div>
                   </div>
                 ))}
                 {applicants.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                       <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                       <p>暂无新申请。</p>
                    </div>
                 )}
               </div>
            </div>
          </div>
        )}

      </div>

      {/* Engineer Detail Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div 
             className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
             onClick={() => setIsDrawerOpen(false)}
           ></div>

           <div className="relative w-full max-w-3xl bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
             
             {/* Drawer Header */}
             <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
                <h2 className="text-xl font-bold text-slate-900">
                  {viewMode === 'ADD' ? '入职新工程师' : viewMode === 'EDIT' ? '编辑工程师' : '工程师档案'}
                </h2>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
                {(viewMode === 'ADD' || viewMode === 'EDIT') ? (
                  /* Add/Edit Form */
                  <div className="space-y-6 max-w-2xl mx-auto pb-12">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                       <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">基本信息</h3>
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-semibold text-slate-500 mb-1">个人头像</label>
                           <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                               {formData.avatar ? (
                                 <img src={formData.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                               ) : (
                                 <UserIcon className="w-6 h-6" />
                               )}
                             </div>
                             <input 
                               type="file" 
                               ref={fileInputRef} 
                               onChange={handleAvatarUpload} 
                               className="hidden" 
                               accept="image/*"
                             />
                             <button 
                               type="button"
                               onClick={() => fileInputRef.current?.click()}
                               className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                             >
                               上传头像
                             </button>
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-slate-500 mb-1">全名</label>
                           <input 
                             type="text" 
                             placeholder="例如：张三" 
                             value={formData.name}
                             onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                             className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                           />
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-semibold text-slate-500 mb-1">手机号</label>
                           <input 
                             type="text" 
                             placeholder="例如：13800138000" 
                             value={formData.phoneNumber}
                             onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                             className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-slate-500 mb-1">出生年月日</label>
                           <input type="date" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/>
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div className="relative">
                           <label className="block text-xs font-semibold text-slate-500 mb-1">城市 / 地区</label>
                           <button 
                             type="button"
                             onClick={() => setIsCityPopoverOpen(!isCityPopoverOpen)}
                             className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white flex items-center justify-between hover:border-indigo-500 transition-colors"
                           >
                             <span className={formData.city ? "text-slate-900" : "text-slate-400"}>
                               {formData.city ? `${formData.city}/${formData.district}` : "请选择城市/地区"}
                             </span>
                             <ChevronDown className="w-4 h-4 text-slate-400" />
                           </button>

                           {isCityPopoverOpen && (
                             <div className="absolute z-50 mt-1 w-full border border-slate-200 rounded-lg shadow-xl bg-white p-3 space-y-2 max-h-64 overflow-y-auto ring-1 ring-black ring-opacity-5">
                               {cityTreeData.map(item => (
                                 <div key={item.city} className="space-y-1">
                                   <div className="flex items-center gap-2">
                                     <button 
                                       type="button"
                                       onClick={() => toggleCityNode(item.city)}
                                       className="p-0.5 hover:bg-slate-100 rounded"
                                     >
                                       {expandedCities.includes(item.city) ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                                     </button>
                                     <span className="text-sm font-medium text-slate-700">{item.city}</span>
                                   </div>
                                   {expandedCities.includes(item.city) && (
                                     <div className="ml-6 space-y-1">
                                       {item.districts.map(d => (
                                         <label key={d} className="flex items-center gap-2 cursor-pointer py-1 px-2 hover:bg-slate-50 rounded-md transition-colors">
                                           <input 
                                             type="radio" 
                                             name="engineer_location" 
                                             className="text-indigo-600 focus:ring-indigo-500" 
                                             checked={formData.city === item.city && formData.district === d}
                                             onChange={() => {
                                               setFormData(prev => ({ ...prev, city: item.city, district: d }));
                                               setIsCityPopoverOpen(false);
                                             }}
                                           />
                                           <span className="text-sm text-slate-600">{d}</span>
                                         </label>
                                       ))}
                                     </div>
                                   )}
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-slate-500 mb-1">工程师类型</label>
                           <select 
                             value={formData.engType}
                             onChange={(e) => setFormData(prev => ({ ...prev, engType: e.target.value as any, serviceStations: [] }))}
                             className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                           >
                             <option value="">请选择</option>
                             <option value="个人工程师">个人工程师</option>
                             <option value="供应商工程师">供应商工程师</option>
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-slate-500 mb-1">工程师级别</label>
                           <select 
                             value={formData.level}
                             onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as any }))}
                             disabled={viewMode === 'ADD' || viewMode === 'EDIT'}
                             className={`w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${viewMode === 'ADD' || viewMode === 'EDIT' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                           >
                             <option value="">请选择</option>
                             <option value="Expert">Expert</option>
                             <option value="Senior">Senior</option>
                             <option value="Mid">Mid</option>
                             <option value="Junior">Junior</option>
                           </select>
                         </div>
                       </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                       <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">接单喜好</h3>
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-semibold text-slate-500 mb-1">所属供应商</label>
                           {formData.engType === '个人工程师' ? (
                             <div className="border border-slate-300 rounded-lg p-2.5 max-h-32 overflow-y-auto space-y-2 bg-white">
                               {vendors.map(vendor => (
                                 <label key={vendor.id} className="flex items-center gap-2 cursor-pointer">
                                   <input 
                                     type="checkbox" 
                                     checked={formData.serviceStations.includes(vendor.id)}
                                     onChange={(e) => {
                                       const newStations = e.target.checked 
                                         ? [...formData.serviceStations, vendor.id]
                                         : formData.serviceStations.filter(id => id !== vendor.id);
                                       setFormData(prev => ({ ...prev, serviceStations: newStations }));
                                     }}
                                     className="rounded text-indigo-600 focus:ring-indigo-500" 
                                   />
                                   <span className="text-sm text-slate-600">{vendor.company || vendor.name}</span>
                                 </label>
                               ))}
                             </div>
                           ) : (
                             <select 
                               value={formData.serviceStations[0] || ''}
                               onChange={(e) => setFormData(prev => ({ ...prev, serviceStations: e.target.value ? [e.target.value] : [] }))}
                               className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                               disabled={!formData.engType}
                             >
                               <option value="">请选择</option>
                               {vendors.map(vendor => (
                                 <option key={vendor.id} value={vendor.id}>{vendor.company || vendor.name}</option>
                               ))}
                             </select>
                           )}
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-slate-500 mb-1">接单上限(单/每日)</label>
                           <input type="number" placeholder="例如：5" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/>
                         </div>
                       </div>

                       <div>
                         <label className="block text-xs font-semibold text-slate-500 mb-2">本周工作排班</label>
                         <div className="border border-slate-200 rounded-lg overflow-hidden">
                           <table className="w-full text-center text-xs">
                             <thead className="bg-slate-50 border-b border-slate-200">
                               <tr>
                                 {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
                                   <th key={day} className="py-2 font-medium text-slate-600 border-r last:border-r-0 border-slate-200">{day}</th>
                                 ))}
                               </tr>
                             </thead>
                             <tbody>
                               <tr>
                                 {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => {
                                   const isWeekend = day === '周六' || day === '周日';
                                   return (
                                     <td key={day} className={`py-3 border-r last:border-r-0 border-slate-200 ${isWeekend ? 'bg-slate-50 text-slate-400' : 'bg-emerald-50 text-emerald-700 font-medium'}`}>
                                       {isWeekend ? '休息' : '08:00 - 18:00'}
                                     </td>
                                   );
                                 })}
                               </tr>
                             </tbody>
                           </table>
                         </div>
                       </div>

                       <div>
                         <label className="block text-xs font-semibold text-slate-500 mb-2">服务范围</label>
                         <div className="flex flex-wrap gap-3">
                           {formData.city ? (
                             cityTreeData.find(c => c.city === formData.city)?.districts.map(dist => (
                               <button
                                 key={dist}
                                 type="button"
                                 onClick={() => {
                                   const newDists = formData.distanceSettings.includes(dist)
                                     ? formData.distanceSettings.filter(d => d !== dist)
                                     : [...formData.distanceSettings, dist];
                                   setFormData(prev => ({ ...prev, distanceSettings: newDists }));
                                 }}
                                 className={`px-6 py-2 rounded-lg text-sm font-medium transition-all border ${
                                   formData.distanceSettings.includes(dist)
                                     ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                     : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                                 }`}
                               >
                                 {dist}
                               </button>
                             ))
                           ) : (
                             <div className="text-sm text-slate-400 italic">请先选择城市/地区</div>
                           )}
                         </div>
                       </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                       <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">业务能力</h3>

                       <div>
                         <label className="block text-xs font-semibold text-slate-500 mb-2">工单类型</label>
                         <div className="flex flex-wrap gap-2">
                           {['上门', '远程', '巡检', '安装改造'].map(type => (
                             <label key={type} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                               <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                               <span className="text-sm text-slate-700">{type}</span>
                             </label>
                           ))}
                         </div>
                       </div>

                       <div>
                         <label className="block text-xs font-semibold text-slate-500 mb-2">优先级</label>
                         <div className="flex flex-wrap gap-2">
                           {['Urget', 'High', 'Medium', 'Low'].map(type => (
                             <label key={type} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                               <input type="checkbox" name="priority" className="rounded text-indigo-600 focus:ring-indigo-500" />
                               <span className="text-sm text-slate-700">{type}</span>
                             </label>
                           ))}
                         </div>
                       </div>

                       <div>
                         <label className="block text-xs font-semibold text-slate-500 mb-1">技能&认证</label>
                         <textarea rows={3} placeholder="请输入技能与认证信息，多个请用逗号分隔" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
                       </div>

                       <div>
                         <label className="block text-xs font-semibold text-slate-500 mb-1">设备品牌/型号</label>
                         <div className="border border-slate-300 rounded-lg p-3 space-y-2 max-h-80 overflow-y-auto bg-white">
                           {deviceTreeData.map(typeGroup => (
                             <div key={typeGroup.type} className="space-y-1">
                               <div className="flex items-center gap-2">
                                 <button 
                                   type="button"
                                   onClick={() => toggleNode(typeGroup.type)}
                                   className="p-0.5 hover:bg-slate-100 rounded"
                                 >
                                   {expandedNodes.includes(typeGroup.type) ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                                 </button>
                                 <label className="flex items-center gap-2 cursor-pointer">
                                   <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                                   <span className="text-sm font-bold text-slate-800">{typeGroup.type}</span>
                                 </label>
                               </div>
                               
                               {expandedNodes.includes(typeGroup.type) && (
                                 <div className="ml-6 space-y-2 pt-1">
                                   {typeGroup.brands.map(brandItem => (
                                     <div key={brandItem.brand} className="space-y-1">
                                       <div className="flex items-center gap-2">
                                         <button 
                                           type="button"
                                           onClick={() => toggleNode(`${typeGroup.type}-${brandItem.brand}`)}
                                           className="p-0.5 hover:bg-slate-100 rounded"
                                         >
                                           {expandedNodes.includes(`${typeGroup.type}-${brandItem.brand}`) ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                                         </button>
                                         <label className="flex items-center gap-2 cursor-pointer">
                                           <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                                           <span className="text-sm font-medium text-slate-700">{brandItem.brand}</span>
                                         </label>
                                       </div>
                                       
                                       {expandedNodes.includes(`${typeGroup.type}-${brandItem.brand}`) && (
                                         <div className="ml-8 space-y-1">
                                           {brandItem.models.map(model => (
                                             <label key={model} className="flex items-center gap-2 cursor-pointer py-0.5">
                                               <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                                               <span className="text-sm text-slate-600">{model}</span>
                                             </label>
                                           ))}
                                         </div>
                                       )}
                                     </div>
                                   ))}
                                 </div>
                               )}
                             </div>
                           ))}
                         </div>
                       </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">取消</button>
                      <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
                        {viewMode === 'ADD' ? '保存工程师' : '更新档案'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Details View */
                  selectedEngineer && <EngineerDetailView engineer={selectedEngineer} onEdit={handleEditClick} />
                )}
             </div>
           </div>
        </div>
      )}

      {isImportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsImportModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">批量导入工程师</h2>
              <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                  <Download className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-indigo-900 text-sm">下载导入模板</h3>
                  <p className="text-xs text-indigo-700 mt-1 mb-3">
                    请先下载标准 CSV 模板，按照表头要求填写工程师信息。
                  </p>
                  <button className="text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm">
                    点击下载模板 (.csv)
                  </button>
                </div>
              </div>

              <div className="space-y-3 px-1">
                <h3 className="text-sm font-bold text-slate-900">模板字段说明</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed max-h-40 overflow-y-auto">
                  <ul className="list-disc list-inside space-y-1">
                    <li><span className="font-bold text-slate-900">姓名</span> (必填): 工程师真实姓名</li>
                    <li><span className="font-bold text-slate-900">电话</span> (必填): 11位手机号码</li>
                    <li><span className="font-bold text-slate-900">城市</span> (必填): 所在城市</li>
                    <li><span className="font-bold text-slate-900">区域</span>: 具体区县</li>
                    <li><span className="font-bold text-slate-900">专业领域</span>: 如 "空调维修", "IT维护" 等</li>
                    <li><span className="font-bold text-slate-900">工程师类型</span>: "个人工程师" 或 "供应商工程师"</li>
                    <li><span className="font-bold text-slate-900">服务站</span>: 多个请用逗号分隔</li>
                  </ul>
                </div>
              </div>

              <div 
                className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 transition-all cursor-pointer group"
                onClick={() => document.getElementById('eng-import-file')?.click()}
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-sm font-bold text-slate-900">点击或将文件拖拽至此处</p>
                <p className="text-xs text-slate-500 mt-1">支持 .csv, .xlsx 格式 (最大 10MB)</p>
                <input id="eng-import-file" type="file" className="hidden" accept=".csv, .xlsx" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-all">
                取消
              </button>
              <button 
                onClick={() => {
                  alert('模拟导入成功！');
                  setIsImportModalOpen(false);
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
              >
                开始上传
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};