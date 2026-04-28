import React, { useState, useMemo } from 'react';
import { CreditCard, Wallet, ArrowUpRight, History, Check, ShieldCheck, ChevronRight, Plus, User, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_USERS } from '../constants';
import { UserRole } from '../types';

const REFILL_PLANS = [
  { id: 'p1', amount: 1000, points: 1000, tag: '' },
  { id: 'p2', amount: 5000, points: 5000, tag: '最常用' },
  { id: 'p3', amount: 10000, points: 10000, tag: '超值' },
  { id: 'p4', amount: 50000, points: 50000, tag: '商务优选' },
];

export const CusAccountRefillConfigView: React.FC = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('p2');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'alipay' | 'wechat'>('alipay');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('yum-cust-1'); // Default to YUM as per requirement
  const [refillType, setRefillType] = useState<'打包价' | '非打包价'>('打包价');

  const customers = useMemo(() => MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER), []);
  const selectedCustomer = useMemo(() => MOCK_USERS.find(u => u.id === selectedCustomerId), [selectedCustomerId]);

  // Update refill type based on customer enterprise type
  React.useEffect(() => {
    if (selectedCustomer) {
      if (selectedCustomer.enterpriseType === '连锁企业') {
        setRefillType('打包价');
      } else {
        setRefillType('非打包价');
      }
    }
  }, [selectedCustomerId, selectedCustomer]);

  const [refillHistory] = useState([
    { id: 'H1', date: '2024-04-15 14:30', customer: '百胜中国 (YUM China)', contractValidity: '2023-02-01 ~ 2026-01-31', refillType: '打包价', amount: 5000, points: 5250, totalPoints: 5250, status: 'Success' },
    { id: 'H2', date: '2024-03-20 09:12', customer: '王老板的便利店', contractValidity: 'N/A', refillType: '非打包价', amount: 1000, points: 1000, totalPoints: 1000, status: 'Success' },
  ]);

  const activePlan = useMemo(() => REFILL_PLANS.find(p => p.id === selectedPlanId) || REFILL_PLANS[1], [selectedPlanId]);
  
  // Calculate bonus: Amount * (1 + DiscountRate/100)
  // Note: Following prompt literally "活动赠送 = 充值金额 * (1+折扣率)"
  const bonusPoints = useMemo(() => {
    const discountRate = selectedCustomer?.discountRate || 0;
    return activePlan.amount * (1 + (discountRate / 100));
  }, [activePlan.amount, selectedCustomer]);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-600" />
            费用充值
          </h1>
          <p className="text-slate-500 text-sm mt-1">预存服务费用并兑换积分，用于支付工单处理及增值服务</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
           <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">当前账户余额</p>
              <p className="text-xl font-black text-slate-900 leading-none">¥ 12,450.00</p>
           </div>
           <div className="w-px h-10 bg-slate-100" />
           <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">积分余额</p>
              <p className="text-xl font-black text-indigo-600 leading-none">8,720 Pts</p>
           </div>
        </div>
      </div>

      {/* Customer Selection Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          充值主信息
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">选择客户</label>
            <select 
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">请选择客户</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">合同有效期</label>
            <div className="flex items-center gap-2 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed">
              <Calendar className="w-4 h-4" />
              <span>{selectedCustomer?.contractValidity || 'N/A'}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">充值类型</label>
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
               <button 
                 onClick={() => setRefillType('打包价')}
                 className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${refillType === '打包价' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 打包价
               </button>
               <button 
                 onClick={() => setRefillType('非打包价')}
                 className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${refillType === '非打包价' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 非打包价
               </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">客户折扣率</label>
            <div className="flex items-center gap-2 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 cursor-not-allowed">
              <Tag className="w-4 h-4" />
              <span>{selectedCustomer?.discountRate || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Refill Plans */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">选择充值方案</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REFILL_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedPlanId === plan.id 
                      ? 'border-indigo-600 bg-indigo-50/30' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  {plan.tag && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase">
                      {plan.tag}
                    </span>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl font-black text-slate-900">¥{plan.amount.toLocaleString()}</span>
                    {selectedPlanId === plan.id && <Check className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700">兑换 {plan.points.toLocaleString()} 积分</p>
                  </div>
                </button>
              ))}
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group cursor-pointer hover:bg-slate-50">
                 <p className="text-sm font-bold group-hover:text-slate-600">自定义金额</p>
                 <Plus className="w-5 h-5 mt-1" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <History className="w-5 h-5 text-slate-400" />
                   近期充值记录
                </h2>
                <button className="text-xs font-bold text-indigo-600 flex items-center gap-1">查看全部 <ChevronRight className="w-3 h-3" /></button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-slate-100">
                         <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">客户名称</th>
                         <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">合同有效期</th>
                         <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">充值类型</th>
                         <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">日期</th>
                         <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">金额</th>
                         <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">总积分</th>
                         <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">状态</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {refillHistory.map(h => (
                         <tr key={h.id} className="group">
                            <td className="py-4 text-sm font-bold text-slate-700">{h.customer}</td>
                            <td className="py-4 text-xs text-slate-500 font-mono">{h.contractValidity}</td>
                            <td className="py-4">
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${h.refillType === '打包价' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                  {h.refillType}
                               </span>
                            </td>
                            <td className="py-4 text-[10px] text-slate-400">{h.date}</td>
                            <td className="py-4 font-bold text-slate-900">¥{h.amount.toLocaleString()}</td>
                            <td className="py-4">
                               <div className="flex items-center gap-1">
                                 <span className="text-sm font-bold text-indigo-600">{h.totalPoints.toLocaleString()}</span>
                                 <span className="text-[10px] text-slate-400 font-medium">Pts</span>
                               </div>
                            </td>
                            <td className="py-4 text-right">
                               <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded leading-none">成功</span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Right: Checkout Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">结算明细</h2>
            
            <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">充值金额</span>
                  <span className="font-bold text-slate-900">¥{activePlan.amount.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">基本积分</span>
                  <span className="font-bold text-slate-900">{activePlan.points.toLocaleString()} Pts</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">活动赠送 (折扣系数)</span>
                  <span className="font-bold text-emerald-600">+{bonusPoints.toLocaleString()} Pts</span>
               </div>
               <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mt-4">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">公式说明</p>
                  <p className="text-xs text-amber-700 italic leading-relaxed">
                    活动赠送 = 充值金额 × (1 + {selectedCustomer?.discountRate || 0}%)
                  </p>
               </div>
               <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900">应付总计</span>
                  <span className="text-2xl font-black text-indigo-600">¥{activePlan.amount.toLocaleString()}</span>
               </div>
            </div>

            <div className="space-y-3 mb-8">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">支付方式</p>
               <button onClick={() => setPaymentMethod('alipay')} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${paymentMethod === 'alipay' ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-[#1677FF] rounded flex items-center justify-center text-white text-[10px] font-black">支</div>
                     <span className="text-sm font-bold text-slate-700">支付宝支付</span>
                  </div>
                  {paymentMethod === 'alipay' && <Check className="w-4 h-4 text-indigo-600" />}
               </button>
               <button onClick={() => setPaymentMethod('wechat')} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${paymentMethod === 'wechat' ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-[#07C160] rounded flex items-center justify-center text-white text-[10px] font-black">微</div>
                     <span className="text-sm font-bold text-slate-700">微信支付</span>
                  </div>
                  {paymentMethod === 'wechat' && <Check className="w-4 h-4 text-indigo-600" />}
               </button>
               <button onClick={() => setPaymentMethod('bank')} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${paymentMethod === 'bank' ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white"><CreditCard className="w-4 h-4" /></div>
                     <span className="text-sm font-bold text-slate-700">银行对公转账</span>
                  </div>
                  {paymentMethod === 'bank' && <Check className="w-4 h-4 text-indigo-600" />}
               </button>
            </div>

            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 active:translate-y-0">
               立即支付
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
               <ShieldCheck className="w-3 h-3" />
               安全支付保障中
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
