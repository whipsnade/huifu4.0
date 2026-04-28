import React, { useState } from 'react';
import { User, Complexity } from '../types';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid
} from 'recharts';
import { 
  MapPin, Star, Award, Clock, Pencil, Activity, Timer, Users, Server, Briefcase, Flag, Building, Calendar, Route, X
} from 'lucide-react';

const COMPLEXITY_HOURS: Record<string, number> = {
  [Complexity.LOW]: 1.0,
  [Complexity.MEDIUM]: 2.5,
  [Complexity.HIGH]: 5.0,
  [Complexity.CRITICAL]: 8.0
};

interface EngineerDetailViewProps {
  engineer: User;
  onEdit?: (engineer: User) => void;
}

export const EngineerDetailView: React.FC<EngineerDetailViewProps> = ({ engineer, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'work_types' | 'skills' | 'devices' | 'order_limit'>('work_types');
  const [secondaryTab, setSecondaryTab] = useState<'priority' | 'station' | 'distance' | 'hours'>('priority');
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Generate synthetic daily stats for an engineer (simulating DB aggregation)
  const getEngineerDailyStats = (engineerId: string) => {
    // In a real app, this aggregates actual WorkOrder records by date
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    return days.map((day, index) => {
      // Simulate randomness seeded by engineer ID + index
      const baseSeed = (engineerId.charCodeAt(0) + index) % 3; 
      let complexity: Complexity = Complexity.LOW;
      
      if (baseSeed === 0) complexity = Complexity.MEDIUM;
      if (baseSeed === 1) complexity = Complexity.HIGH;
      
      const hours = COMPLEXITY_HOURS[complexity];
      const totalOrders = Math.max(2, Math.round(12 / hours) + (index % 2));
      const completedOrders = Math.max(1, totalOrders - (index % 3));
      const income = completedOrders * hours * 150; // mock income
      
      return {
        day,
        hours,
        complexity,
        totalOrders,
        completedOrders,
        income
      };
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-slate-600 flex justify-between gap-4">
              <span>工时:</span> <span className="font-semibold text-indigo-600">{data.hours}h</span>
            </p>
            <p className="text-slate-600 flex justify-between gap-4">
              <span>总工单量:</span> <span className="font-semibold text-slate-800">{data.totalOrders}</span>
            </p>
            <p className="text-slate-600 flex justify-between gap-4">
              <span>当日结单量:</span> <span className="font-semibold text-emerald-600">{data.completedOrders}</span>
            </p>
            <p className="text-slate-600 flex justify-between gap-4">
              <span>工单结算收入:</span> <span className="font-semibold text-amber-600">¥{data.income}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-6">
         <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-3xl font-light text-indigo-300 border-4 border-white shadow-lg">
           {engineer.avatar ? <img src={engineer.avatar} alt="" className="w-full h-full rounded-full object-cover"/> : engineer.name.charAt(0)}
         </div>
         <div className="flex-1">
            <div className="flex justify-between items-start">
               <div>
                 <div className="flex items-center gap-3">
                   <h2 className="text-2xl font-bold text-slate-900">{engineer.name}</h2>
                   {/* Online/Offline Badge */}
                   <span 
                     className={`w-3 h-3 rounded-full ${engineer.status === 'Active' || engineer.status === 'Busy' ? 'bg-emerald-500' : 'bg-slate-300'}`} 
                     title={engineer.status === 'Active' || engineer.status === 'Busy' ? '在线' : '离线'}
                   ></span>
                   {onEdit && (
                     <button 
                       onClick={() => onEdit(engineer)}
                       className="ml-2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                       title="编辑档案"
                     >
                       <Pencil className="w-4 h-4" />
                     </button>
                   )}
                 </div>
                 <div className="flex items-center gap-2 mt-1">
               <span className="text-indigo-600 font-medium">{engineer.specialization}</span>
               {/* Individual/Vendor Badge */}
               <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                 engineer.engType === '供应商工程师' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
               }`}>
                 {engineer.engType || (engineer.company ? '供应商工程师' : '个人工程师')}
               </span>
             </div>
               </div>
               <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                 engineer.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                 engineer.status === 'Busy' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                 'bg-slate-50 text-slate-700 border-slate-200'
               }`}>
                 {engineer.status}
               </span>
            </div>
            <div className="flex gap-4 mt-4 text-sm text-slate-600">
               <div className="flex items-center gap-1">
                 <MapPin className="w-4 h-4"/> {engineer.city}
                 <button 
                   onClick={() => setIsMapOpen(true)}
                   className="ml-1 p-1 text-indigo-500 hover:bg-indigo-50 rounded transition-colors"
                   title="查看地图定位"
                 >
                   <MapPin className="w-4 h-4" />
                 </button>
               </div>
               {engineer.age && <div className="flex items-center gap-1"><Clock className="w-4 h-4"/> {engineer.age} 岁</div>}
            </div>
         </div>
      </div>

      {/* Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMapOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                {engineer.name} 的当前位置
              </h3>
              <button onClick={() => setIsMapOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-50">
              <div className="w-full h-[400px] bg-slate-200 rounded-lg border border-slate-300 flex items-center justify-center relative overflow-hidden">
                {/* Mock Map Background */}
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, #cbd5e1 2px, transparent 2px)',
                  backgroundSize: '20px 20px'
                }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-indigo-500/20 rounded-full animate-ping"></div>
                    <MapPin className="w-10 h-10 text-indigo-600 drop-shadow-md relative z-10 -mt-5" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap">
                      {engineer.city}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Workload Stats */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
           <Timer className="w-5 h-5 text-indigo-500" /> 每日工时
         </h3>
         <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={getEngineerDailyStats(engineer.id)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <RechartsTooltip 
                  cursor={{fill: '#f1f5f9'}}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="hours" fill="#818cf8" radius={[4, 4, 0, 0]} name="小时" />
             </BarChart>
           </ResponsiveContainer>
         </div>
         <div className="flex items-center gap-4 mt-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="font-semibold text-slate-700">标准:</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> 低 (1h)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> 中 (2.5h)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> 高 (5h)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> 紧急 (8h)</span>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
         <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">满意度</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-amber-900">{engineer.csat}</span>
              <div className="flex pb-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500"/></div>
            </div>
         </div>
         <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">忙碌率</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-blue-900">{engineer.busyRate}%</span>
              <Activity className="w-5 h-5 text-blue-400 mb-1.5"/>
            </div>
         </div>
         <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">级别</p>
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-emerald-900">{engineer.level}</span>
            </div>
         </div>
      </div>

      {/* Skills & Devices Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="flex border-b border-slate-200">
           <button 
             onClick={() => setActiveTab('work_types')}
             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'work_types' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
           >
             <Briefcase className="w-4 h-4" /> 工单类型
           </button>
           <button 
             onClick={() => setActiveTab('skills')}
             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'skills' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
           >
             <Award className="w-4 h-4" /> 技能 & 认证
           </button>
           <button 
             onClick={() => setActiveTab('devices')}
             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'devices' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
           >
             <Server className="w-4 h-4" /> 设备品牌/型号
           </button>
           <button 
             onClick={() => setActiveTab('order_limit')}
             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'order_limit' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
           >
             <Activity className="w-4 h-4" /> 接单上限
           </button>
         </div>
         
         <div className="p-6">
           {activeTab === 'work_types' && (
             <div className="flex flex-wrap gap-2">
               {['上门', '远程', '巡检', '安装改造'].map((type, i) => (
                 <span key={i} className={`px-3 py-1 rounded-full text-sm font-medium border ${type === '安装改造' ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                   {type}
                 </span>
               ))}
             </div>
           )}

           {activeTab === 'skills' && (
             <div className="flex flex-wrap gap-2">
               {engineer.certifications?.map((cert, i) => (
                 <span key={i} className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">
                   {cert}
                 </span>
               ))}
             </div>
           )}
           
           {activeTab === 'devices' && (
             <div className="space-y-3">
               <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="font-semibold text-slate-800 w-24">NCR</div>
                 <div className="flex flex-wrap gap-1.5 flex-1">
                   <span className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">RealPOS XR7</span>
                   <span className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">SelfServ 90</span>
                 </div>
               </div>
               <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="font-semibold text-slate-800 w-24">Toshiba</div>
                 <div className="flex flex-wrap gap-1.5 flex-1">
                   <span className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">TCx 300</span>
                   <span className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">TCx 800</span>
                 </div>
               </div>
               <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="font-semibold text-slate-800 w-24">Ingenico</div>
                 <div className="flex flex-wrap gap-1.5 flex-1">
                   <span className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">Lane/3000</span>
                   <span className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">Move/5000</span>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'order_limit' && (
             <div className="flex flex-wrap gap-2">
               <span className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">
                 5 (单/每日)
               </span>
             </div>
           )}
         </div>
      </div>

      {/* Secondary Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="flex border-b border-slate-200">
           <button 
             onClick={() => setSecondaryTab('priority')}
             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${secondaryTab === 'priority' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
           >
             <Flag className="w-4 h-4" /> 优先级
           </button>
           <button 
             onClick={() => setSecondaryTab('station')}
             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${secondaryTab === 'station' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
           >
             <Building className="w-4 h-4" /> 所属供应商
           </button>
           <button 
             onClick={() => setSecondaryTab('distance')}
             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${secondaryTab === 'distance' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
           >
             <Route className="w-4 h-4" /> 服务范围
           </button>
           <button 
             onClick={() => setSecondaryTab('hours')}
             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${secondaryTab === 'hours' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
           >
             <Calendar className="w-4 h-4" /> 工作时间
           </button>
         </div>
         
         <div className="p-6">
           {secondaryTab === 'priority' && (
             <div className="flex flex-wrap gap-2">
               {['Urget (紧急)', 'High (高)', 'Medium (中)', 'Low (低)'].map((type, i) => (
                 <span key={i} className={`px-4 py-1 text-sm rounded-full border ${type === 'Low (低)' ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                   {type}
                 </span>
               ))}
             </div>
           )}

           {secondaryTab === 'station' && (
             <div className="flex flex-wrap gap-2">
               {['北京朝阳供应商', '北京海淀供应商'].map((station, i) => (
                 <span key={i} className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">
                   {station}
                 </span>
               ))}
             </div>
           )}

           {secondaryTab === 'distance' && (
             <div className="flex flex-wrap gap-2">
               {['海淀区', '朝阳区', '东城区', '西城区'].map((dist, i) => (
                 <span key={i} className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">
                   {dist}
                 </span>
               ))}
             </div>
           )}
           
           {secondaryTab === 'hours' && (
             <div className="flex flex-wrap gap-2">
               {['周一至周五 09:00-18:00', '周末轮班'].map((hours, i) => (
                 <span key={i} className="px-4 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-full">
                   {hours}
                 </span>
               ))}
             </div>
           )}
         </div>
      </div>

      {/* Recent Customers */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
           <Users className="w-5 h-5 text-indigo-500" /> 最近客户
         </h3>
         <div className="space-y-3">
           {engineer.recentCustomers && engineer.recentCustomers.length > 0 ? (
             engineer.recentCustomers.map((customer, i) => (
               <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                 <div>
                   <p className="text-sm font-semibold text-slate-900">{customer.name}</p>
                   <p className="text-xs text-slate-500">{customer.project}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-medium text-slate-400">{customer.date}</p>
                 </div>
               </div>
             ))
           ) : (
             <p className="text-sm text-slate-400 italic">暂无近期客户记录</p>
           )}
         </div>
      </div>
    </div>
  );
};