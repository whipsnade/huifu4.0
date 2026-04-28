import React from 'react';
import { 
  FileText, 
  ChevronRight, 
  Search, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Wrench, 
  Building,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';

const commonReports = [
  {
    category: '工单分析',
    reports: [
      { name: '客户工单月度汇总', description: '按月统计客户工单数量、完成率和平均响应时间。', icon: Calendar },
      { name: '工单分类分布', description: '分析不同报修分类下的工单比例。', icon: BarChart3 },
      { name: 'SLA 达成分析', description: '监控各服务等级协议的达成情况。', icon: TrendingUp },
    ]
  },
  {
    category: '资源分析',
    reports: [
      { name: '工程师效率排行', description: '统计工程师的接单量、好评率和平均处理时长。', icon: Wrench },
      { name: '门店报修频次报表', description: '识别经常需要维修的高频门店及其问题点。', icon: Building },
      { name: '供应商服务质量评估', description: '根据关键指标对第三方供应商进行打分评估。', icon: Users },
    ]
  }
];

export function CusGeneralReportConfigView() {
  return (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto custom-scrollbar">
      <header className="mb-8 overflow-hidden">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 font-medium">
          <span>运营</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">客户通用报表</span>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">客户通用报表</h1>
            <p className="text-slate-500 text-sm font-medium italic">提供标准的、预设的报表分析，快速获取核心经营数据。</p>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="搜索报表名称..."
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-100 outline-none w-80 transition-all font-medium shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="space-y-12 pb-20">
        {commonReports.map((group, groupIdx) => (
          <div key={groupIdx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${groupIdx * 100}ms` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-0.5 flex-1 bg-slate-200 rounded-full" />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{group.category}</h2>
              <div className="h-0.5 flex-1 bg-slate-200 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {group.reports.map((report, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors outline outline-0 group-hover:outline-4 outline-indigo-50 shadow-inner">
                      <report.icon className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors" title="筛选">
                        <Filter className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors" title="下载">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{report.name}</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed leading-5">
                    {report.description}
                  </p>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Standard Report</span>
                    <button className="text-indigo-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      立即查看
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
