import React, { useState } from 'react';
import { Search, Ticket, Filter, ChevronDown, ChevronRight, Download, MoreVertical, ExternalLink } from 'lucide-react';
import { MOCK_WORK_ORDERS } from '../constants';
import { WorkOrder, ViewState } from '../types';
import { cn } from '../lib/utils';

interface Props {
  onViewChange?: (view: ViewState, params?: any) => void;
}

const statusColors: Record<string, string> = {
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-100',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
  'Cancelled': 'bg-red-50 text-red-700 border-red-100',
  '服务台处理中': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  '已超期': 'bg-red-600 text-white border-red-700',
  '超期预警': 'bg-amber-400 text-white border-amber-500',
};

export const CusITAndVendorCaseView: React.FC<Props> = ({ onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filteredOrders = MOCK_WORK_ORDERS.filter(wo => {
    const matchesSearch = 
      wo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wo.storeName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wo.storeNumber?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || wo.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">工单总览</h1>
          <p className="text-slate-500 text-sm mt-1">查看和管理所有系统工单</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" /> 导出数据
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="搜索工单号、客户、门店..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">所有状态</option>
              <option value="Pending">待处理</option>
              <option value="In Progress">进行中</option>
              <option value="Completed">已完成</option>
              <option value="服务台处理中">服务台处理中</option>
              <option value="已超期">已超期</option>
              <option value="超期预警">超期预警</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            共 <span className="text-indigo-600 font-bold">{filteredOrders.length}</span> 条记录
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">工单编号</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">所属客户</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">门店编号</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">门店名称</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">工单分类</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">报修分类</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">工单状态</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">案件等级</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">工程师</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">创建时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(wo => (
                <tr 
                  key={wo.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => onViewChange?.(ViewState.TICKET_VIEW, { workOrderId: wo.id, fromView: ViewState.VENDOR_CASE_OVERVIEW })}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="font-bold text-slate-900">{wo.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{wo.customer}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{wo.storeNumber || 'ST-0001'}</td>
                  <td className="px-6 py-4 text-slate-600">{wo.storeName || '默认门店'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                      {wo.category || '上门'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{wo.repairCategory || '软件故障'}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium border",
                      statusColors[wo.status] || 'bg-slate-50 text-slate-600'
                    )}>
                      {wo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-700">{wo.caseLevel || 'P3'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {wo.engineer?.charAt(0) || '?'}
                      </div>
                      <span className="text-slate-600">{wo.engineer || '--'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-medium">{wo.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="py-20 text-center text-slate-400">
               <Ticket className="w-12 h-12 mx-auto mb-3 opacity-10" />
               <p>没有找到工单记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
