import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ViewState, UserRole, WorkOrder, Complexity } from '../types';
import { EngineerDetailView } from './EngineerDetailView';
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line, AreaChart, Area, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis, RadialBarChart, RadialBar, LabelList
} from 'recharts';
import { 
  Download, Calendar, Filter, Activity, Store, Wrench, FileText, DollarSign, Box, Truck, Briefcase, 
  ChevronRight, ArrowLeft, Clock, MapPin, Users, CheckCircle2, AlertTriangle, TrendingUp,
  Monitor, Award, Timer, ShieldCheck, Zap, PauseCircle, AlertCircle, History, X, User, Info, BarChart3,
  Navigation, Phone, MessageSquare, Send, Paperclip, Volume2, Keyboard, Smile, Mic, PlusCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_DEVICE_ANALYTICS, MOCK_STORE_ANALYTICS, MOCK_ENGINEER_ANALYTICS, MOCK_USERS, MOCK_WORK_ORDERS, MOCK_CHAT_SESSIONS } from '../constants';

interface DataInsightsViewProps {
  view: ViewState;
  onChangeView?: (view: ViewState) => void;Requester
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#3b82f6', '#ef4444'];

// --- CUSTOM DATA FROM REPORTS ---

// PDF Data: Device Breakdown (Dec 2025)
const WO_DEVICE_DATA = [
  { name: 'POS机', value: 51, color: '#6366f1' },
  { name: 'KDS', value: 46, color: '#ec4899' },
  { name: '路由器', value: 32, color: '#ef4444' },
  { name: '打印机', value: 18, color: '#f59e0b' },
  { name: '电子餐牌', value: 13, color: '#8b5cf6' },
  { name: '考勤设备', value: 13, color: '#14b8a6' },
  { name: '收银设备', value: 12, color: '#3b82f6' },
  { name: '外卖设备', value: 7, color: '#64748b' },
  { name: '发票机', value: 5, color: '#94a3b8' },
];

// PDF Data: Regional Breakdown with SLA Dimensions (Stacked)
const WO_REGION_STACKED_DATA = [
  { name: '广州区', normal: 46, atRisk: 12, overdue: 8, total: 66 },
  { name: '中江区', normal: 37, atRisk: 8, overdue: 5, total: 50 },
  { name: '澳珠区', normal: 35, atRisk: 7, overdue: 5, total: 47 },
  { name: '佛肇区', normal: 20, atRisk: 4, overdue: 2, total: 26 },
  { name: '深圳区', normal: 10, atRisk: 3, overdue: 2, total: 15 },
];

// Excel Data: Stopped/Overdue Tickets (The "Attention Items")
const STOPPED_TICKETS = [
  { id: 'PSH0292511003S-M1', region: '南京', engineer: 'Li Jianguo', store: '南京新街口店', device: 'POS机', reason: '停表中 - 等待备件 (SLA 1.15)', status: 'STOPPED' },
  { id: 'HZ30152512004S-M1', region: '杭州', engineer: '彭磊', store: '杭州西湖店', device: 'KDS', reason: '停表中 - 门店装修 (SLA 0.08)', status: 'STOPPED' },
  { id: 'NJ18552512001S-M1', region: '南京', engineer: '杨志强', store: '南京鼓楼店', device: '路由器', reason: '停表中 - 运营商故障 (SLA 0.04)', status: 'STOPPED' },
  { id: 'HZ23272512002S-M1', region: '杭州', engineer: '彭磊', store: '杭州滨江店', device: '打印机', reason: '停表中 - 报价审批 (SLA 0.02)', status: 'STOPPED' },
  { id: 'HZ12802601001S-M1', region: '杭州', engineer: '孙木震', store: '杭州萧山店', device: 'KDS', reason: '停表审核中 - 第三方介入 (SLA 0.01)', status: 'AUDIT' },
  { id: 'PS14452601004S-M1', region: '华东', engineer: '高勇', store: '上海虹桥店', device: '电子餐牌', reason: '停表中 - 软件升级 (SLA 0.03)', status: 'STOPPED' },
  { id: 'PSH5422512001S-M1', region: '南京', engineer: '刘振杨', store: '南京南站店', device: '服务器', reason: '保外VM审核中 (SLA 0.01)', status: 'AUDIT' },
];

// PDF Data: Problem Stores
const HIGH_FAULT_STORES = [
  { region: '珠海区', store: 'FZH11-珠海斗门大信', count: 8, devices: '考勤设备、监控音响、备餐设备、收银设备', notes: '辅材损坏导致故障，水晶头老化' },
  { region: '广州区', store: 'FGZ32-广州番禺祈福', count: 6, devices: '收银设备、外卖设备', notes: '软件故障，后台调试后恢复' },
  { region: '佛山区', store: 'FFS31-佛山南海季华东路', count: 5, devices: '世通主机、备餐屏幕、收银机', notes: '辅料故障居多，重打水晶头后正常' },
];

// --- VENDOR ANALYTICS DATA ---
const VENDOR_KPI_DATA = [
  { label: '供应商接单量', value: '1,284', trend: '+12%', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: '工单完成量', value: '1,156', trend: '+8.5%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'SLA 达成率', value: '98.2%', trend: '达标', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: '平均响应时长', value: '14分', trend: '效率提升', icon: Timer, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: '平均结案时长', value: '4.2小时', trend: '稳定', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const VENDOR_ORDER_TYPE_DATA = [
  { name: '上门', value: 45, color: '#6366f1' },
  { name: '巡检', value: 25, color: '#ec4899' },
  { name: '安装', value: 15, color: '#f59e0b' },
  { name: '远程', value: 10, color: '#10b981' },
];

const VENDOR_EQUIPMENT_TYPE_DATA = [
  { name: '网络设备', value: 40, color: '#6366f1' },
  { name: '服务器', value: 30, color: '#ec4899' },
  { name: '存储设备', value: 20, color: '#f59e0b' },
  { name: '安全设备', value: 10, color: '#10b981' },
];

const VENDOR_PRIORITY_DATA = [
  { name: 'Urgent', value: 10, color: '#ef4444' },
  { name: 'High', value: 25, color: '#f97316' },
  { name: 'Medium', value: 40, color: '#f59e0b' },
  { name: 'Low', value: 25, color: '#10b981' },
];

const VENDOR_SLA_PERFORMANCE = [
  { name: '供应商 C', rate: 98.5 },
  { name: '供应商 E', rate: 96.2 },
  { name: '供应商 A', rate: 94.8 },
  { name: '供应商 G', rate: 93.5 },
  { name: '供应商 J', rate: 92.1 },
  { name: '供应商 B', rate: 91.5 },
  { name: '供应商 F', rate: 90.8 },
  { name: '供应商 I', rate: 89.4 },
  { name: '供应商 H', rate: 88.2 },
  { name: '供应商 D', rate: 87.5 },
];

const VENDOR_ENGINEER_BUSY_TREND = [
  { name: '08:00', rate: 25, total: 40, risk: 5, overdue: 2 },
  { name: '10:00', rate: 65, total: 85, risk: 15, overdue: 8 },
  { name: '12:00', rate: 45, total: 60, risk: 10, overdue: 5 },
  { name: '14:00', rate: 88, total: 110, risk: 25, overdue: 12 },
  { name: '16:00', rate: 72, total: 95, risk: 18, overdue: 10 },
  { name: '18:00', rate: 35, total: 50, risk: 8, overdue: 4 },
  { name: '20:00', rate: 15, total: 20, risk: 3, overdue: 1 },
];

const VENDOR_ATTENTION_ITEMS = [
  { id: 'VND-WO-001', vendor: '供应商 A', engineer: '张三', device: 'POS机', reason: '备件短缺', status: 'STOPPED', sla: '1.5h' },
  { id: 'VND-WO-002', vendor: '供应商 B', engineer: '李四', device: '打印机', reason: '技术疑难', status: 'AUDIT', sla: '0.5h' },
  { id: 'VND-WO-003', vendor: '供应商 A', engineer: '王五', device: '路由器', reason: '等待客户确认', status: 'STOPPED', sla: '2.0h' },
  { id: 'VND-WO-004', vendor: '供应商 C', engineer: '赵六', device: 'KDS', reason: '环境受限', status: 'STOPPED', sla: '0.8h' },
];

export const DataInsightsView: React.FC<DataInsightsViewProps> = ({ view, onChangeView }) => {
  // Navigation State for Drill-downs
  const [drillDownId, setDrillDownId] = useState<string | null>(null);
  const [drillDownType, setDrillDownType] = useState<'DEVICE' | 'STORE' | 'ENGINEER' | null>(null);

  // Work Order Specific Filter & Drilldown State
  const [woFilter, setWoFilter] = useState<{ type: 'DEVICE' | 'REGION' | 'STATUS' | 'SLA_REGION'; value: string; subValue?: string } | null>(null);
  const [selectedDetailWo, setSelectedDetailWo] = useState<any | null>(null);

  // Chat State inside Detail Modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pause Approval State
  const [approvalStatus, setApprovalStatus] = useState<'通过' | '拒绝' | null>(null);
  const [approvalRemark, setApprovalRemark] = useState('');
  const [approvalReason, setApprovalReason] = useState('更换固件(8H)');
  const [expectedResumeTime, setExpectedResumeTime] = useState('2026-04-07T18:00');

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

  // Get chat session for this work order
  const chatSession = useMemo(() => {
    if (!selectedDetailWo) return null;
    return MOCK_CHAT_SESSIONS.find(s => s.workOrderId === selectedDetailWo.id) || null;
  }, [selectedDetailWo, isChatOpen]); // Re-evaluate when chat opens

  // Close chat and reset state when closing modal
  useEffect(() => {
    if (!selectedDetailWo) {
        setIsChatOpen(false);
        setApprovalStatus(null);
        setApprovalRemark('');
        setApprovalReason('更换固件(8H)');
        setExpectedResumeTime('2026-04-07T18:00');
    }
  }, [selectedDetailWo]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSession?.messages, isChatOpen]);

  const handleSendMessage = (type: string = 'text', content?: string) => {
    if (type === 'text' && !chatMessage.trim()) return;
    
    if (chatSession) {
      const newMessage = {
        id: `m${Date.now()}`,
        senderId: 'admin',
        senderName: 'Admin',
        senderRole: UserRole.ADMIN,
        content: content || chatMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: type as any
      };
      chatSession.messages.push(newMessage);
      chatSession.lastMessage = content || chatMessage;
      chatSession.lastMessageTime = newMessage.timestamp;
    }
    
    setChatMessage('');
    setIsEmojiPickerOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSendMessage('file', file.name);
    }
  };

