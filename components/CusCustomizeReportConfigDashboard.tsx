import React from 'react';
import { 
  ChevronRight, 
  Search, 
  Plus, 
  MoreVertical,
  BarChart3,
  Edit2,
  Copy,
  Trash2,
  Calendar,
  Clock,
  User,
  LayoutGrid,
  List,
  X,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface CustomizedReport {
  id: string;
  name: string;
  description: string;
  chartType: 'table' | 'bar' | 'line' | 'pie';
  creator: string;
  updatedAt: string;
  config: any; // The detailed configuration from the builder
}

interface Props {
  reports: CustomizedReport[];
  onCreateNew: (data: { name: string; description: string }) => void;
  onEdit: (report: CustomizedReport) => void;
  onCopy: (report: CustomizedReport) => void;
  onDelete: (id: string) => void;
}

export function CusCustomizeReportConfigDashboard({ 
  reports, 
  onCreateNew, 
  onEdit, 
  onCopy, 
  onDelete 
}: Props) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', description: '' });
  const [editingReport, setEditingReport] = React.useState<CustomizedReport | null>(null);

  const handleStartCreate = () => {
    setEditingReport(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleStartEdit = (report: CustomizedReport) => {
    setEditingReport(report);
    setFormData({ name: report.name, description: report.description });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReport) {
      onEdit({ ...editingReport, name: formData.name, description: formData.description });
    } else {
      onCreateNew(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto custom-scrollbar">
      <header className="mb-8 overflow-hidden">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 font-medium">
          <span>运营</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">客户自定义报表</span>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">客户自定义报表</h1>
            <p className="text-slate-500 text-sm font-medium italic">管理并查看为您定制的专属数据报表。</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'grid' ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'list' ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索报表名称..."
                className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-100 outline-none w-64 transition-all font-medium shadow-sm"
              />
            </div>
            <button 
              onClick={handleStartCreate}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              新建自定义报表
            </button>
          </div>
        </div>
      </header>


      {reports.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center">
          <div className="p-8 bg-slate-50 rounded-[2.5rem] mb-6">
            <BarChart3 className="w-16 h-16 text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">暂无定制报表</h2>
          <p className="text-slate-400 text-sm font-medium mb-8 max-w-md italic">
            您可以根据业务需求，通过灵活的字段选择和图表配置，<br />创建专属于您的数据分析视图。
          </p>
          <button 
            onClick={handleStartCreate}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            开启您的第一个报表
          </button>
        </div>
      ) : (
        <div className={cn(
          "grid gap-6 pb-20",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
        )}>
          {reports.map((report) => (
            <div 
              key={report.id}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group relative border-l-4 border-l-transparent hover:border-l-indigo-500 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "p-4 rounded-2xl shadow-inner",
                  report.chartType === 'bar' ? "bg-indigo-50 text-indigo-500" :
                  report.chartType === 'line' ? "bg-emerald-50 text-emerald-500" :
                  report.chartType === 'pie' ? "bg-amber-50 text-amber-500" : "bg-slate-50 text-slate-500"
                )}>
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleStartEdit(report)}
                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onCopy(report)}
                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(report.id)}
                    className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{report.name}</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 line-clamp-2 h-10 italic">
                  {report.description || '暂无描述信息'}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    <User className="w-3 h-3" />
                    {report.creator}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    {report.updatedAt}
                  </div>
                </div>
                
                <span className={cn(
                  "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                  report.chartType === 'table' ? "bg-slate-100 text-slate-600" :
                  report.chartType === 'bar' ? "bg-indigo-100 text-indigo-600" :
                  report.chartType === 'line' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                )}>
                  {report.chartType}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Initiation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingReport ? '编辑报表信息' : '新建自定义报表'}</h2>
                  <p className="text-sm text-slate-400 font-medium">输入报表名称和描述信息开始设计</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-100">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">报表名称</label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例如: 客户月度投诉统计报表"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:outline-none focus:bg-white focus:border-indigo-300 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">描述信息</label>
                  <div className="relative group">
                    <List className="absolute left-5 top-5 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="输入关于此报表的简短说明..."
                      rows={4}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:outline-none focus:bg-white focus:border-indigo-300 transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"
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
