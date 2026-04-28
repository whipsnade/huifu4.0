import React, { useState } from 'react';
import { Complexity } from '../types';
import { Calculator, AlertCircle, ChevronUp, ChevronDown, X, Info, Plus, Box } from 'lucide-react';

interface SLARule {
  id: string;
  field: string;
  tab: 'penalty' | 'reward';
  logicalOperator?: 'AND' | 'OR';
  operator: string;
  threshold: string;
  percentage: string;
}

export const INDUSTRY_PRICING_RULES: Record<string, any> = {
  '餐饮与零售': {
    expRate: 120,
    speRate: 100,
    intRate: 80,
    entRate: 60,
    emergencyFee: 150,
    complexityMultiplier: [1.0, 1.2, 1.5, 2.0],
    categoryMultiplier: [1.0, 0.8, 1.0, 1.5],
    distanceMultiplier: [1.0, 1.1, 1.2, 1.5],
  },
  'IT行业': {
    expRate: 200,
    speRate: 150,
    intRate: 120,
    entRate: 100,
    emergencyFee: 300,
    complexityMultiplier: [1.0, 1.5, 2.0, 3.0],
    categoryMultiplier: [1.0, 0.5, 1.0, 2.0],
    distanceMultiplier: [1.0, 1.2, 1.5, 2.0],
  },
  '制造业': {
    expRate: 150,
    speRate: 120,
    intRate: 100,
    entRate: 80,
    emergencyFee: 200,
    complexityMultiplier: [1.0, 1.3, 1.8, 2.5],
    categoryMultiplier: [1.0, 0.7, 1.0, 1.8],
    distanceMultiplier: [1.0, 1.1, 1.3, 1.8],
  },
  '运输业': {
    expRate: 130,
    speRate: 110,
    intRate: 90,
    entRate: 70,
    emergencyFee: 180,
    complexityMultiplier: [1.0, 1.2, 1.6, 2.2],
    categoryMultiplier: [1.0, 0.9, 1.0, 1.6],
    distanceMultiplier: [1.0, 1.2, 1.4, 1.7],
  }
};

interface PricingViewProps {
  isEmbedded?: boolean;
  isReadOnly?: boolean;
  industry?: string;
  showSection?: 'all' | 'sla' | 'engineer' | 'device';
}

