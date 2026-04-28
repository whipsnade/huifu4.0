import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Zap, Star, Award, Search, Filter } from 'lucide-react';

interface CreditFactor {
  id: string;
  name: string;
  weight: number;
  calculationMethod: string;
}

export const ENGCreditConfigView: React.FC = () => {
  const [factors, setFactors] = useState<CreditFactor[]>([
    { id: '1', name: '工单完成数量', weight: 30, calculationMethod: '月度累计完成工单数 / 目标值' },
    { id: '2', name: '处理效率', weight: 25, calculationMethod: '平均 SLA 响应及修复时长评分' },
    { id: '3', name: '技能多样性', weight: 15, calculationMethod: '系统认证技能数量及等级评定' },
    { id: '4', name: '客户满意度', weight: 30, calculationMethod: '门店五星好评率加权计算' },
  ]);

  const handleWeightChange = (id: string, newWeight: number) => {
    setFactors(prev => prev.map(f => f.id === id ? { ...f, weight: newWeight } : f));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            工程师信用分配置
          </h1>
          <p className="text-slate-500 text-sm mt-1">综合多维度表现计算工程师信用评分，影响优先派单权及等级晋升</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            系数管理
          </button>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            应用配置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
             <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><TrendingUp className="w-5 h-5" /></div>
             <span className="text-xs font-bold text-slate-400">权重 30%</span>
          </div>
          <h3 className="text-sm font-bold text-slate-700">业务量</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">工单数量</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
             <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Zap className="w-5 h-5" /></div>
             <span className="text-xs font-bold text-slate-400">权重 25%</span>
          </div>
          <h3 className="text-sm font-bold text-slate-700">响应力</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">处理效率</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
             <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Award className="w-5 h-5" /></div>
             <span className="text-xs font-bold text-slate-400">权重 15%</span>
          </div>
          <h3 className="text-sm font-bold text-slate-700">专业度</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">技能多样性</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
             <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><Star className="w-5 h-5" /></div>
             <span className="text-xs font-bold text-slate-400">权重 30%</span>
          </div>
          <h3 className="text-sm font-bold text-slate-700">认可度</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">满意度</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">信用评估模型</h2>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="搜索配置项..." className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500" />
             </div>
             <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg"><Filter className="w-4 h-4" /></button>
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">核心评估维度</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">计算逻辑说明</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">模型权重</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">分值上限</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {factors.map((factor) => (
              <tr key={factor.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900">{factor.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {factor.calculationMethod}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-300" 
                        style={{ width: `${factor.weight}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        value={factor.weight}
                        onChange={(e) => handleWeightChange(factor.id, Number(e.target.value))}
                        className="w-12 px-1 py-0.5 border border-slate-200 rounded text-xs font-bold text-slate-700 focus:ring-1 focus:ring-indigo-500 outline-none"
                        min="0"
                        max="100"
                      />
                      <span className="text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900 uppercase">
                  100 分
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-xl">
        <h3 className="text-lg font-bold mb-4">信用分应用说明</h3>
        <ul className="space-y-3 text-indigo-100 text-sm list-disc pl-5">
           <li><strong>特权派单:</strong> 信用分高于 90 分的工程师自动列入 "快速派单" 优先名单。</li>
           <li><strong>酬金系数:</strong> 信用分持续 3 个月高于 85 分，工单基础酬金上浮 5%。</li>
           <li><strong>预警处理:</strong> 信用分低于 60 分时，系统将暂停派发高复杂度工单并触发人工教育。</li>
        </ul>
      </div>
    </div>
  );
};
