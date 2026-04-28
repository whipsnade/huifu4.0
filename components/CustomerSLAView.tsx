import React, { useState } from 'react';
import { Plus, Search, Edit2, Copy, Send, X, AlertCircle, ArrowUpDown, Info } from 'lucide-react';
import { PricingView } from './PricingView';
import { MOCK_USERS } from '../constants';
import { UserRole } from '../types';

interface CustomerSLA {
  id: string;
  slaNo: string;
  name: string;
  customerName: string;
  industry?: string;
  version: string;
  status: '已发布' | '未发布' | '已弃用';
  enabled: boolean;
  creator: string;
  createdAt: string;
  updater: string;
  updatedAt: string;
  publishedAt?: string;
  validityStart: string;
  validityEnd: string;
}

const MOCK_SLAS: CustomerSLA[] = [
  {
    id: '1',
    slaNo: 'SLA-2023-001',
    name: '星巴克基础SLA',
    customerName: '星巴克',
    version: 'V1.0',
    status: '已发布',
    enabled: true,
    creator: 'Admin',
    createdAt: '2023/10/01 10:00:00',
    updater: 'Admin',
    updatedAt: '2023/10/01 10:00:00',
    publishedAt: '2023/10/01 10:00:00',
    validityStart: '2023/10/01',
    validityEnd: '2028/09/30'
  }
];

