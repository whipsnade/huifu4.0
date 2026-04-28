import React from 'react';
import { CheckCircle, XCircle, Clock, User, X } from 'lucide-react';

export type PaymentStatus = 'created' | 'in process' | 'complete' | 'pending payment' | 'paid' | 'closed';

const PAYMENT_STATUS_STEPS: string[] = ['created', 'in process', 'complete', 'paid', 'closed'];

export interface ApprovalLog {
  id: string;
  approver: string;
  role: string;
  time: string;
  result: '同意' | '拒绝' | '提交申请' | '待审批';
  remarks?: string;
}

interface ApprovalLogTimelineProps {
  logs: ApprovalLog[];
  onClose: () => void;
  title?: string;
  paymentStatus?: PaymentStatus;
}

export const ApprovalLogTimeline: React.FC<ApprovalLogTimelineProps> = ({ logs, onClose, title = "审批记录", paymentStatus }) => {
  const sortedLogs = [...logs].sort((a, b) => {
    if (a.time === '-' && b.time === '-') return 0;
    if (a.time === '-') return -1;
    if (b.time === '-') return 1;
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
          {paymentStatus && (
            <div className="mb-10 max-w-lg mx-auto">
              <h4 className="text-sm font-bold text-slate-700 mb-6">支付状态进度</h4>
              <div className="flex items-center justify-between relative px-2">
                {/* Background Line */}
                <div className="absolute left-4 right-4 top-2 -translate-y-1/2 h-1 bg-slate-200 rounded-full"></div>
                
                {/* Active Line */}
                <div 
                  className="absolute left-4 top-2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ 
                    width: paymentStatus === 'pending payment' 
                      ? `calc(${((PAYMENT_STATUS_STEPS.indexOf('complete') + 0.5) / (PAYMENT_STATUS_STEPS.length - 1)) * 100}% - 2rem)`
                      : `calc(${(PAYMENT_STATUS_STEPS.indexOf(paymentStatus) / (PAYMENT_STATUS_STEPS.length - 1)) * 100}% - 2rem)` 
                  }}
                ></div>

                {PAYMENT_STATUS_STEPS.map((step, index) => {
                  const currentIndex = paymentStatus === 'pending payment' 
                    ? PAYMENT_STATUS_STEPS.indexOf('complete') 
                    : PAYMENT_STATUS_STEPS.indexOf(paymentStatus);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = paymentStatus !== 'pending payment' && index === currentIndex;

                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center gap-2 w-16">
                      <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                        isCompleted ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'
                      } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}></div>
                      <span className={`text-[10px] font-bold uppercase text-center ${
                        isCompleted ? 'text-indigo-600' : 'text-slate-400'
                      }`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="relative max-w-lg mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-[15px] top-8 bottom-8 w-0.5 bg-indigo-500"></div>
            
            <div className="space-y-8">
              {sortedLogs.map((log, index) => (
                <div key={log.id} className="relative flex gap-8">
                  {/* Icon */}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-4 border-4 border-white shadow-sm ${
                    log.result === '待审批' ? 'bg-slate-300 text-slate-500' : 'bg-indigo-600 text-white'
                  }`}>
                    {log.result === '同意' ? <CheckCircle className="w-4 h-4" /> : 
                     log.result === '拒绝' ? <XCircle className="w-4 h-4" /> : 
                     <Clock className="w-4 h-4" />}
                  </div>
                  
                  {/* Content Card */}
                  <div className={`flex-1 bg-white border rounded-2xl p-5 shadow-sm ${
                    log.result === '待审批' ? 'border-slate-200 opacity-60' : 'border-slate-200'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider ${
                        log.result === '待审批' ? 'bg-slate-400' : 'bg-indigo-600'
                      }`}>
                        {log.result === '提交申请' ? 'SUBMITTED' : 
                         log.result === '同意' ? 'SERVICE COMPLETE CONFIRMED' : 
                         log.result === '待审批' ? 'PENDING APPROVAL' :
                         'SERVICE COMPLETE DENIED'}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-1">
                        {log.time}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        log.result === '待审批' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-bold text-sm ${log.result === '待审批' ? 'text-slate-500' : 'text-slate-900'}`}>{log.approver}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{log.role}</div>
                      </div>
                    </div>
                    
                    {log.remarks && (
                      <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 italic border border-slate-100">
                        "{log.remarks}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
