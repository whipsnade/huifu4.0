import React, { useState } from 'react';
import { Edit, X, FileText, CheckCircle, Clock } from 'lucide-react';

const MOCK_APPROVALS = [
  { id: 'APP-001', ticketId: 'WO-2023-001', customer: 'Acme Corp', amount: 240.00, status: 'Pending', date: '2023-10-25' },
  { id: 'APP-002', ticketId: 'WO-2023-002', customer: 'TechStart', amount: 150.00, status: 'Approved', date: '2023-10-24' },
  { id: 'APP-003', ticketId: 'WO-2023-003', customer: 'Global Retail', amount: 500.00, status: 'Pending', date: '2023-10-26' },
];

export const BusinessProcessPaymentApprovalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved'>('Pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);

  const filteredApprovals = MOCK_APPROVALS.filter(a => a.status === activeTab);

  const handleEditClick = (approval: any) => {
    setSelectedApproval(approval);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">工单支付审批流程</h1>
          <p className="text-slate-500 text-sm mt-1">管理客户定制化的工单支付审批流程</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('Pending')}
          className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'Pending' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          待审批
        </button>
        <button
          onClick={() => setActiveTab('Approved')}
          className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'Approved' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          已审批
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">审批编号</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">关联工单</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">客户</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">金额</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">申请日期</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApprovals.map(approval => (
                <tr key={approval.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{approval.id}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600 hover:underline cursor-pointer">{approval.ticketId}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{approval.customer}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">¥{approval.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{approval.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEditClick(approval)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                      title="编辑审批详情"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredApprovals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">审批详情</h2>
                <p className="text-sm text-slate-500 mt-1">{selectedApproval.id} • {selectedApproval.ticketId}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Settlement Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-800">结算</h3>
                </div>
                
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <div className="flex justify-between text-sm font-semibold text-slate-500 mb-3 pb-2 border-b border-slate-200">
                    <span>费用项目</span>
                    <span>金额</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">基础服务费</span>
                      <span className="text-sm font-medium text-slate-900">¥200.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">上门交通费</span>
                      <span className="text-sm font-medium text-slate-900">¥50.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-slate-700 block">SLA扣除费用 (响应提前/超时)</span>
                        <span className="text-xs text-slate-400">基础服务费 ¥200.00 * -2.5%</span>
                      </div>
                      <span className="text-sm font-medium text-red-500">¥-5.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-slate-700 block">SLA扣除费用 (提前/超时抵达)</span>
                        <span className="text-xs text-slate-400">基础服务费 ¥200.00 * +2.5%</span>
                      </div>
                      <span className="text-sm font-medium text-emerald-500">¥+5.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-slate-700 block">SLA扣除费用 (开表/停表超时)</span>
                        <span className="text-xs text-slate-400">基础服务费 ¥200.00 * -5%</span>
                      </div>
                      <span className="text-sm font-medium text-red-500">¥-10.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-slate-700 block">SLA扣除费用 (修复提前/超时)</span>
                        <span className="text-xs text-slate-400">基础服务费 ¥200.00 * +2.5%</span>
                      </div>
                      <span className="text-sm font-medium text-emerald-500">¥+5.00</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">备件更换</span>
                      <span className="text-sm font-medium text-slate-900">¥00.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-slate-700 block">评价</span>
                        <span className="text-xs text-slate-400">基础服务费 ¥200.00 * +2.5%</span>
                      </div>
                      <span className="text-sm font-medium text-emerald-500">¥+5.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-slate-700 block">投诉扣除费用</span>
                        <span className="text-xs text-slate-400">基础服务费 ¥200.00 * -5%</span>
                      </div>
                      <span className="text-sm font-medium text-red-500">¥-10.00</span>
                    </div>
                    
                    <div className="pt-2">
                      <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">更多 ...</button>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900">预计总额</span>
                    <span className="text-lg font-bold text-slate-900">¥240.00</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">* 最终结算金额将根据实际耗材和工时确定</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                关闭
              </button>
              {selectedApproval.status === 'Pending' && (
                <button 
                  onClick={() => {
                    alert('审批通过');
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  通过审批
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
