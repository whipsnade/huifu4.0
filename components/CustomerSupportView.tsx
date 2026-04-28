import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Send, Paperclip, Image as ImageIcon, MoreVertical, Phone, 
  MapPin, Clock, Star, Building2, User, FileText, 
  CheckCircle2, AlertCircle, AlertTriangle, RefreshCw, XCircle, ArrowRightCircle, UserX, ShieldAlert, 
  MessageSquare, BrainCircuit, Ticket, Filter, ChevronDown, ChevronRight, Store, Search,
  X, ChevronLeft, Plus, Upload, Check
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { MOCK_CHAT_SESSIONS, MOCK_USERS, MOCK_WORK_ORDERS, MOCK_DEVICES } from '../constants';
import { ChatSession, ChatMessage, UserRole, WorkOrder, ViewState, Complexity } from '../types';
import { analyzeChatSession } from '../services/geminiService';
import { cn } from '../lib/utils';

export const CustomerSupportView: React.FC<{ onChangeView?: (view: ViewState, params?: any) => void }> = ({ onChangeView }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_CHAT_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>(MOCK_CHAT_SESSIONS[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'ai'>('details');

  // Work Order Drawer State
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [isCreateTicketDrawerOpen, setIsCreateTicketDrawerOpen] = useState(false);
  
  // Create Ticket Form State
  const [newTicketCustomer, setNewTicketCustomer] = useState('');
  const [newTicketStore, setNewTicketStore] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('上门');
  const [newTicketUrgency, setNewTicketUrgency] = useState('Medium');
  const [newTicketStatus, setNewTicketStatus] = useState('服务台处理中');
  const [newTicketDispatchGroup, setNewTicketDispatchGroup] = useState('');
  const [newTicketDeviceCategory, setNewTicketDeviceCategory] = useState('');
  const [newTicketDeviceBrandModel, setNewTicketDeviceBrandModel] = useState('');
  const [newTicketFaultDesc, setNewTicketFaultDesc] = useState('');

  // Store Search State
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [showStoreResults, setShowStoreResults] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [dispatchGroupSearchQuery, setDispatchGroupSearchQuery] = useState('');
  const [showDispatchGroupResults, setShowDispatchGroupResults] = useState(false);

  // Mock Assignee Groups (representing data from Dispatch Group Config)
  const mockAssigneeGroups = [
    { id: 'ag-1', name: '华东区二线支持组', customer: 'Acme Corp', members: ['John Doe', 'Alice Smith'] },
    { id: 'ag-2', name: '上海门店现场组', customer: 'Acme Corp', members: ['Bob Smith', 'Mike Ross'] },
    { id: 'ag-3', name: '北京技术组', customer: 'TechStart Inc', members: ['Evan Wright', 'Jane Smith'] },
  ];

  const allStores = useMemo(() => {
    const stores: {id: string, name: string, customerId: string, customerName: string}[] = [];
    MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER).forEach(c => {
      c.stores?.forEach(s => {
        stores.push({ ...s, customerId: c.id, customerName: c.name });
      });
    });
    return stores;
  }, []);

  const filteredStoreResults = useMemo(() => {
    if (!storeSearchQuery) return [];
    return allStores.filter(s => 
      s.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) || 
      s.id.toLowerCase().includes(storeSearchQuery.toLowerCase())
    );
  }, [storeSearchQuery, allStores]);

  const filteredCustomerResults = useMemo(() => {
    const customers = MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER);
    if (!customerSearchQuery) return customers;
    return customers.filter(c => c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()));
  }, [customerSearchQuery]);

  const filteredDispatchGroups = useMemo(() => {
    const customer = MOCK_USERS.find(u => u.id === newTicketCustomer);
    const groups = mockAssigneeGroups.filter(ag => ag.customer === customer?.name);
    if (!dispatchGroupSearchQuery) return groups;
    return groups.filter(g => g.name.toLowerCase().includes(dispatchGroupSearchQuery.toLowerCase()));
  }, [dispatchGroupSearchQuery, newTicketCustomer, mockAssigneeGroups]);
  
  // Work Order List State
  const [woSearchQuery, setWoSearchQuery] = useState('');
  const [woStatusFilter, setWoStatusFilter] = useState('All');
  const [woDeviceFilter, setWoDeviceFilter] = useState('All');
  const [woCustomerFilter, setWoCustomerFilter] = useState<string[]>([]);
  const [woTab, setWoTab] = useState<'All' | 'Warning' | 'Overdue' | 'Unassigned' | 'StopClockPending' | 'ChangeOrderPending'>('All');
  const [expandedStores, setExpandedStores] = useState<Set<string>>(new Set());

  // Timer state for live countdowns
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(Math.abs(ms) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} H`;
  };

  const getTimerInfo = (wo: WorkOrder) => {
    const woDate = new Date(wo.date.replace(/-/g, '/')); // Handle Safari/Date compatibility
    const now = currentTime.getTime();
    
    // Assumptions for demo purposes:
    // SLA is generally 4 hours from creation date for Warning/Overdue
    const slaTime = woDate.getTime() + (4 * 60 * 60 * 1000); 
    
    if (woTab === 'Warning' || wo.overdueStatus === 'Warning') {
      const remaining = slaTime - now;
      return { label: '剩余', value: formatDuration(remaining), icon: <Clock className="w-3 h-3 text-amber-500 animate-pulse" /> };
    }
    
    if (woTab === 'Overdue' || wo.overdueStatus === 'Overdue') {
      const pastSla = now - slaTime;
      return { label: '已超期', value: formatDuration(pastSla), icon: <Clock className="w-3 h-3 text-red-500 animate-bounce" /> };
    }
    
    if (woTab === 'Unassigned' || wo.status === '无人接单') {
      const unassignedTime = now - woDate.getTime();
      return { label: '无人接单时间', value: formatDuration(unassignedTime), icon: <Clock className="w-3 h-3 text-indigo-500" /> };
    }
    
    if (woTab === 'StopClockPending' || wo.status === '停表待审核') {
      // Assume request was made 30 mins after creation for demo
      const requestTime = woDate.getTime() + (30 * 60 * 1000);
      const elapsed = now - requestTime;
      return { label: '已发起', value: formatDuration(elapsed), icon: <Clock className="w-3 h-3 text-purple-500" /> };
    }
    
    if (woTab === 'ChangeOrderPending' || wo.status === '变更待审核') {
      // Assume request was made 45 mins after creation for demo
      const requestTime = woDate.getTime() + (45 * 60 * 1000);
      const elapsed = now - requestTime;
      return { label: '已发起', value: formatDuration(elapsed), icon: <Clock className="w-3 h-3 text-blue-500" /> };
    }
    
    return null;
  };

  const getDisplayStatus = (wo: WorkOrder) => {
    if (wo.status === '无人接单') return '待接单';
    if (wo.status === '停表待审核') return '申请停表';
    if (wo.status === '变更待审核') return '待审核';
    return wo.status;
  };

  // Notice Bar State
  const [lastRefreshTime, setLastRefreshTime] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setLastRefreshTime(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`);
    }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derived Data
  const customer = MOCK_USERS.find(u => u.name === activeSession.customerName);
  const engineer = MOCK_USERS.find(u => u.name === activeSession.engineerName);
  const workOrder = MOCK_WORK_ORDERS.find(w => w.id === activeSession.workOrderId);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession.messages]);

  // Handle Send Message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'admin',
      senderName: 'Support Agent',
      senderRole: UserRole.ADMIN,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type: 'text'
    };

    const updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [...s.messages, msg],
          lastMessage: newMessage,
          lastMessageTime: 'Just now'
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    setNewMessage('');
  };

  // Trigger AI Analysis
  const handleAnalyzeChat = async () => {
    setIsAnalyzing(true);
    const history = activeSession.messages.map(m => `${m.senderName} (${m.senderRole}): ${m.content}`).join('\n');
    const resultJson = await analyzeChatSession(history);
    try {
      setAiAnalysis(JSON.parse(resultJson));
      setActiveTab('ai');
    } catch (e) {
      console.error("Failed to parse AI response", e);
    }
    setIsAnalyzing(false);
  };

  // Toggle Store Accordion
  const toggleStore = (storeName: string) => {
    const newExpanded = new Set(expandedStores);
    if (newExpanded.has(storeName)) {
      newExpanded.delete(storeName);
    } else {
      newExpanded.add(storeName);
    }
    setExpandedStores(newExpanded);
  };

  // Filter & Sort Work Orders
  const filteredWorkOrders = useMemo(() => {
    let result = MOCK_WORK_ORDERS.filter(wo => {
      const matchesSearch = wo.id.toLowerCase().includes(woSearchQuery.toLowerCase()) || 
                            wo.title.toLowerCase().includes(woSearchQuery.toLowerCase());
      const matchesStatus = woStatusFilter === 'All' || wo.status === woStatusFilter;
      const matchesDevice = woDeviceFilter === 'All' || wo.device === woDeviceFilter;
      const matchesCustomer = woCustomerFilter.length === 0 || woCustomerFilter.includes(wo.customer);
      
      let matchesTab = true;
      if (woTab === 'Warning') matchesTab = wo.overdueStatus === 'Warning';
      else if (woTab === 'Overdue') matchesTab = wo.overdueStatus === 'Overdue';
      else if (woTab === 'Unassigned') matchesTab = wo.status === '无人接单';
      else if (woTab === 'StopClockPending') matchesTab = wo.status === '停表待审核';
      else if (woTab === 'ChangeOrderPending') matchesTab = wo.status === '变更待审核';

      return matchesSearch && matchesStatus && matchesDevice && matchesCustomer && matchesTab;
    });

    // Sorting
    if (woTab === 'All') {
      result.sort((a, b) => {
        const score = (w: WorkOrder) => {
          if (w.overdueStatus === 'Overdue') return 2;
          if (w.overdueStatus === 'Warning') return 1;
          return 0;
        };
        return score(b) - score(a);
      });
    } else {
      // For all other specific tabs, sort oldest to newest (由远到近依次向下)
      result.sort((a, b) => a.date.localeCompare(b.date));
    }

    return result;
  }, [woSearchQuery, woStatusFilter, woDeviceFilter, woCustomerFilter, woTab]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredWorkOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredWorkOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Group Work Orders by Store (for current page)
  const groupedWorkOrders = paginatedOrders.reduce((acc, wo) => {
    const store = wo.storeName || 'Unassigned Store';
    if (!acc[store]) acc[store] = [];
    acc[store].push(wo);
    return acc;
  }, {} as Record<string, WorkOrder[]>);

  // Initialize filters
  useEffect(() => {
     setCurrentPage(1);
  }, [woSearchQuery, woStatusFilter, woDeviceFilter]);

  // Expand all groups when content changes (e.g. pagination)
  useEffect(() => {
     setExpandedStores(new Set(Object.keys(groupedWorkOrders)));
  }, [JSON.stringify(Object.keys(groupedWorkOrders))]);


  // Radar Chart Data for Customer
  const radarData = [
    { subject: 'HVAC', A: 120, fullMark: 150 },
    { subject: '液压', A: 98, fullMark: 150 },
    { subject: '电气', A: 86, fullMark: 150 },
    { subject: '管道', A: 99, fullMark: 150 },
    { subject: '安防', A: 85, fullMark: 150 },
  ];

  // Sentiment History Data (Mock)
  const sentimentData = [
    { date: '9月12日', score: 85 },
    { date: '9月18日', score: 70 },
    { date: '9月25日', score: 55 },
    { date: '10月2日', score: 40 },
    { date: '今天', score: 60 },
  ];

  // Adjust "Today" score based on AI analysis if available
  if (aiAnalysis?.sentiment) {
    const last = sentimentData[sentimentData.length - 1];
    if (aiAnalysis.sentiment.includes('Positive')) last.score = 85;
    else if (aiAnalysis.sentiment.includes('Angry') || aiAnalysis.sentiment.includes('Frustrated')) last.score = 30;
    else last.score = 55;
  }

  // Helper for Status Badge
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4 pb-2 overflow-hidden">
      {/* Notice Bar - Light background and centered cards */}
      <div className="bg-white border border-slate-200 px-6 py-6 flex flex-col items-center justify-center rounded-xl shadow-sm shrink-0 gap-6">
         <div className="flex items-center gap-3 shrink-0">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin-slow" />
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold text-slate-600 tracking-wider">
                工单统计每 5 分钟自动刷新
              </p>
              <div className="h-3 w-[1px] bg-slate-200 mx-1"></div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                上次刷新: <span className="text-slate-600 font-bold">{lastRefreshTime}</span>
              </p>
            </div>
         </div>
         
         <div className="flex items-center justify-center gap-4 w-full overflow-x-auto no-scrollbar">
            {[
              { id: 'Warning', label: '超期预警', color: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100', count: MOCK_WORK_ORDERS.filter(wo => wo.overdueStatus === 'Warning').length },
              { id: 'Overdue', label: '已超期', color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100', count: MOCK_WORK_ORDERS.filter(wo => wo.overdueStatus === 'Overdue').length },
              { id: 'Unassigned', label: '无人接单', color: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100', count: MOCK_WORK_ORDERS.filter(wo => wo.status === '无人接单').length },
              { id: 'StopClockPending', label: '停表待审核', color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100', count: MOCK_WORK_ORDERS.filter(wo => wo.status === '停表待审核').length },
              { id: 'ChangeOrderPending', label: '工单变更待审核', color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100', count: MOCK_WORK_ORDERS.filter(wo => wo.status === '变更待审核').length },
            ].map((card) => (
              <button 
                key={card.id}
                onClick={() => {
                  setWoTab(card.id as any);
                  setIsOrderDrawerOpen(true);
                }}
                style={{ height: '3cm', width: '5cm' }}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl border transition-all hover:scale-105 active:scale-95 shadow-sm group shrink-0",
                  card.color
                )}
              >
                <span className="text-xs font-black uppercase tracking-widest opacity-80 group-hover:opacity-100">{card.label}</span>
                <span className="text-4xl font-black">{card.count}</span>
              </button>
            ))}
         </div>
      </div>

      <div className="flex flex-1 min-h-0 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative">
      
      {/* LEFT: Session List - Fixed height container */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-slate-800">活跃会话</h2>
            <button 
              onClick={() => setIsOrderDrawerOpen(true)}
              className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
              title="打开工单"
            >
              <Ticket className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
             <input type="text" placeholder="搜索会话..." className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
             <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.map(session => (
            <div 
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-white transition-colors ${activeSessionId === session.id ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-slate-900 text-sm truncate">{session.customerName}</span>
                <span className="text-xs text-slate-400 whitespace-nowrap">{session.lastMessageTime}</span>
              </div>
              <div className="flex justify-between items-center">
                 <p className="text-xs text-slate-500 truncate max-w-[180px]">{session.lastMessage}</p>
                 {session.unreadCount > 0 && (
                   <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{session.unreadCount}</span>
                 )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeView?.(ViewState.TICKET_VIEW, { workOrderId: session.workOrderId, fromView: ViewState.CUSTOMER_SUPPORT });
                    }}
                    className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded hover:bg-slate-300 transition-colors"
                  >
                    {session.workOrderId}
                  </button>
                 {session.engineerName && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded flex items-center gap-1"><User className="w-3 h-3"/> {session.engineerName}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE: Chat Window - Fill parent height */}
      <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-slate-200 overflow-hidden">
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
           <div>
             <h3 className="font-bold text-slate-900">{activeSession.customerName}</h3>
             <p className="text-xs text-slate-500 flex items-center gap-1">
               <span className={`w-2 h-2 rounded-full ${activeSession.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
               {activeSession.status === 'active' ? '进行中' : '已解决'} • 
               <button 
                 onClick={() => onChangeView?.(ViewState.TICKET_VIEW, { workOrderId: activeSession.workOrderId, fromView: ViewState.CUSTOMER_SUPPORT })}
                 className="hover:text-indigo-600 transition-colors font-medium underline-offset-2 hover:underline"
               >
                 {activeSession.workOrderId}
               </button>
             </p>
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={handleAnalyzeChat}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
              >
                {isAnalyzing ? <RefreshCw className="w-3 h-3 animate-spin"/> : <BrainCircuit className="w-3 h-3"/>}
                AI 分析
              </button>
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><MoreVertical className="w-5 h-5"/></button>
           </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
          {activeSession.messages.map((msg) => {
            const isMe = msg.senderRole === UserRole.ADMIN;
            const isSystem = msg.type === 'system';
            
            if (isSystem) {
               return (
                 <div key={msg.id} className="flex justify-center my-4">
                   <span className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full">{msg.content}</span>
                 </div>
               )
            }

            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border 
                   ${msg.senderRole === UserRole.ENGINEER ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                     msg.senderRole === UserRole.CUSTOMER ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                     'bg-indigo-600 text-white border-indigo-600'}`}>
                    {msg.senderName.charAt(0)}
                 </div>
                 <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end flex flex-col' : ''}`}>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-medium text-slate-600">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm 
                      ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                 </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white">
           <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><Paperclip className="w-5 h-5"/></button>
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><ImageIcon className="w-5 h-5"/></button>
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="输入消息..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>

      {/* RIGHT: Context Panel */}
      <div className="w-[420px] bg-slate-50 flex flex-col overflow-hidden shadow-inner">
        
        {/* Tabs - Sticky Top */}
        <div className="flex shrink-0 border-b border-slate-200 bg-white sticky top-0 z-10">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            详情
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ai' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            AI 洞察
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          
          {/* TAB: DETAILS */}
          {activeTab === 'details' && (
            <>
               {/* Work Order Card - Refined for requested fields */}
               {workOrder && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <button 
                        onClick={() => onChangeView?.(ViewState.TICKET_VIEW, { workOrderId: workOrder.id, fromView: ViewState.CUSTOMER_SUPPORT })}
                        className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-2 hover:text-indigo-600 transition-colors group text-left"
                      >
                        <Ticket className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                        工单 {workOrder.id}
                      </button>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{workOrder.date}</p>
                    </div>
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border",
                      getStatusColor(workOrder.status).replace('bg-', 'bg-').replace('text-', 'text-')
                    )}>
                      {workOrder.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">门店 (Store)</p>
                       <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                         <Store className="w-3.5 h-3.5 text-slate-400" />
                         {workOrder.storeName || '未知门店'}
                       </p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">紧急度 (Priority)</p>
                       <div className="flex items-center gap-1.5">
                         <span className={cn(
                           "w-2 h-2 rounded-full",
                           workOrder.complexity === Complexity.HIGH || workOrder.complexity === Complexity.URGENT ? "bg-red-500" :
                           workOrder.complexity === Complexity.MEDIUM ? "bg-amber-500" : "bg-green-500"
                         )} />
                         <span className="text-xs font-bold text-slate-800">{workOrder.complexity}</span>
                       </div>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">设备分类 (Category)</p>
                       <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                         <Building2 className="w-3.5 h-3.5 text-slate-400" />
                         {workOrder.device}
                       </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">工单描述 (Description)</p>
                     <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium italic">
                        "{workOrder.title} - 请确认后台系统连接是否正常，前端设备目前无法完成支付校核。"
                     </div>
                  </div>

                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">照片/视频凭证 (Evidence)</p>
                     <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <img 
                          src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=200&h=200&auto=format&fit=crop" 
                          className="w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          referrerPolicy="no-referrer"
                          alt="Evidence 1"
                        />
                        <img 
                          src="https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=200&h=200&auto=format&fit=crop" 
                          className="w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          referrerPolicy="no-referrer"
                          alt="Evidence 2"
                        />
                        <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 flex-shrink-0 cursor-pointer hover:bg-slate-200 transition-colors">
                           <ImageIcon className="w-4 h-4" />
                           <span className="text-[8px] font-black">MORE</span>
                        </div>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">操作 (Actions)</p>
                     <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5">
                           <ArrowRightCircle className="w-3.5 h-3.5" /> 接单
                        </button>
                         <button className="flex-1 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5">
                           <ArrowRightCircle className="w-3.5 h-3.5" /> 转派
                        </button>
                        
                     </div>
                  </div>
                </div>
               )}

               {/* Engineer Profile */}
               {engineer && (
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-3">指派工程师</h4>
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm shadow-sm ring-2 ring-white">
                          {engineer.avatar ? (
                            <img src={engineer.avatar} className="w-full h-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            engineer.name.charAt(0)
                          )}
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">{engineer.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{engineer.specialization}</p>
                       </div>
                       <div className="ml-auto flex flex-col items-end">
                          <div className="flex items-center gap-1 text-[11px] font-black text-amber-500">
                             {engineer.csat}
                             <Star className="w-3 h-3 fill-amber-500" />
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold">CSAT SCORE</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                       <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">级别 (Level)</p>
                          <p className="font-bold text-slate-700">{engineer.level}</p>
                       </div>
                       <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">城市 (City)</p>
                          <p className="font-bold text-slate-700">{engineer.city}</p>
                       </div>
                    </div>
                 </div>
               )}

               {/* Store Profile */}
               {workOrder && (
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
                   <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-3">门店</h4>
                   <div className="space-y-3 font-medium">
                     <div className="flex justify-between items-center bg-slate-50 p-2 px-3 rounded-lg border border-slate-100/50">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">所属市场</span>
                       <span className="text-xs font-black text-slate-800">{workOrder.market || '华东市场'}</span>
                     </div>
                     <div className="flex justify-between items-center bg-slate-50 p-2 px-3 rounded-lg border border-slate-100/50">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">门店地址</span>
                       <span className="text-xs font-black text-slate-800 truncate ml-4" title={workOrder.storeName || '默认门店'}>
                         {workOrder.storeName || '默认门店'}
                       </span>
                     </div>
                     <div className="flex justify-between items-center bg-slate-50 p-2 px-3 rounded-lg border border-slate-100/50">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">所属品牌</span>
                       <span className="text-xs font-black text-slate-800">{workOrder.brand || '默认品牌'}</span>
                     </div>
                   </div>
                 </div>
               )}

               {/* Customer Profile & Stats */}
               {customer && (
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-3">客户档案</h4>
                    <div className="space-y-3 mb-5">
                       <div className="flex justify-between items-center bg-slate-50 p-2 px-3 rounded-lg border border-slate-100/50">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">公司</span>
                          <span className="text-xs font-black text-slate-800">{customer.company}</span>
                       </div>
                       <div className="flex justify-between items-center bg-indigo-50/30 p-2 px-3 rounded-lg border border-indigo-50">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">等级</span>
                          <span className="text-xs font-black text-indigo-600 uppercase">{customer.customerLevel}</span>
                       </div>
                       <div className="flex justify-between items-center bg-slate-50 p-2 px-3 rounded-lg border border-slate-100/50">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">电话</span>
                          <span className="text-xs font-black text-slate-800">{customer.adminPhone}</span>
                       </div>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-4 mb-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">情绪趋势 (Sentiment History)</p>
                       <div className="h-28 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={sentimentData}>
                             <defs>
                               <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="date" tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 600}} axisLine={false} tickLine={false} />
                             <YAxis hide domain={[0, 100]} />
                             <Tooltip 
                               contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold'}}
                               itemStyle={{color: '#6366f1'}}
                             />
                             <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                           </AreaChart>
                         </ResponsiveContainer>
                       </div>
                    </div>
                 </div>
               )}
            </>
          )}

          {/* TAB: AI ANALYSIS */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
               {!aiAnalysis && !isAnalyzing && (
                  <div className="text-center p-8 text-slate-400">
                     <BrainCircuit className="w-12 h-12 mx-auto mb-2 opacity-20" />
                     <p className="text-sm">点击 "AI 分析" 生成洞察。</p>
                  </div>
               )}

               {isAnalyzing && (
                  <div className="text-center p-8">
                     <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                     <p className="text-sm text-slate-500">Gemini 正在分析对话...</p>
                  </div>
               )}

               {aiAnalysis && (
                  <>
                     <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <h5 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">摘要</h5>
                        <p className="text-sm text-indigo-900 leading-relaxed">{aiAnalysis.summary}</p>
                     </div>

                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">情绪</h5>
                        <div className="flex items-center gap-2">
                           <span className={`text-lg font-bold ${
                              aiAnalysis.sentiment?.includes('Positive') ? 'text-green-600' :
                              aiAnalysis.sentiment?.includes('Angry') ? 'text-red-600' :
                              aiAnalysis.sentiment?.includes('Frustrated') ? 'text-orange-500' : 'text-slate-600'
                           }`}>
                              {aiAnalysis.sentiment}
                           </span>
                        </div>
                     </div>

                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">关键问题</h5>
                        <ul className="space-y-1">
                           {aiAnalysis.keyIssues?.map((issue: string, i: number) => (
                              <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                                 <span className="text-red-500 mt-0.5">•</span> {issue}
                              </li>
                           ))}
                        </ul>
                     </div>

                     <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">建议</h5>
                        <div className="flex items-start gap-2">
                           <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"/>
                           <p className="text-sm text-emerald-900">{aiAnalysis.recommendation}</p>
                        </div>
                     </div>
                  </>
               )}
            </div>
          )}

        </div>
      </div>

      {/* WORK ORDER BOTTOM DRAWER */}
      {isOrderDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" 
             onClick={() => setIsOrderDrawerOpen(false)} 
           />
           
           {/* Drawer Panel */}
           <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                 <div>
                   <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                     <Ticket className="w-5 h-5 text-indigo-600" />
                     工单管理
                   </h2>
                   <p className="text-xs text-slate-500">管理、筛选和跟踪所有支持工单。</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <button 
                     onClick={() => setIsCreateTicketDrawerOpen(true)}
                     className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                   >
                     <Plus className="w-4 h-4" /> 新增
                   </button>
                   <button 
                     onClick={() => setIsOrderDrawerOpen(false)}
                     className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 </div>
              </div>

              {/* Filters */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                 <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-4 relative">
                       <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                       <input 
                         type="text" 
                         value={woSearchQuery}
                         onChange={(e) => setWoSearchQuery(e.target.value)}
                         placeholder="搜索工单 ID 或标题..." 
                         className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                       />
                    </div>
                    <div className="col-span-4 relative">
                      <div className="flex flex-wrap gap-1 p-1 bg-white border border-slate-200 rounded-lg min-h-[38px]">
                        {woCustomerFilter.map(c => (
                          <span key={c} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            {c}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => setWoCustomerFilter(prev => prev.filter(item => item !== c))} />
                          </span>
                        ))}
                        <input 
                          type="text" 
                          placeholder={woCustomerFilter.length === 0 ? "筛选客户..." : ""}
                          className="flex-1 min-w-[60px] text-sm focus:outline-none bg-transparent px-2"
                          onFocus={() => setShowCustomerResults(true)}
                          onBlur={() => setTimeout(() => setShowCustomerResults(false), 200)}
                          value={customerSearchQuery}
                          onChange={(e) => setCustomerSearchQuery(e.target.value)}
                        />
                      </div>
                      {showCustomerResults && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                          {filteredCustomerResults.map(c => (
                            <div 
                              key={c.id} 
                              className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                              onClick={() => {
                                if (!woCustomerFilter.includes(c.name)) {
                                  setWoCustomerFilter(prev => [...prev, c.name]);
                                }
                                setCustomerSearchQuery('');
                                setShowCustomerResults(false);
                              }}
                            >
                              <span>{c.name}</span>
                              {woCustomerFilter.includes(c.name) && <Check className="w-4 h-4 text-indigo-600" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <select 
                        value={woStatusFilter}
                        onChange={(e) => setWoStatusFilter(e.target.value)}
                        className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="All">所有状态</option>
                        <option value="Pending">待处理</option>
                        <option value="In Progress">进行中</option>
                        <option value="Completed">已完成</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <select 
                        value={woDeviceFilter}
                        onChange={(e) => setWoDeviceFilter(e.target.value)}
                        className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="All">所有设备</option>
                        <option value="工业 HVAC">HVAC</option>
                        <option value="液压机">液压</option>
                      </select>
                    </div>
                 </div>

                 <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                    {[
                      { id: 'All', label: '全部' },
                      { id: 'Warning', label: '超期预警' },
                      { id: 'Overdue', label: '已超期' },
                      { id: 'Unassigned', label: '无人接单' },
                      { id: 'StopClockPending', label: '停表待审核' },
                      { id: 'ChangeOrderPending', label: '工单变更待审核' },
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setWoTab(tab.id as any)}
                        className={cn(
                          "px-6 py-2 text-sm font-bold transition-all rounded-lg whitespace-nowrap",
                          woTab === tab.id ? 
                            (tab.id === 'Warning' ? "bg-amber-500 text-white shadow-sm" :
                             tab.id === 'Overdue' ? "bg-red-600 text-white shadow-sm" :
                             "bg-indigo-600 text-white shadow-sm")
                            : "text-slate-500 hover:bg-slate-100"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                 </div>
              </div>

              {/* List Content */}
              <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                 {woTab === 'Warning' && (
                   <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-700 text-sm">
                     <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                     <p className="font-bold">以下工单将在30mins以内超期，请即时处理</p>
                   </div>
                 )}
                 {woTab === 'Overdue' && (
                   <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm">
                     <AlertCircle className="w-5 h-5 flex-shrink-0" />
                     <p className="font-bold">以下工单已超期，请联系相关责任人</p>
                   </div>
                 )}
                 {woTab === 'Unassigned' && (
                   <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 text-blue-700 text-sm">
                     <UserX className="w-5 h-5 flex-shrink-0" />
                     <p className="font-bold">以下工单无人接单，请关注</p>
                   </div>
                 )}
                 {woTab === 'StopClockPending' && (
                   <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-3 text-purple-700 text-sm">
                     <Clock className="w-5 h-5 flex-shrink-0" />
                     <p className="font-bold">以下工单发起了停表申请，请尽快审批</p>
                   </div>
                 )}
                 {woTab === 'ChangeOrderPending' && (
                   <div className="mb-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg flex items-center gap-3 text-cyan-700 text-sm">
                     <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                     <p className="font-bold">以下工单发起了工单变更申请，请尽快审批</p>
                   </div>
                 )}
                 {Object.keys(groupedWorkOrders).length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                     <Filter className="w-12 h-12 mb-3 opacity-20" />
                     <p>没有符合您筛选条件的工单。</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                      {(Object.entries(groupedWorkOrders) as [string, WorkOrder[]][]).map(([storeName, storeOrders]) => (
                        <div key={storeName} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                           <button 
                             onClick={() => toggleStore(storeName)}
                             className="w-full px-5 py-3 bg-slate-50/50 flex items-center justify-between text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors border-b border-slate-100"
                           >
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                                   <Store className="w-4 h-4 text-slate-500" />
                                </div>
                                 <div className="flex flex-col items-start leading-tight">
                                    <span className="text-slate-900">{storeName}</span>
                                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                                      {storeOrders.length} 件工单
                                    </span>
                                 </div>
                               </div>
                               <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expandedStores.has(storeName) && "rotate-180")} />
                            </button>

                            {expandedStores.has(storeName) && (
                              <div className="divide-y divide-slate-100">
                                 {storeOrders.map(wo => (
                                  <div 
                                    key={wo.id} 
                                    onClick={() => onChangeView?.(ViewState.TICKET_VIEW, { workOrderId: wo.id, fromView: ViewState.CUSTOMER_SUPPORT })}
                                    className={cn(
                                       "px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group flex items-center justify-between",
                                       wo.overdueStatus === 'Overdue' ? 'bg-red-50 border-l-4 border-l-red-500' : 
                                       wo.overdueStatus === 'Warning' ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''
                                    )}
                                  >
                                     <div className="flex items-start gap-4">
                                        <div className={`mt-1 w-2 h-2 rounded-full ${
                                           wo.overdueStatus === 'Overdue' ? 'bg-red-500' :
                                           wo.overdueStatus === 'Warning' ? 'bg-amber-500' :
                                           wo.status === 'Completed' ? 'bg-green-500' :
                                           wo.status === 'In Progress' ? 'bg-blue-500' :
                                           wo.status === 'Pending' ? 'bg-amber-500' : 'bg-slate-400'
                                        }`}></div>
                                        <div>
                                           <div className="flex items-center gap-2 mb-1">
                                              <span className="font-bold text-slate-900 text-sm">{wo.id}</span>
                                              <div className="flex items-center gap-1.5">
                                                <span className={cn(
                                                  "text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider",
                                                  wo.overdueStatus === 'Overdue' ? 'bg-red-600 text-white border-red-700' :
                                                  wo.overdueStatus === 'Warning' ? 'bg-amber-500 text-white border-amber-600' :
                                                  wo.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                  wo.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                  'bg-slate-50 text-slate-600 border-slate-200'
                                                )}>{getDisplayStatus(wo)}</span>
                                                {getTimerInfo(wo) && (
                                                  <div className={cn(
                                                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold shadow-sm whitespace-nowrap",
                                                    woTab === 'Warning' || wo.overdueStatus === 'Warning' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                    woTab === 'Overdue' || wo.overdueStatus === 'Overdue' ? 'bg-red-50 text-red-600 border-red-200' :
                                                    'bg-slate-50 text-slate-500 border-slate-200'
                                                  )}>
                                                    {getTimerInfo(wo)?.icon}
                                                    <span className="font-mono">
                                                      {getTimerInfo(wo)?.label} <span className={cn(
                                                        "ml-0.5",
                                                        woTab === 'Warning' || wo.overdueStatus === 'Warning' ? 'text-amber-700' :
                                                        woTab === 'Overdue' || wo.overdueStatus === 'Overdue' ? 'text-red-700' : 'text-slate-800'
                                                      )}>{getTimerInfo(wo)?.value}</span>
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                           </div>
                                           <p className="text-sm text-slate-600 font-medium">{wo.title}</p>
                                           <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                                              <span className="flex items-center gap-1"><User className="w-3 h-3"/> {wo.customer}</span>
                                              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {wo.date}</span>
                                           </div>
                                        </div>
                                     </div>
                                     
                                     <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-3">
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // Implement chat initiation logic
                                            }}
                                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group/chat opacity-0 group-hover:opacity-100"
                                            title="发起会话"
                                          >
                                            <MessageSquare className="w-4 h-4" />
                                          </button>
                                          
                                          {woTab === 'Unassigned' && (
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                alert(`派单成功: ${wo.id}`);
                                              }}
                                              className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                              派单
                                            </button>
                                          )}
                                        </div>
                                        <div className="text-sm font-bold text-slate-900">${wo.amount}</div>
                                        <div className="text-xs text-slate-500">{wo.device}</div>
                                     </div>
                                  </div>
                                ))}
                             </div>
                            )}
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              {/* Pagination Footer */}
              <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
                 <div className="text-xs text-slate-500">
                    显示第 <span className="font-medium text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> 到 <span className="font-medium text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredWorkOrders.length)}</span> 条，共 <span className="font-medium text-slate-900">{filteredWorkOrders.length}</span> 条结果
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                       <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="text-sm font-medium text-slate-700 px-2">
                       第 {currentPage} 页，共 {Math.max(1, totalPages)} 页
                    </span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                       <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                 </div>
              </div>

           </div>
        </div>
      )}

      {/* CREATE TICKET RIGHT DRAWER */}
      {isCreateTicketDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
           <div 
             className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" 
             onClick={() => setIsCreateTicketDrawerOpen(false)} 
           />
           <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
               <h2 className="text-lg font-bold text-slate-900">新增工单</h2>
               <button onClick={() => setIsCreateTicketDrawerOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
                 <X className="w-5 h-5" />
               </button>
             </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">门店 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={storeSearchQuery || (allStores.find(s => s.id === newTicketStore)?.name || '')}
                      onChange={(e) => {
                        setStoreSearchQuery(e.target.value);
                        setShowStoreResults(true);
                        if (!e.target.value) {
                          setNewTicketStore('');
                        }
                      }}
                      onFocus={() => setShowStoreResults(true)}
                      onBlur={() => setTimeout(() => setShowStoreResults(false), 200)}
                      placeholder="搜索并选择门店..."
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  {showStoreResults && storeSearchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                      {filteredStoreResults.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-slate-400">未找到相关门店</div>
                      ) : (
                        filteredStoreResults.map(s => (
                          <div 
                            key={s.id} 
                            className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer border-b last:border-0"
                            onClick={() => {
                              setNewTicketStore(s.id);
                              setNewTicketCustomer(s.customerId);
                              setStoreSearchQuery(s.name);
                              setShowStoreResults(false);
                            }}
                          >
                            <div className="font-medium text-slate-900">{s.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{s.customerName} • {s.id}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">客户 <span className="text-red-500">*</span></label>
                  <select 
                    value={newTicketCustomer} 
                    onChange={(e) => { 
                      setNewTicketCustomer(e.target.value); 
                      // When customer changes via dropdown, reset store if it doesn't belong to new customer
                      const customer = MOCK_USERS.find(u => u.id === e.target.value);
                      if (!customer?.stores?.find(s => s.id === newTicketStore)) {
                        setNewTicketStore('');
                        setStoreSearchQuery('');
                      }
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">选择客户</option>
                    {MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">工单分类</label>
                    <select 
                      value={newTicketCategory} 
                      onChange={(e) => setNewTicketCategory(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="上门">上门</option>
                      <option value="远程">远程</option>
                      <option value="巡检">巡检</option>
                      <option value="安装改造">安装改造</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">紧急度</label>
                    <select 
                      value={newTicketUrgency} 
                      onChange={(e) => setNewTicketUrgency(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {newTicketCategory === '远程' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">状态 <span className="text-red-500">*</span></label>
                    <select 
                      value={newTicketStatus} 
                      onChange={(e) => setNewTicketStatus(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="服务台处理中">服务台处理中</option>
                      <option value="停表">停表</option>
                      <option value="已关闭">已关闭</option>
                    </select>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1">指派组</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={dispatchGroupSearchQuery || (mockAssigneeGroups.find(ag => ag.id === newTicketDispatchGroup)?.name || '')}
                        onChange={(e) => {
                          setDispatchGroupSearchQuery(e.target.value);
                          setShowDispatchGroupResults(true);
                          if (!e.target.value) {
                            setNewTicketDispatchGroup('');
                          }
                        }}
                        onFocus={() => setShowDispatchGroupResults(true)}
                        onBlur={() => setTimeout(() => setShowDispatchGroupResults(false), 200)}
                        disabled={!newTicketCustomer}
                        placeholder={newTicketCustomer ? "搜索并选择指派组..." : "请先选择客户"}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>
                    {showDispatchGroupResults && dispatchGroupSearchQuery && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                        {filteredDispatchGroups.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-slate-400">未找到相关指派组</div>
                        ) : (
                          filteredDispatchGroups.map(g => (
                            <div 
                              key={g.id} 
                              className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer border-b last:border-0"
                              onClick={() => {
                                setNewTicketDispatchGroup(g.id);
                                setDispatchGroupSearchQuery(g.name);
                                setShowDispatchGroupResults(false);
                              }}
                            >
                              <div className="font-medium text-slate-900">{g.name}</div>
                              <div className="text-[10px] text-slate-500 uppercase tracking-widest">{g.customer}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {newTicketDispatchGroup && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">组员名单</p>
                      <div className="flex flex-wrap gap-2">
                        {mockAssigneeGroups.find(ag => ag.id === newTicketDispatchGroup)?.members.map(member => (
                          <div key={member} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                            <User className="w-3 h-3 text-indigo-500" />
                            {member}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">设备分类</label>
                  <select 
                    value={newTicketDeviceCategory} 
                    onChange={(e) => { setNewTicketDeviceCategory(e.target.value); setNewTicketDeviceBrandModel(''); }}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">选择设备分类</option>
                    {MOCK_DEVICES.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">设备品牌与型号</label>
                  <select 
                    value={newTicketDeviceBrandModel} 
                    onChange={(e) => setNewTicketDeviceBrandModel(e.target.value)}
                    disabled={!newTicketDeviceCategory}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">选择品牌与型号</option>
                    {MOCK_DEVICES.find(d => d.id === newTicketDeviceCategory)?.brands?.map(b => (
                      <optgroup key={b.id} label={b.name}>
                        {b.models.map(m => (
                          <option key={`${b.id}-${m}`} value={`${b.id}-${m}`}>{b.name} - {m}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">故障描述 <span className="text-red-500">*</span></label>
                  <textarea 
                    value={newTicketFaultDesc}
                    onChange={(e) => setNewTicketFaultDesc(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="详细描述故障情况..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">附件</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">点击或拖拽上传图片/视频</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">创建人</label>
                    <input type="text" disabled value="System Admin" className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">创建时间点</label>
                    <input type="text" disabled value={new Date().toLocaleString()} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
                  </div>
                </div>
             </div>
             <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
               <button onClick={() => setIsCreateTicketDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
               <button onClick={() => setIsCreateTicketDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">保存</button>
             </div>
           </div>
        </div>
      )}

    </div>
  </div>
);
};