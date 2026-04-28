import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  ScatterChart, Scatter, ZAxis, Legend, ComposedChart, Bar, Line
} from 'recharts';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, DollarSign, X, BrainCircuit, BarChart3, Download } from 'lucide-react';
import { generateBiInsights, generateDeepAnalysis } from '../services/geminiService';
import { MOCK_WORK_ORDERS } from '../constants';

const KPICard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs">
      <span className="text-green-600 font-medium flex items-center">
        <TrendingUp className="w-3 h-3 mr-1" /> {change}
      </span>
      <span className="text-slate-400 ml-2">较上月</span>
    </div>
  </div>
);

// Simulated data for detailed analysis charts
const SCATTER_DATA = [
  { x: 120, y: 4.5, z: 200, name: 'HVAC 维修' }, // x: Cost, y: CSAT, z: Volume
  { x: 450, y: 4.8, z: 100, name: '液压系统' },
  { x: 80, y: 4.2, z: 300, name: '电气检查' },
  { x: 200, y: 3.9, z: 150, name: '管道疏通' },
  { x: 900, y: 4.9, z: 50, name: '机器人调试' },
  { x: 150, y: 4.0, z: 220, name: '安防维护' },
];

const TREND_DATA = [
  { name: '1月', efficiency: 85, revenue: 42000, cost: 30000 },
  { name: '2月', efficiency: 88, revenue: 45000, cost: 31000 },
  { name: '3月', efficiency: 82, revenue: 41000, cost: 34000 },
  { name: '4月', efficiency: 90, revenue: 52000, cost: 35000 },
  { name: '5月', efficiency: 92, revenue: 58000, cost: 38000 },
  { name: '6月', efficiency: 89, revenue: 56000, cost: 39000 },
];

