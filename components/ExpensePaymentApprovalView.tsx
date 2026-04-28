import React, { useState } from 'react';
import { Search, Edit2, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { ApprovalLogTimeline, ApprovalLog, PaymentStatus } from './ApprovalLogTimeline';

interface PaymentApproval {
  id: string;
  expenseNo: string;
  workOrderNo: string;
  customerStore: string;
  engineer: string;
  amount: number;
  applicationTime: string;
  approvalResult?: '同意' | '拒绝';
  approvalRemarks?: string;
  approver?: string;
  approvalTime?: string;
  status: '待审批' | '审批中' | '已审批' | '待支付' | '支付完成' | '已关闭';
  paymentStatus: PaymentStatus;
  logs: ApprovalLog[];
}

const MOCK_DATA: PaymentApproval[] = [
  {
    id: '1',
    expenseNo: 'EXP-20231001-001',
    workOrderNo: 'WO-1001',
    customerStore: 'Acme Corp / Acme 市中心店',
    engineer: 'Bob Smith',
    amount: 450,
    applicationTime: '2023-10-01 10:00:00',
    status: '待审批',
    paymentStatus: 'created',
    logs: [
      {
        id: 'l1',
        approver: 'Bob Smith',
        role: 'ENGINEER',
        time: '2023-10-01 10:00:00',
        result: '提交申请',
        remarks: '申请支付工单费用'
      }
    ]
  },
  {
    id: '2',
    expenseNo: 'EXP-20231002-002',
    workOrderNo: 'WO-1002',
    customerStore: 'Wayne Ent / Wayne 第一工厂',
    engineer: 'Evan Wright',
    amount: 1200,
    applicationTime: '2023-10-02 11:30:00',
    status: '审批中',
    paymentStatus: 'in process',
    approver: 'Admin',
    approvalTime: '2023-10-02 14:00:00',
    approvalResult: '同意',
    approvalRemarks: '初审通过',
    logs: [
      {
        id: 'l1',
        approver: 'Evan Wright',
        role: 'ENGINEER',
        time: '2023-10-02 11:30:00',
        result: '提交申请',
        remarks: '申请支付工单费用'
      },
      {
        id: 'l2',
        approver: 'Admin',
        role: 'OPERATOR',
        time: '2023-10-02 14:00:00',
        result: '同意',
        remarks: '初审通过'
      }
    ]
  },
  {
    id: '3',
    expenseNo: 'EXP-20231003-003',
    workOrderNo: 'WO-1003',
    customerStore: 'Acme Corp / Acme 北区店',
    engineer: 'Bob Smith',
    amount: 150,
    applicationTime: '2023-10-03 09:15:00',
    status: '已审批',
    paymentStatus: 'complete',
    approver: 'Admin',
    approvalTime: '2023-10-03 10:30:00',
    approvalResult: '拒绝',
    approvalRemarks: '金额不符',
    logs: [
      {
        id: 'l1',
        approver: 'Bob Smith',
        role: 'ENGINEER',
        time: '2023-10-03 09:15:00',
        result: '提交申请',
        remarks: '申请支付工单费用'
      },
      {
        id: 'l2',
        approver: 'Admin',
        role: 'OPERATOR',
        time: '2023-10-03 10:30:00',
        result: '拒绝',
        remarks: '金额不符'
      }
    ]
  },
  {
    id: '4',
    expenseNo: 'EXP-20231004-004',
    workOrderNo: 'WO-1004',
    customerStore: 'TechStart Inc / TechStart 总部',
    engineer: 'Alice Johnson',
    amount: 800,
    applicationTime: '2023-10-04 09:00:00',
    status: '待支付',
    paymentStatus: 'pending payment',
    approver: 'Finance Manager',
    approvalTime: '2023-10-04 11:00:00',
    approvalResult: '同意',
    approvalRemarks: '终审通过，等待支付',
    logs: [
      {
        id: 'l1',
        approver: 'Alice Johnson',
        role: 'ENGINEER',
        time: '2023-10-04 09:00:00',
        result: '提交申请',
        remarks: '申请支付工单费用'
      },
      {
        id: 'l2',
        approver: 'Admin',
        role: 'OPERATOR',
        time: '2023-10-04 10:00:00',
        result: '同意',
        remarks: '初审通过'
      },
      {
        id: 'l3',
        approver: 'Finance Manager',
        role: 'FINANCE',
        time: '2023-10-04 11:00:00',
        result: '同意',
        remarks: '终审通过，等待支付'
      }
    ]
  },
  {
    id: '5',
    expenseNo: 'EXP-20231005-005',
    workOrderNo: 'WO-1005',
    customerStore: 'Wayne Ent / Wayne 第二工厂',
    engineer: 'Bob Smith',
    amount: 2500,
    applicationTime: '2023-10-05 08:30:00',
    status: '支付完成',
    paymentStatus: 'paid',
    approver: 'Finance Manager',
    approvalTime: '2023-10-05 14:00:00',
    approvalResult: '同意',
    approvalRemarks: '已完成支付',
    logs: [
      {
        id: 'l1',
        approver: 'Bob Smith',
        role: 'ENGINEER',
        time: '2023-10-05 08:30:00',
        result: '提交申请',
        remarks: '申请支付工单费用'
      },
      {
        id: 'l2',
        approver: 'Admin',
        role: 'OPERATOR',
        time: '2023-10-05 09:30:00',
        result: '同意',
        remarks: '初审通过'
      },
      {
        id: 'l3',
        approver: 'Finance Manager',
        role: 'FINANCE',
        time: '2023-10-05 10:30:00',
        result: '同意',
        remarks: '终审通过，等待支付'
      },
      {
        id: 'l4',
        approver: 'System',
        role: 'SYSTEM',
        time: '2023-10-05 14:00:00',
        result: '同意',
        remarks: '已完成支付'
      }
    ]
  },
  {
    id: '6',
    expenseNo: 'EXP-20231006-006',
    workOrderNo: 'WO-1006',
    customerStore: 'Acme Corp / Acme 南区店',
    engineer: 'Alice Johnson',
    amount: 950,
    applicationTime: '2023-10-06 09:00:00',
    status: '已关闭',
    paymentStatus: 'closed',
    approver: 'Finance Manager',
    approvalTime: '2023-10-06 16:00:00',
    approvalResult: '同意',
    approvalRemarks: '流程结束',
    logs: [
      {
        id: 'l1',
        approver: 'Alice Johnson',
        role: 'ENGINEER',
        time: '2023-10-06 09:00:00',
        result: '提交申请',
        remarks: '申请支付工单费用'
      },
      {
        id: 'l2',
        approver: 'Admin',
        role: 'OPERATOR',
        time: '2023-10-06 10:00:00',
        result: '同意',
        remarks: '初审通过'
      },
      {
        id: 'l3',
        approver: 'Finance Manager',
        role: 'FINANCE',
        time: '2023-10-06 11:00:00',
        result: '同意',
        remarks: '终审通过，等待支付'
      },
      {
        id: 'l4',
        approver: 'System',
        role: 'SYSTEM',
        time: '2023-10-06 14:00:00',
        result: '同意',
        remarks: '已完成支付'
      },
      {
        id: 'l5',
        approver: 'System',
        role: 'SYSTEM',
        time: '2023-10-06 16:00:00',
        result: '同意',
        remarks: '流程结束'
      }
    ]
  }
];

import { ViewState } from '../types';

export const ExpensePaymentApprovalView: React.FC<{ onChangeView?: (view: ViewState, params?: any) => void }> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<'待审批' | '审批中' | '已审批' | '待支付' | '支付完成' | '已关闭'>('待审批');
  const [approvals, setApprovals] = useState<PaymentApproval[]>(MOCK_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingApproval, setEditingApproval] = useState<PaymentApproval | null>(null);
  const [viewingLogsFor, setViewingLogsFor] = useState<PaymentApproval | null>(null);
  const [approvalResult, setApprovalResult] = useState<'同意' | '拒绝' | ''>('');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [showError, setShowError] = useState(false);

  const filteredApprovals = approvals.filter(a => 
    a.status === activeTab && 
    (a.expenseNo.includes(searchTerm) || a.workOrderNo.includes(searchTerm) || a.engineer.includes(searchTerm))
  );

  const handleEdit = (approval: PaymentApproval) => {
    setEditingApproval(approval);
    setApprovalResult('');
    setApprovalRemarks('');
    setShowError(false);
  };

  const handleSave = () => {
    if (!approvalResult) {
      setShowError(true);
      return;
    }
    
    if (approvalResult === '拒绝' && !approvalRemarks.trim()) {
      setShowError(true);
      return;
    }

    if (editingApproval) {
      const now = new Date();
      const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const updatedApprovals = approvals.map(a => {
        if (a.id === editingApproval.id) {
          const newLog: ApprovalLog = {
            id: `l${a.logs.length + 1}`,
            approver: 'Current User',
            role: 'OPERATOR',
            time: formattedTime,
            result: approvalResult as '同意' | '拒绝',
            remarks: approvalRemarks
          };
          return {
            ...a,
            approvalResult: approvalResult as '同意' | '拒绝',
            approvalRemarks,
            approver: 'Current User', // Mock current user
            approvalTime: formattedTime,
            status: approvalResult === '同意' ? '审批中' : '已审批',
            logs: [...a.logs, newLog]
          };
        }
        return a;
      });
      
      setApprovals(updatedApprovals);
      setEditingApproval(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">工单支付审批</h1>
          <p className="text-slate-500 text-sm">管理工单费用的支付审批流程</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex">
            {(['待审批', '审批中', '已审批', '待支付', '支付完成', '已关闭'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab}
                <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
                  {approvals.filter(a => a.status === tab).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索费用编号/工单编号/工程师..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">费用编号</th>
                <th className="p-4 font-medium">工单编号</th>
                <th className="p-4 font-medium">所属客户/门店</th>
                <th className="p-4 font-medium">工程师</th>
                <th className="p-4 font-medium">金额(CNY)</th>
                <th className="p-4 font-medium">申请时间</th>
                <th className="p-4 font-medium">审批结果</th>
                <th className="p-4 font-medium">审批备注</th>
                <th className="p-4 font-medium">审批人</th>
                <th className="p-4 font-medium">审批时间</th>
                <th className="p-4 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p>暂无{activeTab}记录</p>
                  </td>
                </tr>
              ) : (
                filteredApprovals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-slate-50 transition-colors">
                    <td 
                      className="p-4 text-sm font-medium text-indigo-600 hover:underline cursor-pointer"
                      onClick={() => setViewingLogsFor(approval)}
                    >
                      {approval.expenseNo}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <button 
                        onClick={() => onChangeView?.(ViewState.WORK_ORDER_DETAIL)}
                        className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                      >
                        {approval.workOrderNo}
                      </button>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{approval.customerStore}</td>
                    <td className="p-4 text-sm text-slate-600">{approval.engineer}</td>
                    <td className="p-4 text-sm font-bold text-slate-700">¥{approval.amount.toFixed(2)}</td>
                    <td className="p-4 text-sm text-slate-500">{approval.applicationTime}</td>
                    <td className="p-4">
                      {approval.approvalResult ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          approval.approvalResult === '同意' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {approval.approvalResult === '同意' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {approval.approvalResult}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-600 max-w-[150px] truncate" title={approval.approvalRemarks}>
                      {approval.approvalRemarks || '-'}
                    </td>
                    <td className="p-4 text-sm text-slate-600">{approval.approver || '-'}</td>
                    <td className="p-4 text-sm text-slate-500">{approval.approvalTime || '-'}</td>
                    <td className="p-4 text-center">
                      {(activeTab === '待审批' || activeTab === '审批中') && (
                        <button 
                          onClick={() => handleEdit(approval)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="审批"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
      {editingApproval && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">工单支付审批</h3>
              <button onClick={() => setEditingApproval(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500">费用编号:</div>
                  <div className="font-medium text-slate-900">{editingApproval.expenseNo}</div>
                  <div className="text-slate-500">工单编号:</div>
                  <div className="font-medium text-slate-900">{editingApproval.workOrderNo}</div>
                  <div className="text-slate-500">金额:</div>
                  <div className="font-bold text-slate-900">¥{editingApproval.amount.toFixed(2)}</div>
                </div>
              </div>

              {/* Settlement Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800">结算明细</h3>
                </div>
                
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2 pb-2 border-b border-slate-200">
                    <span>费用项目</span>
                    <span>金额</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-700">基础服务费</span>
                      <span className="text-xs font-medium text-slate-900">¥200.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-700">上门交通费</span>
                      <span className="text-xs font-medium text-slate-900">¥50.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-slate-700 block">SLA扣除费用 (响应提前/超时)</span>
                        <span className="text-[10px] text-slate-400">基础服务费 ¥200.00 * -2.5%</span>
                      </div>
                      <span className="text-xs font-medium text-red-500">¥-5.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-slate-700 block">SLA扣除费用 (提前/超时抵达)</span>
                        <span className="text-[10px] text-slate-400">基础服务费 ¥200.00 * +2.5%</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-500">¥+5.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-slate-700 block">SLA扣除费用 (开表/停表超时)</span>
                        <span className="text-[10px] text-slate-400">基础服务费 ¥200.00 * -5%</span>
                      </div>
                      <span className="text-xs font-medium text-red-500">¥-10.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-slate-700 block">SLA扣除费用 (修复提前/超时)</span>
                        <span className="text-[10px] text-slate-400">基础服务费 ¥200.00 * +2.5%</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-500">¥+5.00</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-700">备件更换</span>
                      <span className="text-xs font-medium text-slate-900">¥00.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-slate-700 block">评价</span>
                        <span className="text-[10px] text-slate-400">基础服务费 ¥200.00 * +2.5%</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-500">¥+5.00</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-slate-700 block">投诉扣除费用</span>
                        <span className="text-[10px] text-slate-400">基础服务费 ¥200.00 * -5%</span>
                      </div>
                      <span className="text-xs font-medium text-red-500">¥-10.00</span>
                    </div>
                    
                    <div className="pt-1">
                      <button className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium">更多 ...</button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">预计总额</span>
                    <span className="text-sm font-bold text-slate-900">¥{editingApproval.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">审批结果 <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="approvalResult" 
                      value="同意" 
                      checked={approvalResult === '同意'}
                      onChange={() => setApprovalResult('同意')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">同意</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="approvalResult" 
                      value="拒绝" 
                      checked={approvalResult === '拒绝'}
                      onChange={() => setApprovalResult('拒绝')}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-slate-700">拒绝</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  审批备注 {approvalResult === '拒绝' && <span className="text-red-500">*</span>}
                </label>
                <textarea 
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${showError && approvalResult === '拒绝' && !approvalRemarks.trim() ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'}`}
                  rows={3}
                  placeholder={approvalResult === '拒绝' ? "请输入拒绝原因" : "选填"}
                />
                {showError && approvalResult === '拒绝' && !approvalRemarks.trim() && (
                  <p className="text-red-500 text-xs mt-1">拒绝时必须填写审批备注</p>
                )}
                {showError && !approvalResult && (
                  <p className="text-red-500 text-xs mt-1">请选择审批结果</p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setEditingApproval(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Modal */}
      {viewingLogsFor && (
        <ApprovalLogTimeline 
          logs={viewingLogsFor.logs} 
          onClose={() => setViewingLogsFor(null)} 
          title={`审批记录 - ${viewingLogsFor.expenseNo}`}
          paymentStatus={viewingLogsFor.paymentStatus}
        />
      )}
    </div>
  );
};
