import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Building2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IndustryCert {
  id: string;
  industryName: string;
  certifications: string[];
}

const INITIAL_DATA: IndustryCert[] = [
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

export const IndustryCertificationConfigView: React.FC = () => {
  const [industries, setIndustries] = useState<IndustryCert[]>(INITIAL_DATA);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  
  // Modal states for adding industry
  const [isAddIndustryModalOpen, setIsAddIndustryModalOpen] = useState(false);
  const [newIndustryName, setNewIndustryName] = useState('');
  const [newIndustryCerts, setNewIndustryCerts] = useState('');

  // Modal states for adding certification to existing industry
  const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false);
  const [activeIndustryId, setActiveIndustryId] = useState<string | null>(null);
  const [newCertName, setNewCertName] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const removeCertification = (industryId: string, certToRemove: string) => {
    setIndustries(prev => prev.map(ind => {
      if (ind.id === industryId) {
        return {
          ...ind,
          certifications: ind.certifications.filter(cert => cert !== certToRemove)
        };
      }
      return ind;
    }));
  };

  const handleAddIndustry = () => {
    if (!newIndustryName.trim()) return;
    
    const certs = newIndustryCerts.split(',').map(c => c.trim()).filter(c => c);
    
    const newIndustry: IndustryCert = {
      id: Date.now().toString(),
      industryName: newIndustryName,
      certifications: certs
    };
    
    setIndustries([...industries, newIndustry]);
    setIsAddIndustryModalOpen(false);
    setNewIndustryName('');
    setNewIndustryCerts('');
  };

  const handleAddCertification = () => {
    if (!newCertName.trim() || !activeIndustryId) return;
    
    setIndustries(prev => prev.map(ind => {
      if (ind.id === activeIndustryId) {
        // Avoid duplicates
        if (ind.certifications.includes(newCertName.trim())) return ind;
        return {
          ...ind,
          certifications: [...ind.certifications, newCertName.trim()]
        };
      }
      return ind;
    }));
    
    setIsAddCertModalOpen(false);
    setNewCertName('');
    setActiveIndustryId(null);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">认证名称配置</h1>
          <p className="text-sm text-slate-500">管理各行业的专业资格认证信息</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {/* Add New Industry Card */}
        <button 
          onClick={() => setIsAddIndustryModalOpen(true)}
          className="h-full min-h-[280px] flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 hover:text-blue-600 text-slate-500 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Plus size={32} className="text-slate-400 group-hover:text-blue-500" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg mb-1">新增行业及认证</h3>
            <p className="text-sm opacity-70">点击添加新的行业分类</p>
          </div>
        </button>

        {/* Industry Cards */}
        {industries.map((industry) => {
          const isExpanded = expandedCards[industry.id];
          const displayCerts = isExpanded ? industry.certifications : industry.certifications.slice(0, 5);
          const hasMore = industry.certifications.length > 5;

          return (
            <motion.div 
              layout
              key={industry.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-slate-900 leading-tight">{industry.industryName}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Award size={12} />
                    共 {industry.certifications.length} 个认证
                  </p>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  <AnimatePresence>
                    {displayCerts.map((cert) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={cert}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 group"
                      >
                        <span>{cert}</span>
                        <button 
                          onClick={() => removeCertification(industry.id, cert)}
                          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 text-slate-400 transition-colors"
                          title="移除认证"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                  {hasMore ? (
                    <button 
                      onClick={() => toggleExpand(industry.id)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                      {isExpanded ? (
                        <>收起 <ChevronUp size={16} /></>
                      ) : (
                        <>查看更多 ({industry.certifications.length - 5}) <ChevronDown size={16} /></>
                      )}
                    </button>
                  ) : (
                    <div /> // Spacer
                  )}
                  
                  <button 
                    onClick={() => {
                      setActiveIndustryId(industry.id);
                      setIsAddCertModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                    title="添加认证"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Industry Modal */}
      {isAddIndustryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddIndustryModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">新增行业及认证</h3>
              <button 
                onClick={() => setIsAddIndustryModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">行业名称</label>
                <input 
                  type="text"
                  value={newIndustryName}
                  onChange={(e) => setNewIndustryName(e.target.value)}
                  placeholder="例如：金融业"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  资格证书名称 <span className="text-[10px] font-normal text-slate-400 ml-2">(多个证书请用逗号分隔)</span>
                </label>
                <textarea 
                  value={newIndustryCerts}
                  onChange={(e) => setNewIndustryCerts(e.target.value)}
                  placeholder="例如：CFA特许金融分析师, CPA注册会计师"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddIndustryModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleAddIndustry}
                disabled={!newIndustryName.trim()}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm shadow-blue-200"
              >
                保存
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Certification Modal */}
      {isAddCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddCertModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">添加资格证书</h3>
              <button 
                onClick={() => setIsAddCertModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">证书名称</label>
              <input 
                type="text"
                value={newCertName}
                onChange={(e) => setNewCertName(e.target.value)}
                placeholder="请输入资格证书名称"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCertification();
                  }
                }}
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddCertModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleAddCertification}
                disabled={!newCertName.trim()}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm shadow-blue-200"
              >
                添加
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