export const DashboardView: React.FC = () => {
  const [insights, setInsights] = useState<string>('正在生成 AI 见解...');
  const [loadingInsights, setLoadingInsights] = useState(true);

  // Detail Modal States
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deepAnalysisHtml, setDeepAnalysisHtml] = useState<string>('');
  const [isGeneratingDeep, setIsGeneratingDeep] = useState(false);

  // Prepare chart data
  const data = [
    { name: '周一', orders: 12, rev: 4500 },
    { name: '周二', orders: 19, rev: 5200 },
    { name: '周三', orders: 15, rev: 4800 },
    { name: '周四', orders: 22, rev: 6100 },
    { name: '周五', orders: 28, rev: 7200 },
    { name: '周六', orders: 10, rev: 2500 },
    { name: '周日', orders: 5, rev: 1200 },
  ];

  const pieData = [
    { name: 'HVAC', value: 400 },
    { name: '液压', value: 300 },
    { name: '电气', value: 300 },
    { name: '管道', value: 200 },
  ];
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

  useEffect(() => {
    let isMounted = true;
    const fetchInsights = async () => {
      const dataContext = JSON.stringify(MOCK_WORK_ORDERS.map(w => ({
        device: w.device,
        amount: w.amount,
        status: w.status,
        complexity: w.complexity
      })));
      
      const result = await generateBiInsights(dataContext);
      if (isMounted) {
        setInsights(result);
        setLoadingInsights(false);
      }
    };
    fetchInsights();
    return () => { isMounted = false; };
  }, []);

  const handleOpenDeepAnalysis = async () => {
    setIsDetailModalOpen(true);
    if (!deepAnalysisHtml) {
      setIsGeneratingDeep(true);
      const dataContext = JSON.stringify(MOCK_WORK_ORDERS);
      const html = await generateDeepAnalysis(dataContext);
      setDeepAnalysisHtml(html);
      setIsGeneratingDeep(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">业绩概览</h1>
          <p className="text-slate-500 text-sm">实时指标与 AI 分析</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          下载报告
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="总收入" value="$45,231" change="+12.5%" icon={DollarSign} color="bg-indigo-500" />
        <KPICard title="活跃工单" value="24" change="+4.2%" icon={AlertCircle} color="bg-amber-500" />
        <KPICard title="已完成任务" value="156" change="+8.1%" icon={CheckCircle2} color="bg-emerald-500" />
        <KPICard title="平均解决时间" value="2.4 小时" change="-10%" icon={TrendingUp} color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">收入与工作量</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  cursor={{stroke: '#cbd5e1', strokeDasharray: '4 4'}}
                />
                <Area type="monotone" dataKey="rev" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="收入" />
                <Area type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} fillOpacity={0} name="工单数" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h2 className="text-lg font-bold">奇奇Vigio-智能分析</h2>
          </div>
          
          <div className="space-y-4 flex-1">
            {loadingInsights ? (
              <div className="animate-pulse space-y-2">
                <div className="h-2 bg-white/20 rounded w-3/4"></div>
                <div className="h-2 bg-white/20 rounded w-full"></div>
                <div className="h-2 bg-white/20 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="text-sm text-indigo-100 leading-relaxed whitespace-pre-line">
                {insights}
              </div>
            )}
          </div>
          <button 
            onClick={handleOpenDeepAnalysis}
            className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 rounded-lg transition-colors border border-white/20 flex items-center justify-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" /> 询问详细问题
          </button>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">故障分类</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs text-slate-500 mt-2">
               {pieData.map((entry, index) => (
                 <div key={index} className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                   {entry.name}
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* DETAILED ANALYSIS MODAL */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
             onClick={() => setIsDetailModalOpen(false)}
           />
           
           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-indigo-600 text-white">
                 <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                    <div>
                       <h2 className="text-lg font-bold">深度智能分析报告</h2>
                       <p className="text-indigo-200 text-xs">由 Gemini 3 Flash 提供支持 • 实时数据洞察</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setIsDetailModalOpen(false)}
                   className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                 >
                   <X className="w-5 h-5" />
                 </button>
              </div>

              {/* Content Grid */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    
                    {/* Left: AI Text Report */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-y-auto">
                       {isGeneratingDeep ? (
                          <div className="flex flex-col items-center justify-center h-64 space-y-4">
                             <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                             <p className="text-slate-500 font-medium">正在分析数百万个数据点...</p>
                          </div>
                       ) : (
                          <div className="prose prose-sm prose-indigo max-w-none text-slate-700">
                             <div dangerouslySetInnerHTML={{ __html: deepAnalysisHtml }} />
                          </div>
                       )}
                    </div>

                    {/* Right: Charts */}
                    <div className="space-y-6">
                       
                       {/* Chart 1: Efficiency Matrix */}
                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-80">
                          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                             <BarChart3 className="w-4 h-4 text-indigo-600" /> 服务效率矩阵 (成本 vs 满意度)
                          </h3>
                          <p className="text-xs text-slate-500 mb-4">气泡大小表示工单量。寻找高满意度且低成本的“甜蜜点”。</p>
                          <div className="flex-1">
                             <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                  <CartesianGrid />
                                  <XAxis type="number" dataKey="x" name="平均成本" unit="$" tick={{fontSize: 10}} />
                                  <YAxis type="number" dataKey="y" name="CSAT 评分" domain={[0, 5]} tick={{fontSize: 10}} />
                                  <ZAxis type="number" dataKey="z" range={[50, 400]} name="工单量" />
                                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                          <div className="bg-white p-2 border border-slate-200 shadow-lg rounded text-xs">
                                            <p className="font-bold mb-1">{data.name}</p>
                                            <p>成本: ${data.x}</p>
                                            <p>评分: {data.y}</p>
                                            <p>数量: {data.z}</p>
                                          </div>
                                        );
                                      }
                                      return null;
                                  }} />
                                  <Legend />
                                  <Scatter name="服务类别" data={SCATTER_DATA} fill="#8884d8">
                                     {SCATTER_DATA.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                     ))}
                                  </Scatter>
                                </ScatterChart>
                             </ResponsiveContainer>
                          </div>
                       </div>

                       {/* Chart 2: Monthly Trends */}
                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-80">
                          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                             <TrendingUp className="w-4 h-4 text-emerald-600" /> 财务与效率趋势 (半年)
                          </h3>
                          <div className="flex-1">
                             <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={TREND_DATA}>
                                  <CartesianGrid stroke="#f5f5f5" />
                                  <XAxis dataKey="name" scale="band" tick={{fontSize: 10}} />
                                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{fontSize: 10}} width={40} />
                                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{fontSize: 10}} width={40} domain={[0, 100]} />
                                  <Tooltip />
                                  <Legend />
                                  <Bar yAxisId="left" dataKey="revenue" name="收入 ($)" barSize={20} fill="#8884d8" />
                                  <Line yAxisId="right" type="monotone" dataKey="efficiency" name="效率指数" stroke="#82ca9d" strokeWidth={2} />
                                </ComposedChart>
                             </ResponsiveContainer>
                          </div>
                       </div>

                    </div>
                 </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-3">
                 <button 
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
                 >
                    关闭
                 </button>
                 <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 font-medium shadow-sm flex items-center gap-2">
                    <Download className="w-4 h-4" /> 导出 PDF 报告
                 </button>
              </div>

           </div>
        </div>
      )}
    </div>
  );
};