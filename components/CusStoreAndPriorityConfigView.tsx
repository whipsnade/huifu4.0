import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  FileText, 
  Calendar, 
  User, 
  X, 
  CheckCircle2, 
  Clock, 
  Ban, 
  Hash, 
  ChevronRight,
  ChevronLeft,
  Search,
  Copy,
  Clock3,
  Globe,
  MapPin,
  Building,
  Briefcase,
  Store,
  Filter,
  Send
} from 'lucide-react';
import { Process, ProcessStatus } from '../types';
import { cn } from '../lib/utils';

// Reuse the Process interface but specifically for this view
export interface StoreConfigProcess extends Process {
  remarks?: string;
  config?: {
    casePriority: string;
    zone: string;
    continentCountry: string;
    markets: string[];
    brands: string[];
    suppliers: string[];
    dateTypes: {
      workday: { selected: boolean; days: string[]; timeRange: [string, string] };
      weekend: { selected: boolean; days: string[]; timeRange: [string, string] };
      holiday: { selected: boolean; days: string[]; timeRange: [string, string] };
    };
  };
}

interface CusStoreAndPriorityConfigViewProps {
  processes: StoreConfigProcess[];
  onOpenDesign: (process: StoreConfigProcess) => void;
  onCreateNew: (data: { customerName: string; remarks: string }) => void;
  onUpdateStatus: (processId: string, status: ProcessStatus) => void;
  onCopy: (process: StoreConfigProcess) => void;
}

type TabType = 'using' | 'deprecated';

