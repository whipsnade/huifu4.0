import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  User, 
  History,
  AlertCircle,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FormTemplate } from '../types';
import { cn } from '../lib/utils';

interface CusCaseFormDefinitionViewProps {
  templates: FormTemplate[];
  onEdit: (template: FormTemplate) => void;
  onAdd: () => void;
  onCopy: (template: FormTemplate) => void;
  onUpdateStatus: (id: string, status: 'Published' | 'Unpublished' | 'Deprecated') => void;
  onPublish: (templateId: string) => void;
}

export default function CusCaseFormDefinitionView({ 
  templates, 
  onEdit, 
  onAdd, 
  onCopy,
  onUpdateStatus,
  onPublish
}: CusCaseFormDefinitionViewProps) {
  const [activeTab, setActiveTab] = useState<'In Use' | 'Deprecated'>('In Use');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'In Use' ? (t.status === 'Published' || t.status === 'Unpublished') : t.status === 'Deprecated';
    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full flex flex-col bg-[#F8F9FA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="text-indigo-600" size={28} />
              表单管理 (Form Management)
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              管理多场景数据收集模板及其版本生命周期
            </p>
          </div>
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:translate-y-[-2px] active:translate-y-0 transition-all"
          >
            <Plus size={20} />
            创建新模板
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full p-8 px-8 mt-4">
        {/* Search & Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
            <button
              onClick={() => setActiveTab('In Use')}
              className={cn(
                "px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'In Use' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <CheckCircle2 size={18} />
              使用中 (In Use)
            </button>
            <button
              onClick={() => setActiveTab('Deprecated')}
              className={cn(
                "px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'Deprecated' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <History size={18} />
              已弃用 (Deprecated)
            </button>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索模板名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Template Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border-2",
                          template.status === 'Published' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : 
                          template.status === 'Deprecated' ? "bg-slate-50 border-slate-100 text-slate-400" :
                          "bg-amber-50 border-amber-100 text-amber-600"
                        )}>
                          <FileText size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{template.name}</h3>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={10} />
                            v{template.version}
                          </span>
                        </div>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                        template.status === 'Published' ? "bg-emerald-100 text-emerald-700" : 
                        template.status === 'Deprecated' ? "bg-slate-100 text-slate-600" :
                        "bg-amber-100 text-amber-700"
                      )}>
                        {template.status === 'Published' ? '已发布' : template.status === 'Deprecated' ? '已弃用' : '未发布'}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
                          <User size={14} className="text-slate-300" />
                          创建人
                        </span>
                        <span className="text-slate-700">{template.creator}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-300" />
                          创建时间
                        </span>
                        <span className="text-slate-700">{template.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 flex gap-2">
                    {activeTab === 'In Use' ? (
                      <>
                        <button 
                          onClick={() => onEdit(template)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
                        >
                          <Edit2 size={14} />
                          编辑
                        </button>
                        <button 
                          onClick={() => onCopy(template)}
                          className="px-3 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
                          title="复制模板"
                        >
                          <Copy size={14} />
                        </button>
                        {template.status === 'Unpublished' && (
                          <button 
                            onClick={() => onPublish(template.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                          >
                            <CheckCircle2 size={14} />
                            发布
                          </button>
                        )}
                      </>
                    ) : (
                      <button 
                        onClick={() => onEdit(template)} // Will be ReadOnly in designer
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase hover:bg-slate-100 transition-all shadow-sm"
                      >
                        <Eye size={14} />
                        只读查看
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                <Search size={40} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">没有找到匹配的模板</h3>
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed">请尝试更换搜索关键词，或者在当前 Tab 下创建新的表单模板开始配置。</p>
          </div>
        )}
      </div>

      {activeTab === 'In Use' && filteredTemplates.length > 0 && (
          <div className="max-w-7xl mx-auto w-full px-8 pb-10">
            <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-3xl p-6 flex items-start gap-4">
                <AlertCircle className="text-indigo-500 shrink-0" size={24} />
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tight">发布逻辑提示</h4>
                    <p className="text-xs text-indigo-700/80 font-medium leading-relaxed">
                        当您发布一个新的模板版本时，系统中相同名称的“已发布”旧版本将自动转入“已弃用”状态。编辑已发布的模板后，其状态将变为“未发布”，并在再次发布时覆盖老版本。
                    </p>
                </div>
            </div>
          </div>
      )}
    </div>
  );
}
