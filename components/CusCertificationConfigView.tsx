import React, { useState } from 'react';
import { Plus, X, Copy, Trash2, Building, ShieldCheck, User, Settings, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Shared data for industries and their predefined certifications
const INDUSTRIES_DATA = [
  {
    id: '1',
    industryName: '信息传输、软件和信息技术服务业',
    certifications: ['PMP项目管理专业人士', 'CISSP信息系统安全认证', 'ITIL IT服务管理认证', 'AWS认证解决方案架构师', 'Cisco CCNA认证', '系统集成项目管理工程师', '信息系统项目管理师']
  },
  {
    id: '2',
    industryName: '批发和零售业',
    certifications: ['零售管理师', '供应链管理专家(CSCP)', '高级采购师', '电子商务师', '营销师']
  },
  {
    id: '3',
    industryName: '住宿和餐饮业',
    certifications: ['酒店管理师', '餐饮职业经理人', '公共营养师', '食品安全管理员', '高级调酒师']
  },
  {
    id: '4',
    industryName: '制造业',
    certifications: ['注册安全工程师', '注册质量工程师(CQE)', '精益生产管理师', '工业设计师', '自动化控制工程师', '六西格玛黑带']
  },
  {
    id: '5',
    industryName: '科学研究和技术服务业',
    certifications: ['专利代理师', '科技咨询师', '数据分析师(CDA)', '研发项目管理师', '实验室认可内审员']
  }
];

interface CusCertConfig {
  id: string;
  customerName: string;
  industry: string;
  customerCerts: string[];
  industryCerts: string[];
}

const INITIAL_DATA: CusCertConfig[] = [
  {
    id: '1',
    customerName: '汉堡王',
    industry: '住宿和餐饮业',
    customerCerts: ['汉堡王初级认证', '汉堡王高级认证', '汉堡王门店经理认证', '汉堡王区域经理认证', '汉堡王培训师认证', '汉堡王设备维护认证', '汉堡王供应链认证', '汉堡王客服专家认证'],
    industryCerts: ['酒店管理师', '餐饮职业经理人', '公共营养师', '食品安全管理员', '高级调酒师']
  },
  {
    id: '2',
    customerName: '麦当劳',
    industry: '住宿和餐饮业',
    customerCerts: ['麦当劳食品安全专家', '麦当劳星级咖啡师', '麦当劳值班经理', '麦当劳餐厅总经理', '麦当劳品牌大使', '麦当劳设备专家'],
    industryCerts: ['餐饮职业经理人', '食品安全管理员', '公共营养师', '高级调酒师']
  }
];

export const CusCertificationConfigView: React.FC = () => {
  const [configs, setConfigs] = useState<CusCertConfig[]>(INITIAL_DATA);

  // States for adding new config
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newConfig, setNewConfig] = useState<{ customerName: string; industry: string }>({ customerName: '', industry: INDUSTRIES_DATA[0].industryName });

  // States for copying config
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [configToCopy, setConfigToCopy] = useState<CusCertConfig | null>(null);
  const [copyCustomerName, setCopyCustomerName] = useState('');

  // States for inline editing customer/industry
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ customerName: string; industry: string }>({ customerName: '', industry: '' });

  // States for adding certs
  const [addingCustomerCertFor, setAddingCustomerCertFor] = useState<string | null>(null);
  const [newCustomerCertValue, setNewCustomerCertValue] = useState('');

  const [addingIndustryCertFor, setAddingIndustryCertFor] = useState<string | null>(null);
  const [newIndustryCertValue, setNewIndustryCertValue] = useState('');

  // States for expanding certs
  const [expandedCustomerCerts, setExpandedCustomerCerts] = useState<Record<string, boolean>>({});
  const [expandedIndustryCerts, setExpandedIndustryCerts] = useState<Record<string, boolean>>({});

  const toggleCustomerCerts = (id: string) => setExpandedCustomerCerts(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleIndustryCerts = (id: string) => setExpandedIndustryCerts(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAddConfig = () => {
    if (!newConfig.customerName.trim()) return;

    const matchedIndustry = INDUSTRIES_DATA.find(i => i.industryName === newConfig.industry);
    const initialIndustryCerts = matchedIndustry ? [...matchedIndustry.certifications] : [];

    const newCusConfig: CusCertConfig = {
      id: Date.now().toString(),
      customerName: newConfig.customerName.trim(),
      industry: newConfig.industry,
      customerCerts: [],
      industryCerts: initialIndustryCerts
    };

    setConfigs([...configs, newCusConfig]);
    setIsAddModalOpen(false);
    setNewConfig({ customerName: '', industry: INDUSTRIES_DATA[0].industryName });
  };

  const handleCopyConfig = () => {
    if (!configToCopy || !copyCustomerName.trim()) return;

    const copiedConfig: CusCertConfig = {
      ...configToCopy,
      id: Date.now().toString(),
      customerName: copyCustomerName.trim()
    };

    setConfigs([...configs, copiedConfig]);
    setIsCopyModalOpen(false);
    setConfigToCopy(null);
    setCopyCustomerName('');
  };

  const handleSaveEdit = (configId: string) => {
    if (!editForm.customerName.trim()) return;

    setConfigs(configs.map(c => {
      if (c.id === configId) {
        // If industry changes, auto-populate new industry certs
        const isIndustryChanged = c.industry !== editForm.industry;
        const matchedIndustry = INDUSTRIES_DATA.find(i => i.industryName === editForm.industry);
        const newIndustryCerts = matchedIndustry ? [...matchedIndustry.certifications] : [];

        return {
          ...c,
          customerName: editForm.customerName.trim(),
          industry: editForm.industry,
          industryCerts: isIndustryChanged ? newIndustryCerts : c.industryCerts
        };
      }
      return c;
    }));
    setEditingCardId(null);
  };

  const handleRemoveConfig = (configId: string) => {
    setConfigs(configs.filter(c => c.id !== configId));
  };

  const handleAddCustomerCert = (configId: string) => {
    if (!newCustomerCertValue.trim()) return;

    setConfigs(configs.map(c => {
      if (c.id === configId && !c.customerCerts.includes(newCustomerCertValue.trim())) {
        return { ...c, customerCerts: [...c.customerCerts, newCustomerCertValue.trim()] };
      }
      return c;
    }));
    setNewCustomerCertValue('');
    setAddingCustomerCertFor(null);
  };

  const handleRemoveCustomerCert = (configId: string, cert: string) => {
    setConfigs(configs.map(c => {
      if (c.id === configId) {
        return { ...c, customerCerts: c.customerCerts.filter(cc => cc !== cert) };
      }
      return c;
    }));
  };

  const clearAllCustomerCerts = (configId: string) => {
    setConfigs(configs.map(c => {
      if (c.id === configId) {
        return { ...c, customerCerts: [] };
      }
      return c;
    }));
  };

  const handleAddIndustryCert = (configId: string) => {
    if (!newIndustryCertValue.trim()) return;

    setConfigs(configs.map(c => {
      if (c.id === configId && !c.industryCerts.includes(newIndustryCertValue)) {
        return { ...c, industryCerts: [...c.industryCerts, newIndustryCertValue] };
      }
      return c;
    }));
    setNewIndustryCertValue('');
    setAddingIndustryCertFor(null);
  };

  const handleRemoveIndustryCert = (configId: string, cert: string) => {
    setConfigs(configs.map(c => {
      if (c.id === configId) {
        return { ...c, industryCerts: c.industryCerts.filter(ic => ic !== cert) };
      }
      return c;
    }));
  };

  const clearAllIndustryCerts = (configId: string) => {
    setConfigs(configs.map(c => {
      if (c.id === configId) {
        return { ...c, industryCerts: [] };
      }
      return c;
    }));
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">客户认证名称配置</h1>
          <p className="text-sm text-slate-500">管理不同客户的自定义认证与标准行业认证关联</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {configs.map((config) => {
            const matchedIndustry = INDUSTRIES_DATA.find(i => i.industryName === config.industry);
            const availableIndustryCerts = matchedIndustry ? matchedIndustry.certifications.filter(c => !config.industryCerts.includes(c)) : [];

            const isCustomerCertsExpanded = expandedCustomerCerts[config.id];
            const visibleCustomerCerts = isCustomerCertsExpanded ? config.customerCerts : config.customerCerts.slice(0, 5);
            const hasMoreCustomerCerts = config.customerCerts.length > 5;

            const isIndustryCertsExpanded = expandedIndustryCerts[config.id];
            const visibleIndustryCerts = isIndustryCertsExpanded ? config.industryCerts : config.industryCerts.slice(0, 5);
            const hasMoreIndustryCerts = config.industryCerts.length > 5;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={config.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
              >
                {/* Header: Customer and Industry */}
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {editingCardId === config.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">客户名称</label>
                            <input
                              type="text"
                              value={editForm.customerName}
                              onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">所属行业 (更改会自动填充该行业的所有认证)</label>
                            <select
                              value={editForm.industry}
                              onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                              {INDUSTRIES_DATA.map(ind => (
                                <option key={ind.id} value={ind.industryName}>{ind.industryName}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              onClick={() => setEditingCardId(null)}
                              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                            >
                              取消
                            </button>
                            <button
                              onClick={() => handleSaveEdit(config.id)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                            >
                              保存
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-slate-900">{config.customerName}</h3>
                            <button
                              onClick={() => {
                                setEditingCardId(config.id);
                                setEditForm({ customerName: config.customerName, industry: config.industry });
                              }}
                              className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                              title="编辑客户信息"
                            >
                              <Settings size={16} />
                            </button>
                            <button
                              onClick={() => handleRemoveConfig(config.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1 ml-auto"
                              title="删除此配置"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 inline-flex px-3 py-1 rounded-full">
                            <Building size={14} className="text-slate-400" />
                            <span>{config.industry}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {editingCardId !== config.id && (
                      <button
                        onClick={() => {
                          setConfigToCopy(config);
                          setCopyCustomerName(`${config.customerName} (副本)`);
                          setIsCopyModalOpen(true);
                        }}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm shrink-0"
                        title="复制此配置"
                      >
                        <Copy size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col gap-6">
                  {/* Customer Certs */}
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <User size={16} className="text-indigo-500" />
                        客户认证名称
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                          {config.customerCerts.length}
                        </span>
                      </h4>
                      {config.customerCerts.length > 0 && (
                        <button
                          onClick={() => clearAllCustomerCerts(config.id)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          一键清除
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {visibleCustomerCerts.map((cert) => (
                        <div key={cert} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-800">
                          <span>{cert}</span>
                          <button
                            onClick={() => handleRemoveCustomerCert(config.id, cert)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-indigo-200 hover:text-indigo-900 text-indigo-400 transition-colors ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      
                      {hasMoreCustomerCerts && (
                        <button
                          onClick={() => toggleCustomerCerts(config.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                          {isCustomerCertsExpanded ? (
                            <><ChevronUp size={14} /> 收起</>
                          ) : (
                            <><ChevronDown size={14} /> 查看更多 ({config.customerCerts.length - 5})</>
                          )}
                        </button>
                      )}

                      {addingCustomerCertFor === config.id ? (
                        <div className="flex items-center gap-2 bg-slate-50 p-1 border border-slate-200 rounded-lg">
                          <input
                            type="text"
                            value={newCustomerCertValue}
                            onChange={(e) => setNewCustomerCertValue(e.target.value)}
                            placeholder="输入认证名称"
                            className="w-32 px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddCustomerCert(config.id);
                              if (e.key === 'Escape') setAddingCustomerCertFor(null);
                            }}
                          />
                          <button onClick={() => setAddingCustomerCertFor(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                          <button onClick={() => handleAddCustomerCert(config.id)} className="text-blue-500 hover:text-blue-700"><Check size={14} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAddingCustomerCertFor(config.id);
                            setNewCustomerCertValue('');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 text-sm font-medium text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                        >
                          <Plus size={14} /> 添加
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Industry Certs */}
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        行业认证名称
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                          {config.industryCerts.length}
                        </span>
                      </h4>
                      {config.industryCerts.length > 0 && (
                        <button
                          onClick={() => clearAllIndustryCerts(config.id)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          一键清除
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {visibleIndustryCerts.map((cert) => (
                        <div key={cert} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-800">
                          <span>{cert}</span>
                          <button
                            onClick={() => handleRemoveIndustryCert(config.id, cert)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-emerald-200 hover:text-emerald-900 text-emerald-400 transition-colors ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      {hasMoreIndustryCerts && (
                        <button
                          onClick={() => toggleIndustryCerts(config.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                          {isIndustryCertsExpanded ? (
                            <><ChevronUp size={14} /> 收起</>
                          ) : (
                            <><ChevronDown size={14} /> 查看更多 ({config.industryCerts.length - 5})</>
                          )}
                        </button>
                      )}

                      {addingIndustryCertFor === config.id ? (
                        <div className="flex items-center gap-2 bg-slate-50 p-1 border border-slate-200 rounded-lg">
                          <select
                            value={newIndustryCertValue}
                            onChange={(e) => setNewIndustryCertValue(e.target.value)}
                            className="w-40 px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">-- 选择行业认证 --</option>
                            {availableIndustryCerts.map((cert) => (
                              <option key={cert} value={cert}>{cert}</option>
                            ))}
                          </select>
                          <button onClick={() => setAddingIndustryCertFor(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                          <button 
                            onClick={() => handleAddIndustryCert(config.id)} 
                            disabled={!newIndustryCertValue}
                            className={`text-blue-500 hover:text-blue-700 ${!newIndustryCertValue ? 'opacity-50' : ''}`}
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        availableIndustryCerts.length > 0 && (
                          <button
                            onClick={() => {
                              setAddingIndustryCertFor(config.id);
                              setNewIndustryCertValue(availableIndustryCerts[0]);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 text-sm font-medium text-slate-500 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                          >
                            <Plus size={14} /> 添加
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center min-h-[300px] cursor-pointer group"
            onClick={() => setIsAddModalOpen(true)}
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-blue-500" />
              </div>
              <h3 className="text-base font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                新增客户认证配置
              </h3>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">新增客户认证配置</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">客户名称</label>
                  <input
                    type="text"
                    value={newConfig.customerName}
                    onChange={(e) => setNewConfig({ ...newConfig, customerName: e.target.value })}
                    placeholder="输入客户名称"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">所属行业 (将自动填充该行业所有认证)</label>
                  <select
                    value={newConfig.industry}
                    onChange={(e) => setNewConfig({ ...newConfig, industry: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    {INDUSTRIES_DATA.map(ind => (
                      <option key={ind.id} value={ind.industryName}>{ind.industryName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddConfig}
                  disabled={!newConfig.customerName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  新建配置
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Copy Modal */}
      <AnimatePresence>
        {isCopyModalOpen && configToCopy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">复制配置</h3>
                <button
                  onClick={() => setIsCopyModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800">
                    复制 <strong>{configToCopy.customerName}</strong> 的配置（包含所属行业、客户认证名称及行业认证名称）。
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">新客户名称</label>
                  <input
                    type="text"
                    value={copyCustomerName}
                    onChange={(e) => setCopyCustomerName(e.target.value)}
                    placeholder="输入新客户名称"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCopyConfig();
                    }}
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => setIsCopyModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCopyConfig}
                  disabled={!copyCustomerName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  确认复制
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