  // Trend Chart State
  const [trendFilters, setTrendFilters] = useState({
    range: '30D',
    region: 'All',
    device: 'All',
    fault: 'All'
  });

  // Tabs for sub-views
  const [activeTab, setActiveTab] = useState('Device');
  const [selectedVendor, setSelectedVendor] = useState('All');

  const VENDORS_LIST = ['供应商 A', '供应商 B', '供应商 C', '供应商 D', '供应商 E', '供应商 F', '供应商 G', '供应商 H', '供应商 I', '供应商 J'];

  const handleBack = () => {
    setDrillDownId(null);
    setDrillDownType(null);
    setWoFilter(null);
  };
  const getEngineerPhone = (name: string) => {
      const eng = MOCK_USERS.find(u => u.name === name);
      return eng?.phoneNumber || '+86 138-0000-0000';
  };

  // Generate Trend Data based on filters
  const trendData = useMemo(() => {
    const days = trendFilters.range === '7D' ? 7 : 30;
    const data = [];
    const now = new Date();
    
    // Simulate data generation
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      
      // Base volume randomization with filter impact
      let baseVolume = Math.floor(Math.random() * 15) + 10;
      if (trendFilters.region !== 'All') baseVolume = Math.max(2, Math.floor(baseVolume * 0.4));
      if (trendFilters.device !== 'All') baseVolume = Math.max(1, Math.floor(baseVolume * 0.3));
      
      // Simulate weekends having fewer orders
      if (d.getDay() === 0 || d.getDay() === 6) baseVolume = Math.floor(baseVolume * 0.5);

      // SLA Logic simulation
      const overdueRatio = 0.1 + (Math.random() * 0.1); // 10-20%
      const atRiskRatio = 0.15 + (Math.random() * 0.1); // 15-25%
      
      const overdue = Math.floor(baseVolume * overdueRatio);
      const atRisk = Math.floor(baseVolume * atRiskRatio);
      const normal = baseVolume - overdue - atRisk;

      data.push({
        name: dateStr,
        total: baseVolume,
        overdue: overdue,
        atRisk: atRisk,
        normal: Math.max(0, normal)
      });
    }
    return data;
  }, [trendFilters]);

  // Helper to generate mock list based on filter
  const getFilteredWorkOrders = () => {
    if (!woFilter) return [];
    
    // Start with real mocks
    let base = [...MOCK_WORK_ORDERS];
    
    // Add the stopped tickets to the pool for better population
    const stoppedAsWo = STOPPED_TICKETS.map(t => ({
        id: t.id,
        title: `${t.device} 故障 - ${t.reason}`,
        customer: t.store, // mapping store to customer/location loosely
        storeName: t.store,
        engineer: t.engineer,
        device: t.device,
        status: t.status === 'STOPPED' ? 'Pending' : 'In Progress',
        date: '2025-12-15',
        amount: 0,
        complexity: 'High' as Complexity,
        slaStatus: 'Overdue' // Mock property
    }));
    
    // Generate some synthetic ones to fill the list if needed
    const synthetic = Array.from({ length: 15 }).map((_, i) => {
        let status = 'In Progress';
        let slaStatus = 'Normal';
        
        // Manipulate synthetic data based on filter to ensure we show relevant data
        if (woFilter.subValue === 'overdue') slaStatus = 'Overdue';
        if (woFilter.subValue === 'atRisk') slaStatus = 'At Risk';
        if (woFilter.type === 'STATUS' && woFilter.value === 'Pending') status = 'Pending';

        return {
            id: `WO-SY-${2000+i}`,
            title: `${woFilter.value} 常规维护`,
            customer: `连锁餐饮 ${String.fromCharCode(65 + (i % 5))}`,
            storeName: `${woFilter.value.includes('区') ? woFilter.value.slice(0,2) : '分'}店 ${i+1}`,
            engineer: MOCK_USERS.find(u => u.role === UserRole.ENGINEER)?.name || '工程师',
            device: woFilter.type === 'DEVICE' ? woFilter.value : '通用设备',
            status: status,
            date: slaStatus === 'Overdue' ? '2025-12-10' : (slaStatus === 'At Risk' ? '2025-12-15 10:00' : '2025-12-16'),
            amount: 300 + i * 50,
            complexity: i % 3 === 0 ? 'Low' as Complexity : 'Medium' as Complexity,
            slaStatus: slaStatus
        }
    });

    let combined = [...base, ...stoppedAsWo, ...synthetic];

    return combined.filter(wo => {
        if (woFilter.type === 'DEVICE') {
            return wo.device.includes(woFilter.value) || woFilter.value === '全部';
        }
        if (woFilter.type === 'REGION') {
            if (woFilter.value === '广州区') return (wo.storeName && (wo.storeName.includes('广州') || wo.storeName.includes('FGZ'))) || Math.random() > 0.5;
            return true;
        }
        if (woFilter.type === 'SLA_REGION') {
            // Filter by Region (loose match) AND SLA Status
            const regionMatch = (wo.storeName && wo.storeName.includes(woFilter.value.slice(0,2))) || true; // loose for demo
            
            // Strict match on synthetic property for demo purpose
            // In real app, this checks logic like (dueDate < now)
            const ticket = wo as any;
            const slaMatch = ticket.slaStatus ? (
                woFilter.subValue === 'overdue' ? ticket.slaStatus === 'Overdue' :
                woFilter.subValue === 'atRisk' ? ticket.slaStatus === 'At Risk' :
                ticket.slaStatus === 'Normal'
            ) : true;

            return regionMatch && slaMatch;
        }
        if (woFilter.type === 'STATUS') {
            return wo.status === woFilter.value;
        }
        return true;
    });
  };

  // --- 1. DEVICE PROFILE ---
  const renderDeviceAnalytics = () => {
    if (drillDownId && drillDownType === 'DEVICE') {
      const details = MOCK_DEVICE_ANALYTICS.drillDown['POS机'] || MOCK_DEVICE_ANALYTICS.drillDown['POS机']; // Fallback for demo
      
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
           <button onClick={handleBack} className="flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
             <ArrowLeft className="w-4 h-4 mr-1"/> 返回概览
           </button>
           
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Monitor className="w-8 h-8 text-indigo-600"/> {drillDownId}
                </h2>
                <p className="text-slate-500 text-sm mt-1">品牌、故障和生命周期分析的详细细分。</p>
              </div>
              <div className="flex gap-4">
                 <div className="px-4 py-2 bg-green-50 rounded-lg text-center">
                    <p className="text-xs font-bold text-green-600 uppercase">健康评分</p>
                    <p className="text-2xl font-bold text-green-700">88/100</p>
                 </div>
                 <div className="px-4 py-2 bg-blue-50 rounded-lg text-center">
                    <p className="text-xs font-bold text-blue-600 uppercase">预计寿命</p>
                    <p className="text-2xl font-bold text-blue-700">5 年</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Repair Counts */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-4">按品牌维修次数</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={details.brands} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                       <XAxis type="number"/>
                       <YAxis dataKey="name" type="category" width={80}/>
                       <Tooltip cursor={{fill: '#f1f5f9'}}/>
                       <Bar dataKey="repairs" fill="#6366f1" radius={[0,4,4,0]} barSize={20} name="维修次数"/>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              {/* Fault Categories */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-4">主要故障类别</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={details.faults} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="count" paddingAngle={5}>
                         {details.faults.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                       </Pie>
                       <Tooltip />
                       <Legend layout="vertical" verticalAlign="middle" align="right"/>
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              {/* Lifecycle Prediction */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500"/> 生命周期故障概率 (按品牌)
                 </h3>
                 <div className="h-72">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={details.lifecycle}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                         <XAxis dataKey="year" label={{ value: '服役年限', position: 'insideBottom', offset: -5 }} tick={{fontSize: 12}} />
                         <YAxis unit="%" label={{ value: '故障率', angle: -90, position: 'insideLeft' }} tick={{fontSize: 12}} />
                         <Tooltip 
                            contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                         />
                         <Legend verticalAlign="top" height={36}/>
                         {details.brands.map((brand: any, index: number) => (
                           <Line 
                             key={brand.name}
                             type="monotone" 
                             dataKey={brand.name} 
                             stroke={COLORS[index % COLORS.length]} 
                             strokeWidth={2}
                             dot={{r: 3}}
                           />
                         ))}
                      </LineChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-3">
                    <Zap className="w-5 h-5 text-indigo-600"/>
                    <p className="text-sm text-indigo-900">
                      <strong>品牌洞察：</strong> <span className="font-semibold text-indigo-700">Toshiba</span> 表现出卓越的耐用性，第3年的故障概率仅为12%，显著优于 HP (18%)。
                    </p>
                 </div>
              </div>
           </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
         {/* Top Level Metrics */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_DEVICE_ANALYTICS.overview.map((d, i) => (
              <div 
                key={i} 
                onClick={() => { setDrillDownId(d.name); setDrillDownType('DEVICE'); }}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 cursor-pointer transition-all group"
              >
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600">{d.name}</h3>
                    <Monitor className="w-5 h-5 text-slate-400 group-hover:text-indigo-600"/>
                 </div>
                 <div className="space-y-1">
                    <p className="text-2xl font-bold text-slate-800">{d.count} <span className="text-xs font-normal text-slate-500">次维修</span></p>
                    <p className="text-xs text-slate-500">预期寿命：<strong>{d.avgLifeExp} 年</strong></p>
                 </div>
              </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4">按设备类型总维修数</h3>
               <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={MOCK_DEVICE_ANALYTICS.overview}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip cursor={{fill: '#f1f5f9'}}/>
                        <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} name="总维修数" />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4">预期寿命比较</h3>
               <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={MOCK_DEVICE_ANALYTICS.overview} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100}/>
                        <Tooltip cursor={{fill: '#f1f5f9'}}/>
                        <Bar dataKey="avgLifeExp" fill="#10b981" radius={[0,4,4,0]} name="平均年限" barSize={24} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>
    );
  };

  // --- 2. STORE PROFILE ---
  const renderStoreAnalytics = () => {
    if (drillDownId && drillDownType === 'STORE') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
           <button onClick={handleBack} className="flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
             <ArrowLeft className="w-4 h-4 mr-1"/> 返回概览
           </button>
           
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                       <Store className="w-8 h-8 text-indigo-600"/>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{drillDownId}</h2>
                      <p className="text-slate-500 text-sm">市中心 • ST-001 • 黄金级</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-slate-400"/> 员工</h3>
                 <div className="space-y-2">
                    {MOCK_USERS.filter(u => u.role === 'ENGINEER').slice(0,3).map(u => (
                       <div key={u.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">{u.name.charAt(0)}</div>
                             <span className="text-sm font-medium">{u.name}</span>
                          </div>
                          <span className="text-xs text-slate-500">{u.specialization}</span>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Monitor className="w-5 h-5 text-slate-400"/> 设备</h3>
                 <div className="space-y-2">
                    {['POS机', 'KDS屏幕', '热敏打印机'].map((d, i) => (
                       <div key={i} className="flex items-center justify-between p-2 border-b border-slate-50 last:border-0">
                          <span className="text-sm text-slate-700">{d}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">运行中</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      );
    }

    return (
       <div className="space-y-6">
          {/* Top 3 Panels for Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Avg Completion Time */}
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-slate-700 text-sm">平均完成时间</h3>
                   <Clock className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-4">{MOCK_STORE_ANALYTICS.stats.completionTime.avg}</div>
                <div className="flex-1 space-y-2 mt-auto">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">前 3 名最快门店</p>
                   {MOCK_STORE_ANALYTICS.stats.completionTime.top3.map((s, i) => (
                      <div key={i} className="flex justify-between text-xs bg-indigo-50 p-2 rounded text-indigo-900 cursor-pointer hover:bg-indigo-100" onClick={() => { setDrillDownId(s.name); setDrillDownType('STORE'); }}>
                         <span className="font-medium">{i+1}. {s.name}</span>
                         <span className="font-bold">{s.val}</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Avg Arrival Time */}
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-slate-700 text-sm">平均到达时间</h3>
                   <Truck className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-4">{MOCK_STORE_ANALYTICS.stats.arrivalTime.avg}</div>
                <div className="flex-1 space-y-2 mt-auto">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">前 3 名最快响应</p>
                   {MOCK_STORE_ANALYTICS.stats.arrivalTime.top3.map((s, i) => (
                      <div key={i} className="flex justify-between text-xs bg-emerald-50 p-2 rounded text-emerald-900 cursor-pointer hover:bg-emerald-100" onClick={() => { setDrillDownId(s.name); setDrillDownType('STORE'); }}>
                         <span className="font-medium">{i+1}. {s.name}</span>
                         <span className="font-bold">{s.val}</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Avg Handling Time */}
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-slate-700 text-sm">平均处理时间</h3>
                   <Wrench className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-4">{MOCK_STORE_ANALYTICS.stats.handlingTime.avg}</div>
                <div className="flex-1 space-y-2 mt-auto">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">前 3 名最高效</p>
                   {MOCK_STORE_ANALYTICS.stats.handlingTime.top3.map((s, i) => (
                      <div key={i} className="flex justify-between text-xs bg-amber-50 p-2 rounded text-amber-900 cursor-pointer hover:bg-amber-100" onClick={() => { setDrillDownId(s.name); setDrillDownType('STORE'); }}>
                         <span className="font-medium">{i+1}. {s.name}</span>
                         <span className="font-bold">{s.val}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">按区域维修次数</h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={MOCK_STORE_ANALYTICS.regional} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="repairs" paddingAngle={5}>
                            {MOCK_STORE_ANALYTICS.regional.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                         </Pie>
                         <Legend verticalAlign="middle" align="right" layout="vertical"/>
                         <Tooltip />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">按门店等级维修次数</h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MOCK_STORE_ANALYTICS.byLevel} layout="vertical">
                         <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                         <XAxis type="number"/>
                         <YAxis dataKey="name" type="category" width={80}/>
                         <Tooltip cursor={{fill: '#f1f5f9'}}/>
                         <Bar dataKey="repairs" fill="#8b5cf6" radius={[0,4,4,0]} barSize={20} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* Breakdowns */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex gap-4 border-b border-slate-100 mb-4">
                {['设备', '品牌', '故障'].map((t, i) => {
                   const key = ['Device', 'Brand', 'Fault'][i]; // Use English keys for state logic
                   return (
                     <button 
                       key={key}
                       onClick={() => setActiveTab(key)}
                       className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
                     >
                       按{t}
                     </button>
                   );
                })}
             </div>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={
                      activeTab === 'Device' ? MOCK_STORE_ANALYTICS.breakdowns.device : 
                      activeTab === 'Brand' ? MOCK_STORE_ANALYTICS.breakdowns.brand : 
                      MOCK_STORE_ANALYTICS.breakdowns.fault
                   }>
                      <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                      <XAxis dataKey="name"/>
                      <YAxis />
                      <Tooltip cursor={{fill: '#f1f5f9'}}/>
                      <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} barSize={40} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
    );
  };

  // --- 3. ENGINEER PROFILE ---
  const renderEngineerAnalytics = () => {
     if (drillDownId && drillDownType === 'ENGINEER') {
        const engineer = MOCK_USERS.find(u => u.name === drillDownId && u.role === UserRole.ENGINEER);
        
        return (
           <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
               <button onClick={handleBack} className="flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                 <ArrowLeft className="w-4 h-4 mr-1"/> 返回概览
               </button>
               
               {engineer ? (
                 <EngineerDetailView engineer={engineer} />
               ) : (
                 <div className="text-center p-8 text-slate-400">
                    <p>未找到该工程师的详细信息。</p>
                 </div>
               )}
           </div>
        )
     }

     return (
       <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Busy Rate Heatmap/Chart with Top 3 List */}
             <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-slate-900">人力忙碌率</h3>
                   <div className="flex gap-2">
                      <select className="text-xs border border-slate-200 rounded p-1"><option>按时间</option><option>按级别</option><option>按区域</option></select>
                   </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                   <div className="flex-1 h-72">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={MOCK_ENGINEER_ANALYTICS.busyRate}>
                            <defs>
                               <linearGradient id="colorBusy" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="time"/>
                            <YAxis unit="%"/>
                            <Tooltip />
                            <Area type="monotone" dataKey="rate" stroke="#ef4444" fill="url(#colorBusy)" name="忙碌率"/>
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                   
                   {/* Top 3 Busiest Engineers */}
                   <div className="w-full lg:w-48 border-l border-slate-100 pl-6 flex flex-col justify-center space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">最忙碌</h4>
                        {MOCK_ENGINEER_ANALYTICS.mostBusy.map((e, i) => (
                            <div key={i} className="cursor-pointer group" onClick={() => { setDrillDownId(e.name); setDrillDownType('ENGINEER'); }}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-700 text-sm group-hover:text-indigo-600">{e.name}</span>
                                    <span className="text-xs font-bold text-red-500">{e.rate}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{width: `${e.rate}%`}}></div>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 truncate">{e.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
             </div>

             {/* Top Performers (Total Orders) */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-500"/> 总工单</h3>
                <div className="flex-1 space-y-3">
                   {MOCK_ENGINEER_ANALYTICS.performance.totalOrders.top3.map((e, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer" onClick={() => { setDrillDownId(e.name); setDrillDownType('ENGINEER'); }}>
                         <div className="flex items-center gap-3">
                            <span className="font-bold text-indigo-600 text-sm">#{i+1}</span>
                            <span className="text-sm font-medium text-slate-800">{e.name}</span>
                         </div>
                         <span className="font-bold text-slate-900">{e.val}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Avg Completion */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> 平均完成</h3>
                <div className="space-y-3">
                   {MOCK_ENGINEER_ANALYTICS.performance.avgCompletion.top3.map((e, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50" onClick={() => { setDrillDownId(e.name); setDrillDownType('ENGINEER'); }}>
                         <span className="text-sm text-slate-700">{i+1}. {e.name}</span>
                         <span className="font-bold text-green-600">{e.val}</span>
                      </div>
                   ))}
                </div>
              </div>

              {/* Avg Handling */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Wrench className="w-5 h-5 text-amber-500"/> 平均处理</h3>
                <div className="space-y-3">
                   {MOCK_ENGINEER_ANALYTICS.performance.avgHandling.top3.map((e, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50" onClick={() => { setDrillDownId(e.name); setDrillDownType('ENGINEER'); }}>
                         <span className="text-sm text-slate-700">{i+1}. {e.name}</span>
                         <span className="font-bold text-amber-600">{e.val}</span>
                      </div>
                   ))}
                </div>
              </div>

              {/* Avg Arrival */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-blue-500"/> 平均到达</h3>
                <div className="space-y-3">
                   {MOCK_ENGINEER_ANALYTICS.performance.avgArrival.top3.map((e, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50" onClick={() => { setDrillDownId(e.name); setDrillDownType('ENGINEER'); }}>
                         <span className="text-sm text-slate-700">{i+1}. {e.name}</span>
                         <span className="font-bold text-blue-600">{e.val}</span>
                      </div>
                   ))}
                </div>
              </div>
          </div>
       </div>
     );
  };

  // --- 4. WORK ORDER ANALYTICS (CUSTOM IMPL) ---
  const renderWorkOrderAnalytics = () => {
     if (woFilter) {
        // --- FILTERED WORK ORDER LIST VIEW ---
        const filteredList = getFilteredWorkOrders();
        
        return (
           <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between">
                 <button onClick={() => setWoFilter(null)} className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                   <ArrowLeft className="w-4 h-4 mr-1"/> 返回仪表盘
                 </button>
                 <div className="flex items-baseline gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                        工单列表: <span className="text-indigo-600">{woFilter.value}</span>
                    </h2>
                    {woFilter.subValue && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            woFilter.subValue === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' :
                            woFilter.subValue === 'atRisk' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            'bg-green-50 text-green-700 border-green-200'
                        }`}>
                            {woFilter.subValue === 'overdue' ? '已超期' : woFilter.subValue === 'atRisk' ? '即将超期' : '未超期'}
                        </span>
                    )}
                 </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                          <tr>
                             <th className="px-6 py-4">工单 ID / 标题</th>
                             <th className="px-6 py-4">门店 / 客户</th>
                             <th className="px-6 py-4">设备</th>
                             <th className="px-6 py-4">工程师</th>
                             <th className="px-6 py-4">日期 / SLA</th>
                             <th className="px-6 py-4">状态</th>
                             <th className="px-6 py-4 text-right">金额</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 text-sm">
                          {filteredList.map((wo: any, i) => (
                             <tr 
                               key={i} 
                               className={`transition-colors cursor-pointer ${
                                 wo.slaStatus === 'Overdue' ? 'bg-red-50 hover:bg-red-100' :
                                 wo.slaStatus === 'At Risk' ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-slate-50'
                               }`}
                               onClick={() => setSelectedDetailWo(wo)}
                             >
                                <td className="px-6 py-4">
                                   <div className="font-bold text-slate-900">{wo.id}</div>
                                   <div className="text-xs text-slate-500">{wo.title}</div>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="text-slate-900">{wo.storeName || 'N/A'}</div>
                                   <div className="text-xs text-slate-500">{wo.customer}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{wo.device}</td>
                                <td className="px-6 py-4 text-slate-600">{wo.engineer}</td>
                                <td className="px-6 py-4">
                                   <div className="text-slate-500">{wo.date}</div>
                                   {wo.slaStatus === 'Overdue' && <span className="text-[10px] text-red-600 font-bold">已超期</span>}
                                   {wo.slaStatus === 'At Risk' && <span className="text-[10px] text-orange-600 font-bold">2小时内</span>}
                                </td>
                                <td className="px-6 py-4">
                                   <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      wo.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                      wo.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                      wo.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                                   }`}>
                                      {wo.status}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-900">${wo.amount}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        );
     }

     // --- DEFAULT DASHBOARD ---
     return (
        <div className="space-y-6">
           {/* Top KPIs from Report */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-8 -mt-8"></div>
                 <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">总报修量 (月)</p>
                    <h3 className="text-3xl font-extrabold text-slate-900">204</h3>
                 </div>
                 <div className="mt-4 flex items-center gap-2 text-xs text-green-600 font-medium">
                    <TrendingUp className="w-3 h-3"/> 较上月 +15%
                 </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                 <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">响应/完成率</p>
                    <div className="flex items-baseline gap-1">
                       <h3 className="text-3xl font-extrabold text-slate-900">100%</h3>
                       <span className="text-sm text-slate-400">达标</span>
                    </div>
                 </div>
                 <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full"></div>
                 </div>
              </div>

              <div 
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setWoFilter({ type: 'STATUS', value: 'Pending' })}
              >
                 <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">停表/审核中</p>
                    <h3 className="text-3xl font-extrabold text-amber-600">{STOPPED_TICKETS.length}</h3>
                 </div>
                 <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <PauseCircle className="w-3 h-3 text-amber-500"/> 点击查看详情
                 </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                 <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">平均解决时长</p>
                    <h3 className="text-3xl font-extrabold text-slate-900">1<span className="text-lg text-slate-500">时</span>04<span className="text-lg text-slate-500">分</span></h3>
                 </div>
                 <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 font-medium">
                    <Timer className="w-3 h-3"/> 效率提升
                 </div>
              </div>
           </div>

           {/* Charts Row */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Device Category Pie */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center justify-between">
                    硬件报修类型分布
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-help" title="点击扇区查看列表"><Info className="w-3 h-3"/> 可点击</span>
                 </h3>
                 <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie 
                            data={WO_DEVICE_DATA} 
                            cx="50%" cy="50%" 
                            innerRadius={50} outerRadius={70} 
                            paddingAngle={2}
                            dataKey="value"
                            onClick={(data) => setWoFilter({ type: 'DEVICE', value: data.name })}
                            cursor="pointer"
                          >
                             {WO_DEVICE_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                          <Tooltip />
                          <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={8} wrapperStyle={{fontSize: '11px'}}/>
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Regional Bar (Stacked) */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900 text-sm">区域工单SLA分析 (点击查看详情)</h3>
                    <div className="flex gap-2 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> 已超期</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> 即将超期</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> 未超期</span>
                    </div>
                 </div>
                 <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart 
                         data={WO_REGION_STACKED_DATA} 
                         layout="vertical" 
                         margin={{left: 20}}
                         stackOffset="sign"
                       >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                          <XAxis type="number" hide/>
                          <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}}/>
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px'}}/>
                          
                          {/* Stacked Bars with Click Handlers */}
                          <Bar 
                            dataKey="overdue" 
                            stackId="a" 
                            fill="#ef4444" 
                            name="已超期" 
                            radius={[0,0,0,0]}
                            cursor="pointer"
                            onClick={(data) => setWoFilter({ type: 'SLA_REGION', value: data.name, subValue: 'overdue' })}
                          />
                          <Bar 
                            dataKey="atRisk" 
                            stackId="a" 
                            fill="#f97316" 
                            name="即将超期" 
                            cursor="pointer"
                            onClick={(data) => setWoFilter({ type: 'SLA_REGION', value: data.name, subValue: 'atRisk' })}
                          />
                          <Bar 
                            dataKey="normal" 
                            stackId="a" 
                            fill="#22c55e" 
                            name="未超期" 
                            radius={[0, 4, 4, 0]} 
                            cursor="pointer"
                            onClick={(data) => setWoFilter({ type: 'SLA_REGION', value: data.name, subValue: 'normal' })}
                          />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           {/* Trend Analysis Chart Section */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                 <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                       <BarChart3 className="w-5 h-5 text-indigo-600"/>
                       工单趋势分析
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">查看工单总量、超期和风险工单的时间走势。</p>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    <select 
                       className="text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-indigo-500"
                       value={trendFilters.range}
                       onChange={e => setTrendFilters(prev => ({...prev, range: e.target.value}))}
                    >
                       <option value="7D">近 7 天</option>
                       <option value="30D">近 30 天</option>
                    </select>
                    <select 
                       className="text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-indigo-500"
                       value={trendFilters.region}
                       onChange={e => setTrendFilters(prev => ({...prev, region: e.target.value}))}
                    >
                       <option value="All">所有区域</option>
                       <option value="广州区">广州区</option>
                       <option value="中江区">中江区</option>
                       <option value="澳珠区">澳珠区</option>
                       <option value="佛肇区">佛肇区</option>
                       <option value="深圳区">深圳区</option>
                    </select>
                    <select 
                       className="text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-indigo-500"
                       value={trendFilters.device}
                       onChange={e => setTrendFilters(prev => ({...prev, device: e.target.value}))}
                    >
                       <option value="All">所有设备</option>
                       <option value="POS机">POS机</option>
                       <option value="KDS">KDS</option>
                       <option value="路由器">路由器</option>
                       <option value="打印机">打印机</option>
                    </select>
                    <select 
                       className="text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none focus:border-indigo-500"
                       value={trendFilters.fault}
                       onChange={e => setTrendFilters(prev => ({...prev, fault: e.target.value}))}
                    >
                       <option value="All">所有故障</option>
                       <option value="机械故障">机械故障</option>
                       <option value="电气故障">电气故障</option>
                       <option value="软件故障">软件故障</option>
                    </select>
                 </div>
              </div>
              
              <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorOverdue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <Tooltip 
                          contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px'}} 
                       />
                       <Legend verticalAlign="top" height={36} iconType="circle"/>
                       <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="工单总量" />
                       <Area type="monotone" dataKey="atRisk" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="即将超期" />
                       <Area type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorOverdue)" name="已超期" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Detailed Table Section */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left: Overdue/Stopped List */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                 <div className="p-4 border-b border-red-100 bg-red-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-red-900 flex items-center gap-2">
                       <AlertCircle className="w-5 h-5 text-red-600" />
                       当日关注项：超期与/将超期/未结案工单
                    </h3>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-red-200 text-red-600 font-medium">共 {STOPPED_TICKETS.length} 单</span>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                          <tr>
                             <th className="px-4 py-3">工单号 / 地区</th>
                             <th className="px-4 py-3">负责人</th>
                             <th className="px-4 py-3">设备 / 门店</th>
                             <th className="px-4 py-3">原因说明</th>
                             <th className="px-4 py-3">状态</th>
                          </tr>
                       </thead>
                       <tbody className="text-sm divide-y divide-slate-100">
                          {STOPPED_TICKETS.map((ticket, i) => (
                             <tr 
                               key={i} 
                               className={`transition-colors cursor-pointer ${
                                 ticket.reason.includes('(SLA 1.') ? 'bg-red-50 hover:bg-red-100' : 'bg-amber-50/50 hover:bg-amber-100'
                               }`}
                               onClick={() => setSelectedDetailWo({
                                   id: ticket.id,
                                   title: `${ticket.device} 故障 - ${ticket.reason}`,
                                   storeName: ticket.store,
                                   customer: '连锁餐饮客户',
                                   engineer: ticket.engineer,
                                   device: ticket.device,
                                   status: ticket.status === 'STOPPED' ? 'Pending' : (ticket.status === 'AUDIT' ? '审核' : 'In Progress'),
                                   date: '2025-12-15',
                                   amount: 0,
                                   reason: ticket.reason,
                                   originalStatus: ticket.status
                               })}
                             >
                                <td className="px-4 py-3">
                                   <div className="font-medium text-slate-900">{ticket.id}</div>
                                   <div className="text-xs text-slate-500">{ticket.region}</div>
                                </td>
                                <td className="px-4 py-3 text-slate-700 font-medium">
                                   {ticket.engineer}
                                </td>
                                <td className="px-4 py-3">
                                   <div className="text-slate-900">{ticket.device}</div>
                                   <div className="text-xs text-slate-500">{ticket.store}</div>
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-600 max-w-[200px]">
                                   {ticket.reason}
                                </td>
                                <td className="px-4 py-3">
                                   {ticket.status === 'STOPPED' ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                                         <PauseCircle className="w-3 h-3 mr-1"/> 停表
                                      </span>
                                   ) : (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                                         <History className="w-3 h-3 mr-1"/> 审核
                                      </span>
                                   )}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* Right: Problem Stores */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                 <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                       <Store className="w-5 h-5 text-indigo-600" />
                       高频报修门店 (Top 3)
                    </h3>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {HIGH_FAULT_STORES.map((store, i) => (
                       <div key={i} className="border border-slate-100 rounded-lg p-3 bg-slate-50 hover:border-indigo-200 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <h4 className="font-bold text-slate-800 text-sm">{store.store}</h4>
                                <span className="text-xs text-slate-500">{store.region}</span>
                             </div>
                             <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">{store.count} 单</span>
                          </div>
                          <div className="text-xs text-slate-600 mb-2">
                             <span className="font-semibold">故障设备:</span> {store.devices}
                          </div>
                          <div className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 flex items-start gap-1">
                             <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5"/>
                             {store.notes}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>
     );
  };

     // --- 5. VENDOR ANALYTICS ---
  const renderVendorAnalytics = () => {
    // Simulate data filtering based on selectedVendor
    const isFiltered = selectedVendor !== 'All';

    const filteredKpiData = VENDOR_KPI_DATA.map(kpi => {
      if (!isFiltered) return kpi;
      // Randomize values slightly for specific vendor to simulate "refresh"
      const multiplier = 0.1 + (Math.random() * 0.2);
      let newValue = kpi.value;
      if (kpi.label.includes('量')) {
        newValue = Math.floor(parseInt(kpi.value.replace(',', '')) * multiplier).toLocaleString();
      } else if (kpi.label.includes('率')) {
        newValue = (parseFloat(kpi.value) - (Math.random() * 5)).toFixed(1) + '%';
      } else if (kpi.label.includes('响应')) {
        newValue = (parseInt(kpi.value) + Math.floor(Math.random() * 5)) + '分';
      } else if (kpi.label.includes('结案')) {
        newValue = (parseFloat(kpi.value) + (Math.random() * 2)).toFixed(1) + '小时';
      }
      return { ...kpi, value: newValue };
    });

    const filteredSlaPerformance = !isFiltered 
      ? VENDOR_SLA_PERFORMANCE 
      : VENDOR_SLA_PERFORMANCE.filter(v => v.name === selectedVendor);

    const filteredOrderTypeData = !isFiltered
      ? VENDOR_ORDER_TYPE_DATA
      : VENDOR_ORDER_TYPE_DATA.map(item => ({
          ...item,
          value: Math.floor(item.value * (0.8 + Math.random() * 0.4))
        }));

    const filteredEquipmentTypeData = !isFiltered
      ? VENDOR_EQUIPMENT_TYPE_DATA
      : VENDOR_EQUIPMENT_TYPE_DATA.map(item => ({
          ...item,
          value: Math.floor(item.value * (0.8 + Math.random() * 0.4))
        }));

    const filteredPriorityData = !isFiltered
      ? VENDOR_PRIORITY_DATA
      : VENDOR_PRIORITY_DATA.map(item => ({
          ...item,
          value: Math.floor(item.value * (0.8 + Math.random() * 0.4))
        }));

    const filteredBusyTrendData = !isFiltered
      ? VENDOR_ENGINEER_BUSY_TREND
      : VENDOR_ENGINEER_BUSY_TREND.map(item => ({
          ...item,
          total: Math.floor(item.total * (0.5 + Math.random() * 0.5)),
          risk: Math.floor(item.risk * (0.5 + Math.random() * 0.5)),
          overdue: Math.floor(item.overdue * (0.5 + Math.random() * 0.5))
        }));

    const filteredAttentionItems = !isFiltered
      ? VENDOR_ATTENTION_ITEMS
      : VENDOR_ATTENTION_ITEMS.filter(item => item.vendor === selectedVendor);

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {isFiltered && (
          <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium">
              <Info className="w-4 h-4" />
              正在查看 <strong>{selectedVendor}</strong> 的详细数据分析
            </div>
            <button 
              onClick={() => setSelectedVendor('All')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
            >
              清除筛选
            </button>
          </div>
        )}
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {filteredKpiData.map((kpi, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-20 h-20 ${kpi.bg} rounded-full -mr-8 -mt-8 opacity-50`}></div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-900">{kpi.value}</h3>
              </div>
              <div className={`mt-4 flex items-center gap-2 text-xs font-medium ${kpi.color}`}>
                <kpi.icon className="w-3 h-3"/> {kpi.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Middle Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Order Type Distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center justify-between">
              接单类型
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1"><Info className="w-3 h-3"/> 占比分布</span>
            </h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={filteredOrderTypeData} 
                    cx="50%" cy="50%" 
                    innerRadius={50} outerRadius={70} 
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {filteredOrderTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={8} wrapperStyle={{fontSize: '11px'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center justify-between">
              优先级
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1"><Info className="w-3 h-3"/> 任务等级</span>
            </h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={filteredPriorityData} 
                    cx="50%" cy="50%" 
                    innerRadius={50} outerRadius={70} 
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {filteredPriorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={8} wrapperStyle={{fontSize: '11px'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Equipment Type Distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center justify-between">
              设备类型
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1"><Info className="w-3 h-3"/> 占比分布</span>
            </h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={filteredEquipmentTypeData} 
                    cx="50%" cy="50%" 
                    innerRadius={50} outerRadius={70} 
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {filteredEquipmentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={8} wrapperStyle={{fontSize: '11px'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vendor SLA Performance */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 text-sm">供应商工单SLA达成率 TOP 10</h3>
              <div className="flex gap-2 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span> 达成率 (%)</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredSlaPerformance} layout="vertical" margin={{left: 20, right: 30}}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                  <XAxis type="number" domain={[0, 100]} hide/>
                  <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false}/>
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number) => [`${value}%`, 'SLA 达成率']}
                  />
                  <Bar dataKey="rate" fill="#6366f1" name="SLA 达成率" radius={[0, 4, 4, 0]} barSize={12}>
                    <LabelList dataKey="rate" position="right" formatter={(v: number) => `${v}%`} style={{fontSize: '10px', fill: '#64748b'}} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Engineer Busy Trend */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600"/>
                工程师繁忙度与工单趋势
              </h3>
              <p className="text-xs text-slate-500 mt-1">实时监控供应商旗下工程师的工作负载与工单时效。</p>
            </div>
            <div className="flex gap-2">
              <select className="text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 outline-none">
                <option>今日</option>
                <option>昨日</option>
                <option>近7天</option>
              </select>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredBusyTrendData}>
                <defs>
                  <linearGradient id="colorBusy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                <Legend verticalAlign="top" height={36} iconType="circle"/>
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorBusy)" name="总工单量" />
                <Area type="monotone" dataKey="risk" stroke="#f97316" strokeWidth={2} fillOpacity={0} name="风险工单" />
                <Area type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={2} fillOpacity={0} name="超期工单" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Table & Side List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                待关注供应商工单
              </h3>
              <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-600 font-medium">共 {filteredAttentionItems.length} 单</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">工单号</th>
                    <th className="px-4 py-3">供应商 / 工程师</th>
                    <th className="px-4 py-3">设备</th>
                    <th className="px-4 py-3">异常原因</th>
                    <th className="px-4 py-3">SLA</th>
                    <th className="px-4 py-3">状态</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {filteredAttentionItems.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-900">{item.vendor}</div>
                        <div className="text-xs text-slate-500">{item.engineer}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.device}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{item.reason}</td>
                      <td className="px-4 py-3 text-red-600 font-bold">{item.sla}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                          item.status === 'STOPPED' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status === 'STOPPED' ? '停表' : '审核'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredAttentionItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400 italic">
                        暂无需要关注的工单
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  const renderContent = () => {
    switch (view) {
      case ViewState.ANALYTICS_DEVICES:
        return renderDeviceAnalytics();
      case ViewState.ANALYTICS_STORES:
        return renderStoreAnalytics();
      case ViewState.ANALYTICS_ENGINEERS:
        return renderEngineerAnalytics();
      case ViewState.ANALYTICS_WORK_ORDERS:
        return renderWorkOrderAnalytics();
      
      case ViewState.ANALYTICS_VENDORS:
        return renderVendorAnalytics();
      
      // Keep existing simple views or expand later
      case ViewState.ANALYTICS_REVENUE:
        // Placeholder for existing simple view
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">收入分析</h3>
              <p className="text-slate-500">按服务类型和成本分析收入明细。</p>
              {/* Add charts here similar to above if needed */}
            </div>
          </div>
        );
        
      default:
        return (
           <div className="flex flex-col items-center justify-center h-96 text-slate-400">
             <Activity className="w-16 h-16 mb-4 opacity-20" />
             <p className="text-lg">请从菜单中选择特定的报表。</p>
           </div>
        );
    }
  };

  const info = (() => {
    switch(view) {
      case ViewState.ANALYTICS_DEVICES: return { title: '设备概况', icon: Activity, desc: '可靠性、健康状况和生命周期分析' };
      case ViewState.ANALYTICS_STORES: return { title: '门店概况', icon: Store, desc: '区域绩效和 SLA 跟踪' };
      case ViewState.ANALYTICS_ENGINEERS: return { title: '工程师概况', icon: Wrench, desc: '人力效率和最佳表现者' };
      case ViewState.ANALYTICS_WORK_ORDERS: return { title: '工单报表', icon: FileText, desc: '工单量和状态趋势' };
      case ViewState.ANALYTICS_REVENUE: return { title: '收入报表', icon: DollarSign, desc: '财务表现' };
      case ViewState.ANALYTICS_SPARE_PARTS: return { title: '备件分析', icon: Box, desc: '库存使用情况' };
      case ViewState.ANALYTICS_VENDORS: return { title: '供应商报表', icon: Truck, desc: '供应商绩效' };
      case ViewState.ANALYTICS_CUSTOMERS: return { title: '客户报表', icon: Briefcase, desc: '增长指标' };
      default: return { title: '数据洞察', icon: Activity, desc: '系统分析' };
    }
  })();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
       {/* Header */}
       <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <info.icon className="w-6 h-6 text-indigo-600" />
            {info.title}
          </h1>
          <p className="text-slate-500 text-sm">{info.desc}</p>
        </div>
        {!drillDownId && !woFilter && (
          <div className="flex gap-2">
             {view === ViewState.ANALYTICS_VENDORS && (
               <div className="relative">
                 <select 
                   value={selectedVendor}
                   onChange={(e) => setSelectedVendor(e.target.value)}
                   className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors outline-none appearance-none pr-8"
                 >
                   <option value="All">全部供应商</option>
                   {VENDORS_LIST.map(v => (
                     <option key={v} value={v}>{v}</option>
                   ))}
                 </select>
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                   <Filter className="w-3 h-3 text-slate-400" />
                 </div>
               </div>
             )}
             <button className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
               <Calendar className="w-4 h-4" /> 过去 30 天
             </button>
             <button className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
               <Filter className="w-4 h-4" /> 筛选
             </button>
             <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
               <Download className="w-4 h-4" /> 导出
             </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {renderContent()}
      </div>

      {/* DETAIL MODAL - Restored Centered Layout with Map */}
      {selectedDetailWo && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
               onClick={() => setSelectedDetailWo(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
               <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">{selectedDetailWo.id}</h3>
                  <button onClick={() => setSelectedDetailWo(null)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
                     <X className="w-5 h-5"/>
                  </button>
               </div>
               <div className="p-6 space-y-6 overflow-y-auto">
                  <div>
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        selectedDetailWo.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                        selectedDetailWo.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                     }`}>
                        {selectedDetailWo.status}
                     </span>
                     <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedDetailWo.title}</h2>
                     <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <Clock className="w-4 h-4"/> {selectedDetailWo.date}
                     </div>
                  </div>

                  {/* Simulated Map with Route and Distance */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden relative h-48 bg-slate-100 group relative">
                     {/* Map Background Pattern */}
                     <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                     
                     <div className="absolute inset-0 flex items-center justify-center">
                        {/* Route Line */}
                        <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
                           <path d="M120 100 Q 250 40 380 100" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="6 4" className="animate-pulse"/>
                        </svg>
                        
                        {/* Engineer Marker (Left) */}
                        <div className="absolute left-[20%] top-[50%] -translate-y-1/2 flex flex-col items-center gap-1 z-10 group-hover:scale-110 transition-transform cursor-pointer">
                           <div className="w-10 h-10 bg-white rounded-full border-4 border-blue-500 shadow-lg flex items-center justify-center relative">
                              <Wrench className="w-5 h-5 text-blue-600"/>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                           </div>
                           <span className="text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded shadow text-slate-700 backdrop-blur-sm">工程师位置</span>
                        </div>

                        {/* Store Marker (Right) */}
                        <div className="absolute right-[20%] top-[50%] -translate-y-1/2 flex flex-col items-center gap-1 z-10 group-hover:scale-110 transition-transform cursor-pointer">
                           <div className="w-10 h-10 bg-white rounded-full border-4 border-red-500 shadow-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-red-600"/>
                           </div>
                           <span className="text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded shadow text-slate-700 backdrop-blur-sm">门店位置</span>
                        </div>

                        {/* Distance Badge (Center) */}
                        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 bg-white/90 border border-indigo-100 backdrop-blur px-3 py-1.5 rounded-full shadow-lg text-xs font-bold text-indigo-700 flex items-center gap-2 z-20">
                           <Navigation className="w-3.5 h-3.5"/> 
                           <span>3.8 km • 12 分钟</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1"><Store className="w-3 h-3"/> 门店 / 客户</div>
                        <div className="text-sm font-medium text-slate-900">{selectedDetailWo.storeName}</div>
                        <div className="text-xs text-slate-500">{selectedDetailWo.customer}</div>
                     </div>
                     <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 relative">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1"><User className="w-3 h-3"/> 工程师</div>
                        <div className="text-sm font-medium text-slate-900">{selectedDetailWo.engineer}</div>
                        <div className="text-xs text-slate-500">SLA: {selectedDetailWo.reason ? selectedDetailWo.reason.split('SLA')[1] || 'Standard' : 'Standard'}</div>
                        <button 
                           onClick={() => setIsChatOpen(!isChatOpen)}
                           className="absolute top-2 right-2 p-1.5 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                           title="联系工程师"
                        >
                           <MessageSquare className="w-4 h-4"/>
                        </button>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <h4 className="text-sm font-bold text-slate-900">故障详情</h4>
                     <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedDetailWo.reason || '常规维护检查。设备运行在标称参数范围内，但在高负载下观察到轻微振动。已安排后续监测。'}
                     </p>
                  </div>

                  {selectedDetailWo.originalStatus === 'AUDIT' && (
                     <div className="space-y-3 mt-6 border-t border-slate-100 pt-4">
                        <h4 className="text-sm font-bold text-slate-900">停表审批</h4>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-semibold text-slate-500 mb-1">申请时间</label>
                                 <div className="text-sm text-slate-900">2026-04-06 10:00:00</div>
                              </div>
                              <div>
                                 <label className="block text-xs font-semibold text-slate-500 mb-1">申请人</label>
                                 <div className="text-sm text-slate-900">{selectedDetailWo.engineer}</div>
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                 <label className="block text-xs font-semibold text-slate-500 mb-1">申请原因</label>
                                 <select 
                                    className="w-full p-2 border border-slate-300 rounded-md text-sm bg-slate-100 cursor-not-allowed"
                                    value={approvalReason}
                                    onChange={e => setApprovalReason(e.target.value)}
                                    disabled={true}
                                 >
                                    <option value="">请选择</option>
                                    <option value="更换固件(8H)">更换固件(8H)</option>
                                    <option value="门店要求更换上门时间(8H)">门店要求更换上门时间(8H)</option>
                                 </select>
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                 <label className="block text-xs font-semibold text-slate-500 mb-1">预计开表时间</label>
                                 <input 
                                    type="datetime-local" 
                                    className="w-full p-2 border border-slate-300 rounded-md text-sm bg-slate-100 cursor-not-allowed"
                                    value={expectedResumeTime}
                                    onChange={e => setExpectedResumeTime(e.target.value)}
                                    disabled={true}
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-semibold text-slate-500 mb-1">审批人</label>
                                 <div className="text-sm text-slate-900 bg-slate-100 p-2 rounded-md border border-slate-200">System Admin</div>
                              </div>
                              <div>
                                 <label className="block text-xs font-semibold text-slate-500 mb-1">审批状态</label>
                                 <div className="flex gap-2">
                                    <button 
                                       className={`flex-1 py-1.5 text-sm rounded-md border transition-colors ${approvalStatus === '通过' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                       onClick={() => !selectedDetailWo.approvalData && setApprovalStatus('通过')}
                                       disabled={!!selectedDetailWo.approvalData}
                                    >通过</button>
                                    <button 
                                       className={`flex-1 py-1.5 text-sm rounded-md border transition-colors ${approvalStatus === '拒绝' ? 'bg-red-50 border-red-500 text-red-700 font-medium' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                       onClick={() => !selectedDetailWo.approvalData && setApprovalStatus('拒绝')}
                                       disabled={!!selectedDetailWo.approvalData}
                                    >拒绝</button>
                                 </div>
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">审批备注 {approvalStatus === '拒绝' && <span className="text-red-500">*</span>}</label>
                              <textarea 
                                 className="w-full p-2 border border-slate-300 rounded-md text-sm"
                                 rows={2}
                                 value={approvalRemark}
                                 onChange={e => setApprovalRemark(e.target.value)}
                                 placeholder={approvalStatus === '拒绝' ? "请输入拒绝原因" : "选填"}
                                 disabled={!!selectedDetailWo.approvalData}
                              />
                           </div>
                           {!selectedDetailWo.approvalData && (
                              <div className="flex justify-end pt-2">
                                 <button 
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                    disabled={!approvalStatus || (approvalStatus === '拒绝' && !approvalRemark.trim())}
                                    onClick={() => {
                                       const approvalData = {
                                          applicationTime: '2026-04-06 10:00:00',
                                          applicant: selectedDetailWo.engineer,
                                          reason: approvalReason,
                                          expectedResumeTime,
                                          approver: 'System Admin',
                                          status: approvalStatus,
                                          remark: approvalRemark,
                                          approvalTime: new Date().toLocaleString()
                                       };
                                       
                                       setSelectedDetailWo((prev: any) => ({
                                          ...prev, 
                                          approvalData,
                                          status: approvalStatus === '通过' ? '停表' : 'In Process'
                                       }));
                                    }}
                                 >
                                    提交审批
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                     <div className="text-xs text-slate-500">设备: <span className="font-medium text-slate-900">{selectedDetailWo.device}</span></div>
                     <div className="text-lg font-bold text-slate-900">${selectedDetailWo.amount}</div>
                  </div>
               </div>
               <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                  <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium shadow-sm">
                     下载报告
                  </button>
                  <button 
                    onClick={() => onChangeView && onChangeView(ViewState.TICKET_VIEW, { approvalData: selectedDetailWo.approvalData })}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 font-medium shadow-sm"
                  >
                     查看完整工单
                  </button>
               </div>

               {/* Chat Overlay */}
               {isChatOpen && (
                  <div className="fixed inset-0 z-50 flex justify-end">
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsChatOpen(false)}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                     />
                     <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
                     >
                        <div className="p-5 flex items-center justify-between bg-[#4F46E5] sticky top-0 z-10 rounded-t-2xl">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold relative">
                                 {selectedDetailWo.engineer?.charAt(0)}
                                 <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#4F46E5] rounded-full shadow-sm" />
                              </div>
                              <div className="flex flex-col">
                                 <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white text-lg leading-tight">{selectedDetailWo.engineer}</h3>
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Online</span>
                                 </div>
                                 <div className="flex items-center gap-1.5 text-white/80">
                                    <Phone size={14} />
                                    <span className="text-sm font-medium">{getEngineerPhone(selectedDetailWo.engineer)}</span>
                                 </div>
                              </div>
                           </div>
                           <button 
                              onClick={() => setIsChatOpen(false)}
                              className="p-1 hover:bg-white/10 rounded-full text-white transition-colors"
                           >
                              <X size={24} strokeWidth={1.5} />
                           </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                           {chatSession?.messages.map((chat) => {
                              const isMe = chat.senderId === 'admin';
                              return (
                                 <div key={chat.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1.5 px-1">
                                       {!isMe && (
                                          <div className="flex items-center gap-1.5">
                                             <span className="text-[10px] font-bold text-slate-400 uppercase">{chat.senderName}</span>
                                             {chat.senderName === selectedDetailWo.engineer && (
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm" title="Online" />
                                             )}
                                          </div>
                                       )}
                                       <span className="text-[9px] text-slate-300 font-medium">{chat.timestamp}</span>
                                       {isMe && <span className="text-[10px] font-bold text-blue-400 uppercase">You</span>}
                                    </div>
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
                                       isMe 
                                       ? 'bg-blue-600 text-white rounded-tr-none' 
                                       : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                    }`}>
                                       {chat.type === 'text' && chat.content}
                                       {chat.type === 'system' && <span className="italic text-slate-500">{chat.content}</span>}
                                       {chat.type === 'image' && (
                                          <img src={chat.content} alt="Sent" className="max-w-full rounded-lg" referrerPolicy="no-referrer" />
                                       )}
                                       {chat.type === 'file' && (
                                          <div className="flex items-center gap-2">
                                             <Paperclip size={16} />
                                             <span className="underline cursor-pointer">{chat.content}</span>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              );
                           })}
                           <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-[#F5F5F5] relative">
                           {/* Emoji Picker */}
                           {isEmojiPickerOpen && (
                              <motion.div 
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className="absolute bottom-full left-4 right-4 mb-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 z-20"
                              >
                                 <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto no-scrollbar">
                                    {emojis.map((emoji, idx) => (
                                       <button 
                                          key={idx} 
                                          onClick={() => {
                                             setChatMessage(prev => prev + emoji);
                                             setIsEmojiPickerOpen(false);
                                          }}
                                          className="text-xl hover:bg-slate-50 p-1 rounded-lg transition-colors"
                                       >
                                          {emoji}
                                       </button>
                                    ))}
                                 </div>
                              </motion.div>
                           )}

                           <div className="flex items-center gap-3">
                              {/* Toggle Mode Icon */}
                              <button 
                                 onClick={() => {
                                    setInputMode(inputMode === 'text' ? 'voice' : 'text');
                                    setIsEmojiPickerOpen(false);
                                 }}
                                 className="w-9 h-9 flex items-center justify-center rounded-full border-[1.5px] border-slate-800 text-slate-800 hover:bg-slate-200 transition-colors shrink-0"
                              >
                                 {inputMode === 'text' ? <Volume2 size={18} /> : <Keyboard size={18} />}
                              </button>

                              {/* Input Area */}
                              <div className="flex-1 relative flex items-center">
                                 {inputMode === 'text' ? (
                                    <>
                                       <input 
                                          type="text" 
                                          value={chatMessage}
                                          onChange={(e) => setChatMessage(e.target.value)}
                                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                          placeholder="Type a message..."
                                          className="w-full pl-4 pr-24 py-3 bg-white border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
                                       />
                                       <div className="absolute right-2 flex items-center gap-1">
                                          <button 
                                             onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                                             className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                                          >
                                             <Smile size={18} />
                                          </button>
                                          <button 
                                             onClick={() => fileInputRef.current?.click()}
                                             className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                                          >
                                             <Paperclip size={18} />
                                          </button>
                                       </div>
                                    </>
                                 ) : (
                                    <div className="flex-1 flex items-center justify-center h-11 bg-white rounded-full shadow-sm border border-slate-100">
                                       <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm">
                                          <Mic size={18} className="animate-pulse text-blue-500" />
                                          Hold to record
                                       </button>
                                    </div>
                                 )}
                              </div>

                              {/* Send Button */}
                              <button 
                                 onClick={() => handleSendMessage()}
                                 disabled={inputMode === 'text' && !chatMessage.trim()}
                                 className="w-11 h-11 bg-[#4F46E5] text-white rounded-full flex items-center justify-center hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shrink-0"
                              >
                                 {inputMode === 'text' ? <Send size={18} className="ml-0.5" /> : <PlusCircle size={20} />}
                              </button>

                              <input 
                                 type="file" 
                                 ref={fileInputRef} 
                                 className="hidden" 
                                 onChange={handleFileUpload}
                              />
                           </div>
                        </div>
                     </motion.div>
                  </div>
               )}
            </div>
         </div>
      )}
    </div>
  );
};