export const CustomerSLAView: React.FC = () => {
  const [slas, setSlas] = useState<CustomerSLA[]>(MOCK_SLAS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('view');
  const [currentSla, setCurrentSla] = useState<Partial<CustomerSLA> | null>(null);
  const [drawerStep, setDrawerStep] = useState<1 | 2>(1); // 1: Base Info, 2: Pricing Config
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'deprecated'>('active');
  const [sortConfig, setSortConfig] = useState<{ key: 'createdAt' | 'updatedAt' | 'publishedAt', direction: 'asc' | 'desc' }>({ key: 'updatedAt', direction: 'desc' });

  const customers = MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER);

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
  };

  const handleOpenCreate = () => {
    const today = new Date();
    const end = new Date();
    end.setFullYear(end.getFullYear() + 5);

    setCurrentSla({
      slaNo: `SLA-${today.getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: '',
      customerName: '',
      version: 'V1.0',
      status: '未发布',
      enabled: false,
      creator: 'Current User',
      createdAt: today.toLocaleString('zh-CN', { hour12: false }),
      updater: 'Current User',
      updatedAt: today.toLocaleString('zh-CN', { hour12: false }),
      validityStart: formatDate(today),
      validityEnd: formatDate(end)
    });
    setDrawerMode('create');
    setDrawerStep(1);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (sla: CustomerSLA) => {
    setCurrentSla({ ...sla });
    setDrawerMode('edit');
    setDrawerStep(1);
    setIsDrawerOpen(true);
  };

  const handleCopy = (sla: CustomerSLA) => {
    const today = new Date();
    const end = new Date();
    end.setFullYear(end.getFullYear() + 5);

    const newSla: CustomerSLA = {
      ...sla,
      id: Date.now().toString(),
      slaNo: `SLA-${today.getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: '未发布',
      enabled: false,
      creator: 'Current User',
      createdAt: today.toLocaleString('zh-CN', { hour12: false }),
      updater: 'Current User',
      updatedAt: today.toLocaleString('zh-CN', { hour12: false }),
      publishedAt: undefined,
      validityStart: formatDate(today),
      validityEnd: formatDate(end)
    };
    setSlas([newSla, ...slas]);
  };

  const handlePublish = (sla: CustomerSLA) => {
    if (!sla.enabled) {
      setAlertMessage("该记录未启用，无法进行发布");
      return;
    }
    const now = new Date().toLocaleString('zh-CN', { hour12: false });
    const updatedSlas = slas.map(s => {
      if (s.id === sla.id) {
        const currentVersionNum = parseFloat(s.version.replace('V', ''));
        return {
          ...s,
          status: '已发布',
          version: `V${(currentVersionNum + 0.1).toFixed(1)}`,
          updater: 'Current User',
          updatedAt: now,
          publishedAt: now
        };
      } else if (s.customerName === sla.customerName && s.status === '已发布') {
        return {
          ...s,
          status: '已弃用',
          updater: 'System',
          updatedAt: now
        };
      }
      return s;
    });
    setSlas(updatedSlas as CustomerSLA[]);
  };

  const handleSaveSla = (publishNow: boolean) => {
    if (!currentSla) return;

    if (publishNow && !currentSla.enabled) {
      setAlertMessage("该记录未启用，无法进行发布");
      return;
    }

    const now = new Date().toLocaleString('zh-CN', { hour12: false });
    let updatedSla = { ...currentSla, updater: 'Current User', updatedAt: now } as CustomerSLA;

    let newSlas = [...slas];

    if (publishNow) {
      const currentVersionNum = parseFloat(updatedSla.version.replace('V', ''));
      updatedSla.status = '已发布';
      updatedSla.version = `V${(currentVersionNum + 0.1).toFixed(1)}`;
      updatedSla.publishedAt = now;

      newSlas = newSlas.map(s => {
        if (s.customerName === updatedSla.customerName && s.status === '已发布' && s.id !== updatedSla.id) {
          return {
            ...s,
            status: '已弃用',
            updater: 'System',
            updatedAt: now
          };
        }
        return s;
      });
    } else {
      updatedSla.status = '未发布';
    }

    if (drawerMode === 'create') {
      updatedSla.id = Date.now().toString();
      setSlas([updatedSla, ...newSlas]);
    } else {
      setSlas(newSlas.map(s => s.id === updatedSla.id ? updatedSla : s));
    }

    setShowSaveModal(false);
    setIsDrawerOpen(false);
  };

  const todayStr = formatDate(new Date());

  const processedSlas = slas.map(sla => {
    if (sla.status !== '已弃用' && sla.validityEnd < todayStr) {
      return { ...sla, status: '已弃用' as const };
    }
    return sla;
  });

  const filteredSlas = processedSlas.filter(sla => {
    if (activeTab === 'active') {
      return sla.status === '已发布' || sla.status === '未发布';
    } else {
      return sla.status === '已弃用';
    }
  });

  const sortedSlas = [...filteredSlas].sort((a, b) => {
    const aVal = a[sortConfig.key] || '';
    const bVal = b[sortConfig.key] || '';
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: 'createdAt' | 'updatedAt' | 'publishedAt') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">客户SLA</h1>
          <p className="text-slate-500 text-sm">管理与客户相关的SLA列表记录</p>
        </div>
        <button onClick={handleOpenCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> 新增
        </button>
      </div>

      <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'active' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('active')}
        >
          使用中
        </button>
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'deprecated' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('deprecated')}
        >
          已弃用
        </button>
      </div>

      {activeTab === 'active' && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-6 flex items-start gap-2 text-indigo-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>任何新增或是修改之后的SLA记录，都需要进行发布并且仅对新增的工单生效，此前的工单不受影响沿用上一个版本的SLA</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">SLA编号</th>
                <th className="p-4 font-medium">SLA名称</th>
                <th className="p-4 font-medium">客户名称</th>
                <th className="p-4 font-medium">版本号</th>
                <th className="p-4 font-medium">状态</th>
                <th className="p-4 font-medium">有效期</th>
                <th className="p-4 font-medium">启用</th>
                <th className="p-4 font-medium">创建人</th>
                <th className="p-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-1">
                    创建时间点
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 font-medium">更新人</th>
                <th className="p-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('updatedAt')}>
                  <div className="flex items-center gap-1">
                    更新时间
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('publishedAt')}>
                  <div className="flex items-center gap-1">
                    发布时间
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {sortedSlas.map((sla) => (
                <tr key={sla.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900 cursor-pointer hover:text-indigo-600" onClick={() => {
                    setCurrentSla({ ...sla });
                    setDrawerMode('view');
                    setDrawerStep(1);
                    setIsDrawerOpen(true);
                  }}>{sla.slaNo}</td>
                  <td className="p-4 text-slate-700">{sla.name}</td>
                  <td className="p-4 text-slate-700">{sla.customerName}</td>
                  <td className="p-4 text-slate-700">{sla.version}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sla.status === '已发布' ? 'bg-green-100 text-green-700' : sla.status === '已弃用' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                      {sla.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 whitespace-nowrap">
                    {sla.validityStart} ~ {sla.validityEnd}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sla.enabled ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                      {sla.enabled ? '是' : '否'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{sla.creator}</td>
                  <td className="p-4 text-slate-500">{sla.createdAt}</td>
                  <td className="p-4 text-slate-500">{sla.updater}</td>
                  <td className="p-4 text-slate-500">{sla.updatedAt}</td>
                  <td className="p-4 text-slate-500">{sla.publishedAt || '-'}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {sla.status !== '已弃用' && (
                        <>
                          <button onClick={() => handleOpenEdit(sla)} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors" title="编辑">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handlePublish(sla)} className="p-1 text-slate-400 hover:text-green-600 transition-colors" title="发布">
                            <Send className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleCopy(sla)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="复制">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isDrawerOpen && currentSla && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
              <h2 className="text-lg font-bold text-slate-900">
                {drawerMode === 'create' ? '新增客户SLA' : drawerMode === 'edit' ? '编辑客户SLA' : '查看客户SLA'}
              </h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {drawerStep === 1 ? (
                <div className="space-y-6">
                  <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-2">基础信息</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SLA编号</label>
                      <input type="text" value={currentSla.slaNo} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">SLA名称</label>
                      <input type="text" value={currentSla.name} onChange={e => setCurrentSla({...currentSla, name: e.target.value})} readOnly={drawerMode === 'view'} className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${drawerMode === 'view' ? 'bg-slate-50 border-slate-200 text-slate-500' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">客户名称</label>
                      {drawerMode === 'view' ? (
                        <input type="text" value={currentSla.customerName} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none" />
                      ) : (
                        <select 
                          value={currentSla.customerName} 
                          onChange={e => setCurrentSla({...currentSla, customerName: e.target.value})} 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        >
                          <option value="">请选择客户</option>
                          {customers.map(c => (
                            <option key={c.id} value={c.company || c.name}>{c.company || c.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                        所属行业
                        <div className="relative group">
                          <Info className="w-4 h-4 text-slate-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10 whitespace-normal">
                            系统将根据客户所属行业为您匹配该行业的基础定价规则;如果您的客户不属于当前任何行业,您可以点击下一步开始定制化该客户的SLA
                          </div>
                        </div>
                      </label>
                      {drawerMode === 'view' ? (
                        <input type="text" value={currentSla.industry || ''} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none" />
                      ) : (
                        <select 
                          value={currentSla.industry || ''} 
                          onChange={e => setCurrentSla({...currentSla, industry: e.target.value})} 
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        >
                          <option value="">请选择行业</option>
                          <option value="餐饮与零售">餐饮与零售</option>
                          <option value="IT行业">IT行业</option>
                          <option value="制造业">制造业</option>
                          <option value="运输业">运输业</option>
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">有效期</label>
                      {drawerMode === 'view' ? (
                        <input type="text" value={`${currentSla.validityStart} ~ ${currentSla.validityEnd}`} readOnly className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <input 
                            type="date" 
                            value={currentSla.validityStart?.replace(/\//g, '-')} 
                            onChange={e => setCurrentSla({...currentSla, validityStart: e.target.value.replace(/-/g, '/')})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                          />
                          <span className="text-slate-500">~</span>
                          <input 
                            type="date" 
                            value={currentSla.validityEnd?.replace(/\//g, '-')} 
                            onChange={e => setCurrentSla({...currentSla, validityEnd: e.target.value.replace(/-/g, '/')})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">版本号</label>
                      <input type="text" value={currentSla.version} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
                      <input type="text" value={currentSla.status} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">启用</label>
                      <label className={`relative inline-flex items-center mt-1 ${drawerMode === 'view' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                        <input type="checkbox" checked={currentSla.enabled} onChange={e => setCurrentSla({...currentSla, enabled: e.target.checked})} disabled={drawerMode === 'view'} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">创建人</label>
                      <input type="text" value={currentSla.creator} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">创建时间点</label>
                      <input type="text" value={currentSla.createdAt} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">更新人</label>
                      <input type="text" value={currentSla.updater} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">更新时间</label>
                      <input type="text" value={currentSla.updatedAt} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500" />
                    </div>
                    {currentSla.publishedAt && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">发布时间</label>
                        <input type="text" value={currentSla.publishedAt} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-2">定价配置信息</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 text-sm text-slate-600 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                    <p>此处的定价配置信息来源于全局定价配置页面。您可以为该客户定制基本SLA参数，但不能修改全局定价规则中的数据。</p>
                  </div>
                  {/* Reuse PricingView but without the layout wrapper to fit in drawer */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <PricingView isEmbedded={true} isReadOnly={drawerMode === 'view'} industry={currentSla.industry} />
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
              <button onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                {drawerMode === 'view' ? '关闭' : '取消'}
              </button>
              {drawerStep === 1 ? (
                <button onClick={() => setDrawerStep(2)} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors">
                  下一步
                </button>
              ) : (
                <>
                  <button onClick={() => setDrawerStep(1)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                    上一步
                  </button>
                  {drawerMode !== 'view' && (
                    <button onClick={() => setShowSaveModal(true)} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors">
                      保存
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">该客户SLA定制已完成</h3>
              <p className="text-sm text-slate-500 mb-6">您可以选择立即发布该SLA配置，或稍后在列表中进行发布。</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => handleSaveSla(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  稍后发布
                </button>
                <button onClick={() => handleSaveSla(true)} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors">
                  立即发布
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 bg-slate-900/50 z-[70] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">提示</h3>
              <p className="text-sm text-slate-500 mb-6">{alertMessage}</p>
              <div className="flex justify-center">
                <button onClick={() => setAlertMessage(null)} className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors">
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