export function CusStoreAndPriorityConfigView({ 
  processes, 
  onOpenDesign, 
  onCreateNew, 
  onUpdateStatus,
  onCopy
}: CusStoreAndPriorityConfigViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('using');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    remarks: ''
  });

  const filteredProcesses = useMemo(() => {
    let result = processes;
    if (activeTab === 'using') {
      result = result.filter(p => p.status === 'published' || p.status === 'draft');
    } else {
      result = result.filter(p => p.status === 'deprecated');
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.processName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [processes, activeTab, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerName) {
      onCreateNew(formData);
      setIsModalOpen(false);
      setFormData({ customerName: '', remarks: '' });
    }
  };

  return (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto custom-scrollbar">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2 font-medium">
            <span>客户配置</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-bold">客户门店与案件等级</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">客户门店与案件等级管理</h1>
          <p className="text-slate-500 text-sm font-medium">管理和查看客户的基本信息与案件等级的关联关系。</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          新建配置
        </button>
      </header>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('using')}
            className={cn(
              "px-6 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
              activeTab === 'using' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            运行中
            <span className={cn(
              "px-2 py-0.5 text-[10px] rounded-md font-black",
              activeTab === 'using' ? "bg-indigo-50" : "bg-slate-200/50"
            )}>
              {processes.filter(p => p.status !== 'deprecated').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('deprecated')}
            className={cn(
              "px-6 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
              activeTab === 'deprecated' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            已弃用
            <span className={cn(
              "px-2 py-0.5 text-[10px] rounded-md font-black",
              activeTab === 'deprecated' ? "bg-rose-50" : "bg-slate-200/50"
            )}>
              {processes.filter(p => p.status === 'deprecated').length}
            </span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="搜索客户名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        {activeTab === 'using' && searchQuery === '' && (
          <div 
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[320px] cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/10 transition-all duration-300"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:rotate-90 group-hover:scale-110 transition-all duration-500 shadow-sm">
              <Plus className="w-10 h-10 text-slate-300 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-600">添加新配置</h3>
            <p className="text-xs text-slate-400 text-center font-bold uppercase tracking-widest leading-relaxed">Start configuring complex<br/>business logic</p>
          </div>
        )}

        {filteredProcesses.map(process => (
          <div key={process.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative">
            <div className="absolute top-0 right-0 px-6 py-2 bg-slate-50 rounded-tr-[2rem] rounded-bl-2xl text-[10px] font-black text-slate-400 flex items-center gap-1.5 border-l border-b border-slate-100">
              <Hash className="w-3 h-3" />
              VERSION {process.version}
            </div>

            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-slate-50 rounded-[1.25rem] group-hover:bg-indigo-50 transition-colors shadow-inner">
                <Store className="w-8 h-8 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div className="flex flex-col items-end gap-2 pr-10">
                <button 
                  disabled={process.status !== 'draft'}
                  onClick={(e) => {
                    if (process.status === 'draft') {
                      e.stopPropagation();
                      onUpdateStatus(process.id, 'published');
                    }
                  }}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-black rounded-full flex items-center gap-2 transition-all uppercase tracking-wider shadow-sm",
                    process.status === 'published' && "bg-green-50 text-green-600 border border-green-200",
                    process.status === 'draft' && "bg-amber-50 text-amber-600 border border-amber-200 cursor-pointer hover:bg-slate-900 hover:text-white hover:border-slate-900",
                    process.status === 'deprecated' && "bg-slate-100 text-slate-400 border border-slate-200"
                  )}
                >
                  {process.status === 'published' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {process.status === 'draft' && <Clock className="w-3.5 h-3.5" />}
                  {process.status === 'deprecated' && <Ban className="w-3.5 h-3.5" />}
                  {process.status === 'published' ? 'Running' : process.status === 'draft' ? 'Draft (Publish)' : 'Deprecated'}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2 truncate pr-20">{process.customerName} - 配置</h3>
              {process.remarks && (
                <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl italic">
                  "{process.remarks}"
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                  <User className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-tight">Creator</span>
                </div>
                <p className="text-xs font-bold text-slate-700">{process.creator}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                  <Calendar className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-tight">Updated</span>
                </div>
                <p className="text-xs font-bold text-slate-700">{process.updatedAt}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => onOpenDesign(process)}
                className={cn(
                  "flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                  process.status === 'deprecated' 
                    ? "bg-slate-100 text-slate-500 hover:bg-slate-200 shadow-none" 
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                )}
              >
                {process.status === 'deprecated' ? 'View Details' : 'Continue Design'}
              </button>
              {process.status !== 'deprecated' && (
                <button 
                  onClick={() => onCopy(process)}
                  className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors shadow-lg shadow-indigo-50/50"
                  title="Copy Configuration"
                >
                  <Copy className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">新建关联配置</h2>
                  <p className="text-sm text-slate-400 font-medium">配置客户名称及其备注信息开始设计</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-100">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">客户名称</label>
                  <div className="relative group">
                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      required
                      type="text"
                      value={formData.customerName}
                      onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="例如: YUM (百胜集团)"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:outline-none focus:bg-white focus:border-indigo-300 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">备注信息</label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-5 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <textarea
                      value={formData.remarks}
                      onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="输入关于此配置的简短说明..."
                      rows={4}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:outline-none focus:bg-white focus:border-indigo-300 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium resize-none"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 transition-all"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    创建并开始设计
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------------
// DESIGN VIEW COMPONENT
// --------------------------------------------------------------------------------

interface DesignViewProps {
  initialData: StoreConfigProcess;
  regions: any[];
  onBack: () => void;
  onSave: (config: any) => void;
}

export function StoreConfigDesignView({ initialData, regions, onBack, onSave }: DesignViewProps) {
  const isReadOnly = initialData.status === 'deprecated';
  
  // Data sources (Mocks)
  const priorityList = ['P1', 'P2', 'P3', 'P4', 'P5'];
  const brands = ['KFC', 'Pizza Hut', 'Taco Bell', 'Applebee\'s', 'Tim Hortons'];
  const suppliers = ['Vendor Alpha', 'Supplier Pro', 'Tech Fixers', 'Global Support', 'LinkIT'];
  
  const currentRegion = regions.find(r => r.customerName === initialData.customerName) || {
    customerName: initialData.customerName,
    regionName: '默认区域',
    continentCountry: '亚洲/中国',
    markets: ['华东市场', '华南市场', '北方市场']
  };

  const [config, setConfig] = useState(initialData.config || {
    casePriority: 'P3',
    zone: 'Zone 1',
    continentCountry: currentRegion.continentCountry,
    markets: [],
    brands: [],
    suppliers: [],
    dateTypes: {
      workday: { 
        selected: true, 
        days: [
          { name: '周一', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周二', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周三', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周四', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周五', selected: true, timeRange: ['09:00:00', '18:00:00'] },
        ] 
      },
      weekend: { 
        selected: false, 
        days: [
          { name: '周六', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周日', selected: true, timeRange: ['09:00:00', '18:00:00'] },
        ] 
      },
      holiday: { 
        selected: false, 
        days: [
          { name: '周一', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周二', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周三', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周四', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周五', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周六', selected: true, timeRange: ['09:00:00', '18:00:00'] },
          { name: '周日', selected: true, timeRange: ['09:00:00', '18:00:00'] },
        ] 
      },
    }
  });

  const handleToggleMarket = (market: string) => {
    if (isReadOnly) return;
    setConfig(prev => {
      const isSelected = prev.markets.includes(market);
      return {
        ...prev,
        markets: isSelected 
          ? prev.markets.filter(m => m !== market)
          : [...prev.markets, market]
      };
    });
  };

  const handleToggleBrand = (brand: string) => {
    if (isReadOnly) return;
    setConfig(prev => ({
      ...prev,
      brands: prev.brands.includes(brand) 
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleToggleSupplier = (supplier: string) => {
    if (isReadOnly) return;
    setConfig(prev => ({
      ...prev,
      suppliers: prev.suppliers.includes(supplier) 
        ? prev.suppliers.filter(s => s !== supplier)
        : [...prev.suppliers, supplier]
    }));
  };

  const handleToggleDateTypeDay = (type: 'workday' | 'weekend' | 'holiday', dayName: string) => {
    if (isReadOnly) return;
    setConfig(prev => ({
      ...prev,
      dateTypes: {
        ...prev.dateTypes,
        [type]: {
          ...prev.dateTypes[type],
          days: prev.dateTypes[type].days.map((d: any) => 
            d.name === dayName ? { ...d, selected: !d.selected } : d
          )
        }
      }
    }));
  };

  const handleUpdateTimeRange = (type: 'workday' | 'weekend' | 'holiday', dayName: string, index: number, value: string) => {
    if (isReadOnly) return;
    setConfig(prev => ({
      ...prev,
      dateTypes: {
        ...prev.dateTypes,
        [type]: {
          ...prev.dateTypes[type],
          days: prev.dateTypes[type].days.map((d: any) => {
            if (d.name === dayName) {
              const newRange = [...d.timeRange];
              newRange[index] = value;
              return { ...d, timeRange: newRange };
            }
            return d;
          })
        }
      }
    }));
  };

  const handleToggleDateType = (type: 'workday' | 'weekend' | 'holiday') => {
    if (isReadOnly) return;
    setConfig(prev => ({
      ...prev,
      dateTypes: {
        ...prev.dateTypes,
        [type]: { ...prev.dateTypes[type], selected: !prev.dateTypes[type].selected }
      }
    }));
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      <header className="px-8 py-6 bg-white border-b border-slate-200 flex justify-between items-center z-10 shadow-sm relative">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider">Configure Mode</span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{initialData.customerName} - 关联设置</h1>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-3 h-3" />
              {initialData.remarks || '无备注信息'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all active:scale-95"
          >
            取消
          </button>
          {!isReadOnly && (
            <button 
              onClick={() => onSave(config)}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 active:scale-95 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              保存配置
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Field: Customer Name */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                  <Building className="w-4 h-4 text-slate-400" />
                </div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">客户名称</label>
              </div>
              <input 
                disabled 
                value={initialData.customerName}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 font-bold text-sm cursor-not-allowed"
              />
            </div>

            {/* Field: Zone */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">区域</label>
              </div>
              <input 
                disabled 
                value={currentRegion.regionName}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 font-bold text-sm cursor-not-allowed"
              />
            </div>

            {/* Field: Continent/Country */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">洲名 / 国家</label>
              </div>
              <input 
                disabled 
                value={config.continentCountry}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 font-bold text-sm cursor-not-allowed"
              />
            </div>

            {/* Field: Case Level */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Filter className="w-4 h-4 text-indigo-500" />
                </div>
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">案件等级</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {priorityList.map(lvl => (
                  <button
                    key={lvl}
                    disabled={isReadOnly}
                    onClick={() => setConfig(prev => ({ ...prev, casePriority: lvl }))}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      config.casePriority === lvl 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    )}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Field: Markets */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-2xl">
                    <MapPin className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">市场选择</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Markets Selection</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-slate-50 px-2 py-1 rounded text-slate-400">{config.markets.length} Selected</span>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {currentRegion.markets.map((market: string) => (
                  <label 
                    key={market}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border",
                      config.markets.includes(market) 
                        ? "bg-amber-50/50 border-amber-200 text-amber-700 font-bold" 
                        : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <input 
                      type="checkbox"
                      checked={config.markets.includes(market)}
                      onChange={() => handleToggleMarket(market)}
                      className="w-5 h-5 rounded-lg border-2 border-slate-300 text-amber-600 focus:ring-amber-500 transition-all pointer-events-none"
                    />
                    <span className="text-sm">{market}</span>
                  </label>
                ))}
              </div>
            </div>

             {/* Field: Brands */}
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <Building className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">品牌关联</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Brands Selection</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-slate-50 px-2 py-1 rounded text-slate-400">{config.brands.length} Selected</span>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {brands.map(brand => (
                  <label 
                    key={brand}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border",
                      config.brands.includes(brand) 
                        ? "bg-blue-50/50 border-blue-200 text-blue-700 font-bold" 
                        : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <input 
                      type="checkbox"
                      checked={config.brands.includes(brand)}
                      onChange={() => handleToggleBrand(brand)}
                      className="w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500 transition-all pointer-events-none"
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Field: Suppliers */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-2xl">
                    <Briefcase className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">供应商授权</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Suppliers Selection</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-slate-50 px-2 py-1 rounded text-slate-400">{config.suppliers.length} Selected</span>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {suppliers.map(sup => (
                  <label 
                    key={sup}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border",
                      config.suppliers.includes(sup) 
                        ? "bg-purple-50/50 border-purple-200 text-purple-700 font-bold" 
                        : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <input 
                      type="checkbox"
                      checked={config.suppliers.includes(sup)}
                      onChange={() => handleToggleSupplier(sup)}
                      className="w-5 h-5 rounded-lg border-2 border-slate-300 text-purple-600 focus:ring-purple-500 transition-all pointer-events-none"
                    />
                    <span className="text-sm">{sup}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Field: Date Types */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <Clock3 className="w-24 h-24 text-slate-50 opacity-[0.03] rotate-12" />
            </div>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-emerald-50 rounded-[1.5rem]">
                <Calendar className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">日期与应用</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Schedules & Timeframes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Workday */}
              <div className={cn(
                "p-8 rounded-[2.25rem] border transition-all duration-500",
                config.dateTypes.workday.selected 
                  ? "bg-white border-indigo-200 shadow-2xl shadow-indigo-50 ring-4 ring-indigo-50/30" 
                  : "bg-slate-50 border-slate-100 opacity-60"
              )}>
                <div className="flex justify-between items-start mb-6">
                  <h4 className="font-bold text-slate-900 text-lg">工作日</h4>
                  <button 
                    onClick={() => handleToggleDateType('workday')}
                    className={cn(
                      "p-1 rounded-full transition-all",
                      config.dateTypes.workday.selected ? "bg-indigo-600 text-white" : "bg-slate-300 text-white"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {config.dateTypes.workday.days.map((day: any) => (
                    <div key={day.name} className="space-y-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <input 
                             type="checkbox" 
                             checked={day.selected} 
                             onChange={() => handleToggleDateTypeDay('workday', day.name)}
                             className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                           />
                           <span className={cn("text-xs font-bold", day.selected ? "text-indigo-600" : "text-slate-400")}>{day.name}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="time" 
                          step="1"
                          value={day.timeRange[0]}
                          disabled={!day.selected}
                          onChange={(e) => handleUpdateTimeRange('workday', day.name, 0, e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner disabled:opacity-50" 
                        />
                        <span className="text-slate-300 italic font-medium">~</span>
                        <input 
                          type="time" 
                          step="1"
                          value={day.timeRange[1]}
                          disabled={!day.selected}
                          onChange={(e) => handleUpdateTimeRange('workday', day.name, 1, e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner disabled:opacity-50" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekend */}
              <div className={cn(
                "p-8 rounded-[2.25rem] border transition-all duration-500",
                config.dateTypes.weekend.selected 
                  ? "bg-white border-sky-200 shadow-2xl shadow-sky-50 ring-4 ring-sky-50/30" 
                  : "bg-slate-50 border-slate-100 opacity-60"
              )}>
                <div className="flex justify-between items-start mb-6">
                  <h4 className="font-bold text-slate-900 text-lg">周末</h4>
                  <button 
                    onClick={() => handleToggleDateType('weekend')}
                    className={cn(
                      "p-1 rounded-full transition-all",
                      config.dateTypes.weekend.selected ? "bg-sky-500 text-white" : "bg-slate-300 text-white"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {config.dateTypes.weekend.days.map((day: any) => (
                    <div key={day.name} className="space-y-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <input 
                             type="checkbox" 
                             checked={day.selected} 
                             onChange={() => handleToggleDateTypeDay('weekend', day.name)}
                             className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                           />
                           <span className={cn("text-xs font-bold", day.selected ? "text-sky-600" : "text-slate-400")}>{day.name}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="time" 
                          step="1"
                          value={day.timeRange[0]}
                          disabled={!day.selected}
                          onChange={(e) => handleUpdateTimeRange('weekend', day.name, 0, e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-sky-500 shadow-inner disabled:opacity-50" 
                        />
                        <span className="text-slate-300 italic font-medium">~</span>
                        <input 
                          type="time" 
                          step="1"
                          value={day.timeRange[1]}
                          disabled={!day.selected}
                          onChange={(e) => handleUpdateTimeRange('weekend', day.name, 1, e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-sky-500 shadow-inner disabled:opacity-50" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holiday */}
              <div className={cn(
                "p-8 rounded-[2.25rem] border transition-all duration-500",
                config.dateTypes.holiday.selected 
                  ? "bg-white border-rose-200 shadow-2xl shadow-rose-50 ring-4 ring-rose-50/30" 
                  : "bg-slate-50 border-slate-100 opacity-60"
              )}>
                <div className="flex justify-between items-start mb-6">
                  <h4 className="font-bold text-slate-900 text-lg">法定节假日</h4>
                  <button 
                    onClick={() => handleToggleDateType('holiday')}
                    className={cn(
                      "p-1 rounded-full transition-all",
                      config.dateTypes.holiday.selected ? "bg-rose-500 text-white" : "bg-slate-300 text-white"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {config.dateTypes.holiday.days.map((day: any) => (
                    <div key={day.name} className="space-y-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <input 
                             type="checkbox" 
                             checked={day.selected} 
                             onChange={() => handleToggleDateTypeDay('holiday', day.name)}
                             className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                           />
                           <span className={cn("text-xs font-bold", day.selected ? "text-rose-600" : "text-slate-400")}>{day.name}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="time" 
                          step="1"
                          value={day.timeRange[0]}
                          disabled={!day.selected}
                          onChange={(e) => handleUpdateTimeRange('holiday', day.name, 0, e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-rose-500 shadow-inner disabled:opacity-50" 
                        />
                        <span className="text-slate-300 italic font-medium">~</span>
                        <input 
                          type="time" 
                          step="1"
                          value={day.timeRange[1]}
                          disabled={!day.selected}
                          onChange={(e) => handleUpdateTimeRange('holiday', day.name, 1, e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-rose-500 shadow-inner disabled:opacity-50" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
