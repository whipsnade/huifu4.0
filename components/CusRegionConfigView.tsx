import React from 'react';
import { 
  Briefcase, 
  ChevronRight, 
  MapPin, 
  Calendar,
  User,
  Globe,
  MoreVertical,
  Search,
  Plus,
  Flag
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CustomerRegion } from '../types';

interface CustomerRegionSettingsProps {
  regions: CustomerRegion[];
  onAddNew: () => void;
  onEdit: (region: CustomerRegion) => void;
}

export default function CustomerRegionSettings({ regions, onAddNew, onEdit }: CustomerRegionSettingsProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
      <header className="px-8 py-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">客户区域设置</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">管理客户已保存的全球区域配置与成员详情</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索客户或区域..." 
              className="pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
            />
          </div>
          <button 
            onClick={onAddNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            新建配置
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {regions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
              <Globe className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">暂无区域配置</h3>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-8">
              您还没有创建任何客户区域。点击上方“新建配置”按钮，通过全球资源库开始构建。
            </p>
            <button 
              onClick={onAddNew}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              立刻前往
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {/* Create New Placeholder Card */}
            <div 
              onClick={onAddNew}
              className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[280px] group cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:scale-110 transition-all border border-slate-100">
                <Plus className="w-7 h-7 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">新建区域配置</h4>
              <p className="text-xs text-slate-500 font-medium mt-1">使用全球资源库开始构建</p>
            </div>

            {regions.map((region) => (
              <div 
                key={region.id}
                onClick={() => onEdit(region)}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">{region.customerName}</h4>
                    <p className="text-xs text-indigo-500 font-medium uppercase tracking-widest">{region.regionName}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <div className="flex flex-wrap gap-2">
                       {region.country && (
                         <span className="text-xs font-bold text-slate-600 px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
                           {region.country.name}
                         </span>
                       )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Flag className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]" title={region.markets.join(', ')}>
                      市场: {region.markets.join(' / ') || '暂无'}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>创建于 {region.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>管理员</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
