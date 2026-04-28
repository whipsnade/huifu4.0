import React, { useState } from 'react';
import { Star, Save, Plus, Trash2, AlertCircle } from 'lucide-react';

interface SatisfactionMetric {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export const ENGSatisfactionConfigView: React.FC = () => {
  const [metrics, setMetrics] = useState<SatisfactionMetric[]>([
    { id: '1', name: '响应速度', weight: 30, description: '工程师接单及响应的及时性' },
    { id: '2', name: '服务态度', weight: 20, description: '门店人员对工程师沟通态度的评价' },
    { id: '3', name: '技术专业度', weight: 40, description: '问题解决的专业程度及彻底性' },
    { id: '4', name: '形象礼仪', weight: 10, description: '工程师穿着、准时性等基础表现' },
  ]);

  const handleAddMetric = () => {
    const newMetric: SatisfactionMetric = {
      id: Date.now().toString(),
      name: '新评价维度',
      weight: 0,
      description: '请描述该评价维度'
    };
    setMetrics([...metrics, newMetric]);
  };

  const handleRemoveMetric = (id: string) => {
    setMetrics(metrics.filter(m => m.id !== id));
  };

  const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            工程师满意度配置
          </h1>
          <p className="text-slate-500 text-sm mt-1">设置门店对工程师的服务评价维度及权重占比</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Save className="w-4 h-4" />
          保存配置
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">工程师评价指标列表</h2>
          <button 
            onClick={handleAddMetric}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            添加维度
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">指标名称</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">权重 (%)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">说明</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.map((metric) => (
                <tr key={metric.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      value={metric.name}
                      onChange={(e) => {
                        const newMetrics = metrics.map(m => m.id === metric.id ? {...m, name: e.target.value} : m);
                        setMetrics(newMetrics);
                      }}
                      className="w-full bg-transparent border-none focus:ring-0 font-medium text-slate-900"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={metric.weight}
                        onChange={(e) => {
                          const newMetrics = metrics.map(m => m.id === metric.id ? {...m, weight: parseInt(e.target.value) || 0} : m);
                          setMetrics(newMetrics);
                        }}
                        className="w-20 px-3 py-1 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      value={metric.description}
                      onChange={(e) => {
                        const newMetrics = metrics.map(m => m.id === metric.id ? {...m, description: e.target.value} : m);
                        setMetrics(newMetrics);
                      }}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-right border-l border-transparent">
                    <button 
                      onClick={() => handleRemoveMetric(metric.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 font-medium">当前总权重:</span>
            <span className={`font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalWeight}%
            </span>
            {totalWeight !== 100 && (
              <span className="flex items-center gap-1 text-red-500 text-xs ml-2">
                <AlertCircle className="w-3 h-3" />
                总权重必须等于 100%
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400">
            满意度 = (评价维度1 × 权重1) + (评价维度2 × 权重2) + ...
          </div>
        </div>
      </div>
    </div>
  );
};