export const PricingView: React.FC<PricingViewProps> = ({ 
  isEmbedded = false, 
  isReadOnly = false, 
  industry = '', 
  showSection = 'all' 
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(industry);
  const currentIndustryData = INDUSTRY_PRICING_RULES[isEmbedded ? industry : selectedIndustry] || {
    expRate: 150,
    speRate: 120,
    intRate: 100,
    entRate: 80,
    emergencyFee: 200,
    complexityMultiplier: [1.0, 1.5, 2.0, 2.5],
    categoryMultiplier: [1.0, 1.0, 1.0, 1.0],
    distanceMultiplier: [1.0, 1.1, 1.2, 1.3],
  };
  const [isEngineerPricingExpanded, setIsEngineerPricingExpanded] = useState(true);
  const [isSLAPricingExpanded, setIsSLAPricingExpanded] = useState(true);

  const [slaSettings, setSlaSettings] = useState({
    acceptTime: '',
    responseTime: '',
    arrivalTime: '',
    repairTime: '',
    stopwatchTime: ''
  });

  const [expectedSlaSettings, setExpectedSlaSettings] = useState({
    acceptTime: '',
    responseTime: '',
    arrivalTime: '',
    repairTime: '',
    stopwatchTime: ''
  });

  const [activeSlaField, setActiveSlaField] = useState<string | null>(null);
  const [penaltyRewardTab, setPenaltyRewardTab] = useState<'penalty' | 'reward'>('penalty');

  const [slaRules, setSlaRules] = useState<SLARule[]>([]);

  const [isAddingRule, setIsAddingRule] = useState(false);

  const handleAddRule = () => {
    const logicalOperatorEl = document.getElementById('newRuleLogicalOperator') as HTMLSelectElement | null;
    const operatorEl = document.getElementById('newRuleOperator') as HTMLSelectElement | null;
    const thresholdEl = document.getElementById('newRuleThreshold') as HTMLInputElement | null;
    const percentageEl = document.getElementById('newRulePercentage') as HTMLInputElement | null;
    
    if (operatorEl && thresholdEl && percentageEl && thresholdEl.value && percentageEl.value && activeSlaField) {
      const currentRules = slaRules.filter(r => r.field === activeSlaField && r.tab === penaltyRewardTab);
      const logicalOperator = currentRules.length > 0 && logicalOperatorEl ? logicalOperatorEl.value as 'AND' | 'OR' : undefined;

      setSlaRules([...slaRules, {
        id: Date.now().toString(),
        field: activeSlaField,
        tab: penaltyRewardTab,
        logicalOperator,
        operator: operatorEl.value,
        threshold: thresholdEl.value,
        percentage: percentageEl.value
      }]);
      thresholdEl.value = '';
      percentageEl.value = '';
      setIsAddingRule(false);
    }
  };

  return (
    <div className="space-y-6" key={isEmbedded ? industry : selectedIndustry}>
       {!isEmbedded && (
         <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">定价配置</h1>
            <p className="text-slate-500 text-sm">全局定价和SLA规则设置</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">默认基础定价</option>
              <option value="餐饮与零售">餐饮与零售</option>
              <option value="IT行业">IT行业</option>
              <option value="制造业">制造业</option>
              <option value="运输业">运输业</option>
            </select>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              保存更改
            </button>
          </div>
        </div>
       )}

      {/* 工程师定价配置 */}
      {(showSection === 'all' || showSection === 'engineer') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div 
            className="flex items-center justify-between cursor-pointer bg-slate-50 p-4 border-b border-slate-200"
            onClick={() => setIsEngineerPricingExpanded(!isEngineerPricingExpanded)}
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">工程师定价配置</h2>
              <p className="text-slate-500 text-xs mt-1">基础费率和复杂度乘数</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              {isEngineerPricingExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {isEngineerPricingExpanded && (
            <div className={`p-6 grid grid-cols-1 ${isEmbedded ? 'md:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-600" /> 小时费率
                </h3>
                <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">EXP收费(CNY/小时)</label>
                     <input type="number" defaultValue={currentIndustryData.expRate} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">SPE收费(CNY/小时)</label>
                     <input type="number" defaultValue={currentIndustryData.speRate} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">INT收费(CNY/小时)</label>
                     <input type="number" defaultValue={currentIndustryData.intRate} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">ENT收费(CNY/小时)</label>
                     <input type="number" defaultValue={currentIndustryData.entRate} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">紧急出勤费(CNY)</label>
                     <input type="number" defaultValue={currentIndustryData.emergencyFee} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-4">紧急度乘数</h3>
                <div className="space-y-4">
                  {[Complexity.LOW, Complexity.MEDIUM, Complexity.HIGH, Complexity.URGENT].map((level, idx) => (
                    <div key={level} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className={`text-sm font-bold ${
                          level === Complexity.URGENT ? 'text-red-600' :
                          level === Complexity.HIGH ? 'text-orange-600' : 
                          level === Complexity.MEDIUM ? 'text-blue-600' : 'text-green-600'
                      }`}>{level}</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-slate-400">乘数:</span>
                         <input 
                           type="number" 
                           step="0.1"
                           defaultValue={currentIndustryData.complexityMultiplier[idx]} 
                           className="w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-indigo-500 outline-none text-right" 
                         />
                         <span className="text-slate-500 text-sm">x</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded text-blue-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  更改乘数将立即影响所有未来生成的报价。现有工单保持不变。
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  工单分类乘数
                  <div className="relative group">
                    <Info className="w-4 h-4 text-slate-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10">
                      以下字段的乘数=不同工程师基础时薪* 复杂度+紧急出勤费
                    </div>
                  </div>
                </h3>
                <div className="space-y-4">
                  {['上门', '远程', '巡检', '安装改造'].map((type, idx) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{type}</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-slate-400">乘数:</span>
                         <input 
                           type="number" 
                           step="0.1"
                           defaultValue={currentIndustryData.categoryMultiplier[idx]} 
                           disabled={isReadOnly}
                           className={`w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-indigo-500 outline-none text-right ${isReadOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`} 
                         />
                         <span className="text-slate-500 text-sm">x</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded text-blue-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  更改乘数将立即影响所有未来生成的报价。现有工单保持不变。
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  距离乘数(KM)
                  <div className="relative group">
                    <Info className="w-4 h-4 text-slate-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10">
                      以下字段的乘数=不同工程师基础时薪* 复杂度 * 工单分类 +紧急出勤费
                    </div>
                  </div>
                </h3>
                <div className="space-y-4">
                  {['0 < X <= 5KM', '5 < X <= 10 KM', '10 < X <= 15 KM', '15 < X'].map((range, idx) => (
                    <div key={range} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{range}</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-slate-400">乘数:</span>
                         <input 
                           type="number" 
                           step="0.1"
                           defaultValue={currentIndustryData.distanceMultiplier[idx]} 
                           disabled={isReadOnly}
                           className={`w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-indigo-500 outline-none text-right ${isReadOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`} 
                         />
                         <span className="text-slate-500 text-sm">x</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded text-blue-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  更改乘数将立即影响所有未来生成的报价。现有工单保持不变。
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  技能与认证
                </h3>
                <div className="space-y-3">
                  {['CCIE', 'HCIE', 'PMP', 'ITIL', 'CISP', 'RHCE', 'VCP', 'AWS Certified Solutions Architect', 'CISA', 'CISSP'].map((cert) => (
                    <label key={cert} className={`flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 ${isReadOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-indigo-300'}`}>
                      <input 
                        type="checkbox" 
                        defaultChecked={false}
                        disabled={isReadOnly}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-bold text-slate-700">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  城市等级
                </h3>
                <div className="space-y-4">
                  {[
                    { tier: 'T1', cities: '上海、北京、深圳、广州、重庆、成都等' },
                    { tier: 'T2', cities: '武汉、西安、杭州、南京、青岛、沈阳等' },
                    { tier: 'T3', cities: '石家庄、厦门、宁波、贵阳、福州、长春等' },
                    { tier: 'T4', cities: '珠海、烟台、南通、扬州、宜宾、洛阳等' },
                    { tier: 'T5', cities: '湖州、金华、信阳、大理、玉溪、鹤岗等' }
                  ].map((item) => (
                    <div key={item.tier} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">{item.tier}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-slate-400">乘数:</span>
                           <input 
                             type="number" 
                             step="0.1"
                             defaultValue={1.0} 
                             disabled={isReadOnly}
                             className={`w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-indigo-500 outline-none text-right ${isReadOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`} 
                           />
                           <span className="text-slate-500 text-sm">x</span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">{item.cities}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SLA定价配置 */}
      {(showSection === 'all' || showSection === 'sla') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div 
            className="flex items-center justify-between cursor-pointer bg-slate-50 p-4 border-b border-slate-200"
            onClick={() => setIsSLAPricingExpanded(!isSLAPricingExpanded)}
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">SLA定价配置</h2>
            <p className="text-slate-500 text-xs mt-1">SLA相关费用及奖惩规则</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            {isSLAPricingExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isSLAPricingExpanded && (
          <div className={`p-6 grid grid-cols-1 ${isEmbedded ? '' : 'xl:grid-cols-3'} gap-6`}>
            {/* Column 1: SLA设置 */}
            <div className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm ${isEmbedded ? '' : 'xl:col-span-2'}`}>
              <h3 className="text-md font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">SLA设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side: Expected Times */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">期待时间 (不参与奖惩)</h4>
                  {[
                    { id: 'acceptTime', label: '期待接单时间(小时)' },
                    { id: 'responseTime', label: '期待响应时间(小时)' },
                    { id: 'arrivalTime', label: '期待到达时间(小时)' },
                    { id: 'repairTime', label: '期待修复时间(小时)' }
                  ].map(field => (
                    <div key={field.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                      <input 
                        type="number" 
                        step="0.5" 
                        list={`expected-${field.id}-options`}
                        value={expectedSlaSettings[field.id as keyof typeof expectedSlaSettings]} 
                        onChange={e => setExpectedSlaSettings({...expectedSlaSettings, [field.id]: e.target.value})} 
                        disabled={isReadOnly}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${isReadOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`} 
                        placeholder="0.5的倍数" 
                      />
                      <datalist id={`expected-${field.id}-options`}>
                        <option value="0.5" />
                        <option value="1.0" />
                        <option value="1.5" />
                        <option value="2.0" />
                        <option value="2.5" />
                        <option value="3.0" />
                        <option value="4.0" />
                        <option value="8.0" />
                        <option value="12.0" />
                        <option value="24.0" />
                        <option value="48.0" />
                      </datalist>
                    </div>
                  ))}
                  
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <label className="block text-sm font-medium text-slate-700 mb-1">停表时间(小时)</label>
                    <select 
                      value={expectedSlaSettings.stopwatchTime} 
                      onChange={e => setExpectedSlaSettings({...expectedSlaSettings, stopwatchTime: e.target.value})} 
                      disabled={isReadOnly}
                      className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${isReadOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                    >
                      <option value="">请选择</option>
                      <option value="更换固件(8H)">更换固件(8H)</option>
                      <option value="门店要求更换上门时间(8H)">门店要求更换上门时间(8H)</option>
                    </select>
                  </div>
                </div>

                {/* Right side: Actual Times */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">实际时间 (参与奖惩)</h4>
                  {/* Time fields that can be selected for penalty/reward */}
                  {[
                    { id: 'acceptTime', label: '实际接单时间(小时)' },
                    { id: 'responseTime', label: '实际响应时间(小时)' },
                    { id: 'arrivalTime', label: '实际到达时间(小时)' },
                    { id: 'repairTime', label: '实际修复时间(小时)' }
                  ].map(field => (
                    <div 
                      key={field.id} 
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${activeSlaField === field.id ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'}`}
                      onClick={() => setActiveSlaField(field.id)}
                    >
                      <label className="block text-sm font-medium text-slate-700 mb-1 cursor-pointer">{field.label}</label>
                      <input 
                        type="number" 
                        step="0.5" 
                        list={`actual-${field.id}-options`}
                        value={slaSettings[field.id as keyof typeof slaSettings]} 
                        onChange={e => setSlaSettings({...slaSettings, [field.id]: e.target.value})} 
                        disabled={isReadOnly}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${isReadOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`} 
                        placeholder="0.5的倍数" 
                      />
                      <datalist id={`actual-${field.id}-options`}>
                        <option value="0.5" />
                        <option value="1.0" />
                        <option value="1.5" />
                        <option value="2.0" />
                        <option value="2.5" />
                        <option value="3.0" />
                        <option value="4.0" />
                        <option value="8.0" />
                        <option value="12.0" />
                        <option value="24.0" />
                        <option value="48.0" />
                      </datalist>
                    </div>
                  ))}

                  <div 
                    className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${activeSlaField === 'stopwatchTime' ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'}`}
                    onClick={() => setActiveSlaField('stopwatchTime')}
                  >
                    <label className="block text-sm font-medium text-slate-700 mb-1 cursor-pointer">实际开表时间(小时)</label>
                    <input 
                      type="number" 
                      step="0.5" 
                      list={`actual-stopwatchTime-options`}
                      value={slaSettings.stopwatchTime} 
                      onChange={e => setSlaSettings({...slaSettings, stopwatchTime: e.target.value})} 
                      disabled={isReadOnly}
                      className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${isReadOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`} 
                      placeholder="0.5的倍数" 
                    />
                    <datalist id={`actual-stopwatchTime-options`}>
                      <option value="0.5" />
                      <option value="1.0" />
                      <option value="1.5" />
                      <option value="2.0" />
                      <option value="2.5" />
                      <option value="3.0" />
                      <option value="4.0" />
                      <option value="8.0" />
                      <option value="12.0" />
                      <option value="24.0" />
                      <option value="48.0" />
                    </datalist>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: 处罚与奖励 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-md font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                处罚与奖励
                <div className="relative group">
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10">
                    以下字段的基础费用=不同工程师基础时薪* 复杂度 * 工单分类 * 距离 +紧急出勤费
                  </div>
                </div>
              </h3>
              
              {activeSlaField ? (
                <div className="flex flex-col h-full">
                  <div className="flex border-b border-slate-200 mb-4">
                    <button 
                      className={`flex-1 py-2 text-sm font-bold text-center border-b-2 transition-colors ${penaltyRewardTab === 'penalty' ? 'border-red-500 text-red-600 bg-red-50/30' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                      onClick={() => setPenaltyRewardTab('penalty')}
                    >
                      处罚
                    </button>
                    <button 
                      className={`flex-1 py-2 text-sm font-bold text-center border-b-2 transition-colors ${penaltyRewardTab === 'reward' ? 'border-green-500 text-green-600 bg-green-50/30' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                      onClick={() => setPenaltyRewardTab('reward')}
                    >
                      奖励
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="text-sm font-medium text-slate-700 mb-3 bg-slate-50 p-2 rounded border border-slate-100">
                      针对 <span className="text-indigo-600 font-bold">{
                        activeSlaField === 'acceptTime' ? '实际接单时间' :
                        activeSlaField === 'responseTime' ? '实际响应时间' :
                        activeSlaField === 'arrivalTime' ? '实际到达时间' :
                        activeSlaField === 'repairTime' ? '实际修复时间' : '实际开表时间'
                      }</span> 的{penaltyRewardTab === 'penalty' ? '处罚' : '奖励'}设置
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Conditional Logic</span>
                      {!isReadOnly && (
                        <button onClick={() => setIsAddingRule(true)} className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors">
                          <Plus className="w-4 h-4" /> Add Rule
                        </button>
                      )}
                    </div>

                    {/* Add new rule form */}
                    {isAddingRule && (
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800"></div>
                        
                        {slaRules.filter(r => r.field === activeSlaField && r.tab === penaltyRewardTab).length > 0 && (
                          <div className="mb-4 pl-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Logical Operator</label>
                            <select id="newRuleLogicalOperator" className="w-32 px-3 py-2 bg-slate-100 border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-300">
                              <option value="AND">AND</option>
                              <option value="OR">OR</option>
                            </select>
                          </div>
                        )}

                        <div className="flex items-center gap-3 mb-4 pl-2">
                          <span className="bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded text-xs">IF</span>
                          <span className="text-sm font-medium text-slate-700 italic">
                            {activeSlaField === 'acceptTime' ? '实际接单时间(小时)' :
                             activeSlaField === 'responseTime' ? '实际响应时间(小时)' :
                             activeSlaField === 'arrivalTime' ? '实际到达时间(小时)' :
                             activeSlaField === 'repairTime' ? '实际修复时间(小时)' : '实际开表时间(小时)'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 pl-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Operator</label>
                            <select id="newRuleOperator" className="w-full px-3 py-2 bg-slate-100 border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-300">
                              <option value="is">is</option>
                              <option value=">=">&gt;=</option>
                              <option value="<=">&lt;=</option>
                              <option value="=">=</option>
                              <option value="or">or</option>
                              <option value="in">in</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Value</label>
                            <input id="newRuleThreshold" type="number" step="0.5" list="threshold-options" placeholder="e.g. 1.5" className="w-full px-3 py-2 bg-slate-100 border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-300" />
                            <datalist id="threshold-options">
                              <option value="0.5" />
                              <option value="1.0" />
                              <option value="1.5" />
                              <option value="2.0" />
                              <option value="2.5" />
                              <option value="3.0" />
                              <option value="4.0" />
                              <option value="8.0" />
                              <option value="12.0" />
                              <option value="24.0" />
                              <option value="48.0" />
                            </datalist>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pl-2 pt-4 border-t border-slate-100">
                          <span className="bg-green-50 text-green-700 font-bold px-2 py-1 rounded text-xs">THEN</span>
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm text-slate-700">基础费用{penaltyRewardTab === 'penalty' ? '扣除' : '奖励'}</span>
                            <div className="relative w-24">
                              <input id="newRulePercentage" type="number" step="0.1" min="0" className="w-full pl-2 pr-6 py-1 bg-slate-100 border-transparent rounded text-sm outline-none focus:ring-2 focus:ring-slate-300" />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">%</span>
                            </div>
                          </div>
                          <button onClick={() => setIsAddingRule(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-4 flex justify-end pl-2">
                           <button onClick={handleAddRule} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">
                             Save Rule
                           </button>
                        </div>
                      </div>
                    )}

                    {/* List of rules */}
                    <div className="space-y-3 mb-4 flex-1 overflow-y-auto min-h-[150px]">
                      {slaRules.filter(r => r.field === activeSlaField && r.tab === penaltyRewardTab).map((rule, index) => (
                        <React.Fragment key={rule.id}>
                          {index > 0 && rule.logicalOperator && (
                            <div className="flex justify-center -my-1 relative z-10">
                              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full border border-slate-200">
                                {rule.logicalOperator}
                              </span>
                            </div>
                          )}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${rule.tab === 'penalty' ? 'bg-red-400' : 'bg-green-400'}`}></div>
                            <div className="flex items-center justify-between pl-2">
                              <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-xs">IF</span>
                                <span className="italic">{
                                  rule.field === 'acceptTime' ? '实际接单时间' :
                                  rule.field === 'responseTime' ? '实际响应时间' :
                                  rule.field === 'arrivalTime' ? '实际到达时间' :
                                  rule.field === 'repairTime' ? '实际修复时间' : '实际开表时间'
                                }</span>
                                <span className="font-semibold">{rule.operator}</span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">{rule.threshold}</span>
                              </div>
                              {!isReadOnly && (
                                <button onClick={() => setSlaRules(slaRules.filter(r => r.id !== rule.id))} className="text-slate-400 hover:text-red-500">
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2 pl-2 mt-3 pt-3 border-t border-slate-50 text-sm text-slate-700">
                              <span className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded text-xs">THEN</span>
                              基础费用{rule.tab === 'penalty' ? '扣除' : '奖励'} <span className="font-bold">{rule.percentage}%</span>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                      {slaRules.filter(r => r.field === activeSlaField && r.tab === penaltyRewardTab).length === 0 && !isAddingRule && (
                        <div className="text-sm text-slate-400 text-center py-8 border border-dashed border-slate-200 rounded-lg">
                          暂无{penaltyRewardTab === 'penalty' ? '处罚' : '奖励'}规则
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-start gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded text-blue-700">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        更改乘数将立即影响所有未来生成的报价。现有工单保持不变。
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 flex flex-col items-center justify-center h-64 bg-slate-50 rounded-lg border border-dashed border-slate-300 p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                  请先在中间SLA设置区域<br/>选中一个时间字段
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      )}

      {/* 设备定价规则 Placeholder */}
      {(showSection === 'all' || showSection === 'device') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-8 text-center text-slate-500">
          <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-700 mb-2">设备定价规则</h2>
          <p>该功能正在开发中...</p>
        </div>
      )}
    </div>
  );
};
