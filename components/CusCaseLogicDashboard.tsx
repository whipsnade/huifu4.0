import React, { useState, useMemo } from 'react';
import { LayoutGrid, Plus, FileText, Calendar, User, X, CheckCircle2, Clock, Ban, Hash, Send, History } from 'lucide-react';
import { Process, ProcessStatus } from '../types';
import { cn } from '../lib/utils';

interface CusCaseLogicDashboardProps {
  processes: Process[];
  onOpenDesign: (process?: Process) => void;
  onCreateNew: (data: { customerName: string; processName: string }) => void;
  onUpdateStatus: (processId: string, status: ProcessStatus) => void;
}

type TabType = 'using' | 'deprecated';

export default function CusCaseLogicDashboard({ processes, onOpenDesign, onCreateNew, onUpdateStatus }: CusCaseLogicDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('using');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    processName: ''
  });

  const filteredProcesses = useMemo(() => {
    if (activeTab === 'using') {
      return processes.filter(p => p.status === 'published' || p.status === 'draft');
    }
    return processes.filter(p => p.status === 'deprecated');
  }, [processes, activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerName && formData.processName) {
      onCreateNew(formData);
      setIsModalOpen(false);
      setFormData({ customerName: '', processName: '' });
    }
  };

  return (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">工单逻辑配置列表</h1>
          <p className="text-slate-500 text-sm">管理和查看已设计的业务逻辑流程</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" />
          新建流程
        </button>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-200/50 p-1 rounded-2xl w-fit mb-8 border border-slate-200">
        <button
          onClick={() => setActiveTab('using')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
            activeTab === 'using' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          使用中
          <span className="px-1.5 py-0.5 bg-indigo-50 text-[10px] rounded-md">{processes.filter(p => p.status !== 'deprecated').length}</span>
        </button>
        <button
          onClick={() => setActiveTab('deprecated')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
            activeTab === 'deprecated' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          已弃用
          <span className="px-1.5 py-0.5 bg-rose-50 text-[10px] rounded-md">{processes.filter(p => p.status === 'deprecated').length}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {/* Placeholder Card - Only for 'using' tab */}
        {activeTab === 'using' && (
          <div 
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[280px] cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-300">
              <Plus className="w-8 h-8 text-slate-300 group-hover:text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600">新建流程设计</h3>
            <p className="text-[10px] text-slate-400 text-center px-4 uppercase tracking-widest font-bold">New Creation</p>
          </div>
        )}

        {/* Process Cards */}
        {filteredProcesses.map(process => (
          <div key={process.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            {/* Version Badge - Corner Overlay Style */}
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-slate-100/80 rounded-bl-2xl text-[10px] font-black text-slate-500 flex items-center gap-1 border-l border-b border-slate-200">
              <Hash className="w-2.5 h-2.5" />
              V{process.version}
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <button 
                  disabled={process.status !== 'draft'}
                  onClick={(e) => {
                    if (process.status === 'draft') {
                      e.stopPropagation();
                      onUpdateStatus(process.id, 'published');
                    }
                  }}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 transition-all",
                    process.status === 'published' && "bg-green-50 text-green-600 border border-green-100",
                    process.status === 'draft' && "bg-orange-50 text-orange-600 border border-orange-100 cursor-pointer hover:bg-black hover:text-white hover:border-black",
                    process.status === 'deprecated' && "bg-slate-100 text-slate-500 border border-slate-200"
                  )}
                >
                  {process.status === 'published' && <CheckCircle2 className="w-3 h-3" />}
                  {process.status === 'draft' && <Clock className="w-3 h-3" />}
                  {process.status === 'deprecated' && <Ban className="w-3 h-3" />}
                  {process.status === 'published' ? '已发布' : process.status === 'draft' ? '未发布 (点击发布)' : '已弃用'}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors truncate pr-16">{process.processName}</h3>
              <p className="text-xs text-slate-500 font-medium tracking-tight">客户名称: <span className="text-slate-900 font-bold">{process.customerName}</span></p>
            </div>
            
            <div className="space-y-3 mb-8 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>创建人: {process.creator}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>更新于 {process.updatedAt}</span>
              </div>
            </div>

            <button 
              onClick={() => onOpenDesign(process)}
              className={cn(
                "w-full py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-lg",
                process.status === 'deprecated' 
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-none border border-slate-200" 
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-100"
              )}
            >
              {process.status === 'deprecated' ? '查看详情' : '继续编辑'}
            </button>
          </div>
        ))}

        {filteredProcesses.length === 0 && activeTab === 'deprecated' && (
          <div className="col-span-full py-20 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <Ban className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Deprecated Versions</p>
          </div>
        )}
      </div>

      {/* New Process Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-900">新建业务流程设计</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">客户名称</label>
                  <input
                    required
                    type="text"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="例如: 某某集团"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:bg-white transition-all font-medium text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">业务流程名称</label>
                  <input
                    required
                    type="text"
                    value={formData.processName}
                    onChange={e => setFormData({ ...formData, processName: e.target.value })}
                    placeholder="例如: 设备报修标准逻辑"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:bg-white transition-all font-medium text-slate-700"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    下一步
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
