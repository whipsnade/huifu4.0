import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Calendar, Clock, Save, Check } from 'lucide-react';

interface BusynessLevel {
  id: string;
  label: string;
  threshold: number | string;
}

interface BusynessConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  levels: BusynessLevel[];
}

const INITIAL_DATA: BusynessConfig[] = [
  {
    id: 'daily',
    title: '每日工单量',
    icon: <Clock size={20} />,
    levels: [
      { id: 'd1', label: '忙', threshold: 10 },
      { id: 'd2', label: '较忙', threshold: 8 },
      { id: 'd3', label: '正常', threshold: 6 },
      { id: 'd4', label: '较闲', threshold: 4 },
      { id: 'd5', label: '空闲', threshold: 2 },
    ]
  },
  {
    id: 'weekly',
    title: '每周工单量',
    icon: <Calendar size={20} />,
    levels: [
      { id: 'w1', label: '忙', threshold: 50 },
      { id: 'w2', label: '较忙', threshold: 40 },
      { id: 'w3', label: '正常', threshold: 30 },
      { id: 'w4', label: '较闲', threshold: 20 },
      { id: 'w5', label: '空闲', threshold: 10 },
    ]
  },
  {
    id: 'monthly',
    title: '每月工单量',
    icon: <Activity size={20} />,
    levels: [
      { id: 'm1', label: '忙', threshold: 220 },
      { id: 'm2', label: '较忙', threshold: 220 },
      { id: 'm3', label: '正常', threshold: 220 },
      { id: 'm4', label: '较闲', threshold: 220 },
      { id: 'm5', label: '空闲', threshold: 220 },
    ]
  }
];

export const BusyLevelConfigView: React.FC = () => {
  const [configs, setConfigs] = useState<BusynessConfig[]>(INITIAL_DATA);
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const handleThresholdChange = (configId: string, levelId: string, value: string) => {
    setConfigs(configs.map(config => {
      if (config.id === configId) {
        return {
          ...config,
          levels: config.levels.map(level => {
            if (level.id === levelId) {
              return { ...level, threshold: value === '' ? '' : Number(value) };
            }
            return level;
          })
        };
      }
      return config;
    }));
    
    // Reset saved status when edited
    if (savedStatus[configId]) {
      setSavedStatus({ ...savedStatus, [configId]: false });
    }
  };

  const handleSave = (configId: string) => {
    // In a real app, this would make an API call
    setSavedStatus({ ...savedStatus, [configId]: true });
    
    // Reset saved status after 2 seconds
    setTimeout(() => {
      setSavedStatus(prev => ({ ...prev, [configId]: false }));
    }, 2000);
  };

  const getLevelColor = (label: string) => {
    switch (label) {
      case '忙': return 'bg-red-100 text-red-700 border-red-200';
      case '较忙': return 'bg-orange-100 text-orange-700 border-orange-200';
      case '正常': return 'bg-blue-100 text-blue-700 border-blue-200';
      case '较闲': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case '空闲': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">繁忙度设置</h1>
          <p className="text-sm text-slate-500">配置每日、每周、每月的工单量繁忙度阈值</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs.map((config) => (
          <motion.div
            key={config.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  {config.icon}
                </div>
                <h3 className="font-bold text-slate-900">{config.title}</h3>
              </div>
            </div>
            
            <div className="p-0 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3 w-1/2">繁忙度</th>
                    <th className="px-5 py-3 w-1/2">阈值 (工单量)</th>
                  </tr>
                </thead>
                <tbody>
                  {config.levels.map((level) => (
                    <tr key={level.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md border text-xs font-bold ${getLevelColor(level.label)}`}>
                          {level.label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="number"
                          value={level.threshold}
                          onChange={(e) => handleThresholdChange(config.id, level.id, e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          min="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => handleSave(config.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  savedStatus[config.id] 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {savedStatus[config.id] ? (
                  <>
                    <Check size={16} />
                    已保存
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    保存配置
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
