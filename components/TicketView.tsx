/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MOCK_CHAT_SESSIONS } from '../constants';
import { UserRole } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  History, 
  MoreVertical, 
  ArrowLeft,
  Edit3,
  MessageSquare,
  Paperclip,
  Tag,
  Printer,
  Share2,
  Target,
  ShieldCheck,
  Star,
  CreditCard,
  AlertTriangle,
  MessageCircle,
  Send,
  FileCheck,
  Plus,
  Volume2,
  Mic,
  Smile,
  PlusCircle,
  Keyboard,
  FileText,
  ExternalLink,
  X,
  Phone,
  Check,
  Package,
  UserPlus,
  Layout,
  LayoutDashboard,
  Info,
  Bell,
  UserCog,
  MessageSquareWarning,
  Globe,
  ToggleRight,
  RefreshCw,
  CheckSquare,
  PauseCircle,
  PlayCircle,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const SlaCountdown = ({ dueDate }: { dueDate: string }) => {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    // static future time for demo purposes to simulate countdown
    const target = new Date().getTime() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000 + 30 * 1000;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('EXPIRED');
        return;
      }
      
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [dueDate]);

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 ml-2">
      <Clock size={12} className="animate-pulse" />
      剩余 {timeLeft || '--:--:--'}
    </span>
  );
};

export enum WorkOrderStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CLOSED = 'Closed'
}

export enum WorkOrderPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export interface TicketWorkOrder {
  id: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  storeName: string;
  storeLevel: string;
  assignee: string;
  createdAt: string;
  dueDate: string;
  location: string;
  category: string;
  deviceCategory: string;
  deviceBrand: string;
  deviceModel: string;
  deviceNumber: string;
  activities: any[];
}

// Mock data for the detailed view
const MOCK_WORK_ORDER: TicketWorkOrder = {
  id: "WO-2024-0082",
  title: "Server Room HVAC Maintenance",
  description: "Annual preventive maintenance for the primary cooling units in Data Center A. Check refrigerant levels, clean filters, and inspect compressor belts.",
  status: WorkOrderStatus.IN_PROGRESS,
  priority: WorkOrderPriority.HIGH,
  storeName: "Acme 市中心店",
  storeLevel: "Gold",
  assignee: "Li Jianguo(Lead Field Engineer)",
  createdAt: "2024-03-25 09:00",
  dueDate: "2024-03-31 17:00",
  location: "Building 4, Floor 2, Room 204",
  category: "安装工单",
  deviceCategory: "空调",
  deviceBrand: "格力",
  deviceModel: "KFR-72LW",
  deviceNumber: "SN-20230911-001",
  activities: [
    {
      id: "12",
      user: "Zhang Wei (IT Operations)",
      role: "STORE MANAGER",
      action: "SERVICE COMPLETE DENIED",
      timestamp: "Oct 24, 2023 • 14:30",
      note: "unable to operate, need to fix again",
      avatar: null,
      type: "deny"
    },
    {
      id: "11",
      user: "Zhang Wei (IT Operations)",
      role: "STORE MANAGER",
      action: "SERVICE COMPLETE CONFIRMED",
      timestamp: "Oct 24, 2023 • 14:30",
      note: "System fully operational. Calibration confirmed for all three nodes. Client signed off on-site.",
      avatar: null,
      type: "complete"
    },
      {id: "10",
      user: "Li Jianguo",
      role: "Lead Field Engineer",
      action: "SERVICE COMPLETE",
      timestamp: "Oct 24, 2023 • 14:30",
      note: "System fully operational. Calibration confirmed for all three nodes. Client signed off on-site.",
      avatar: "https://i.pravatar.cc/150?u=li",
      type: "complete"
    },
    {
      id: "9",
      user: "Li Jianguo",
      role: "Lead Field Engineer",
      action: "IN PROCESS - ON-SITE",
      timestamp: "Oct 24, 2023 • 09:45",
      note: "Arrived at facility. Safety protocols initiated. Beginning diagnostic scan.",
      avatar: "https://i.pravatar.cc/150?u=li",
      type: "onsite"
    },
    {
      id: "8",
      user: "Automated System",
      role: "Inventory Logistics",
      action: "PENDING - PARTS ORDERED",
      timestamp: "Oct 23, 2023 • 16:15",
      note: "Replacement relay (SKU: RX-99) procured from central warehouse. ETA 12 hours.",
      avatar: null,
      initials: "SYS",
      type: "parts"
    },
        {
      id: "7",
      user: "Automated System",
      role: "Pending Audictor",
      action: "PENGDING - PARTS ORDER APPROVED",
      timestamp: "Oct 23, 2023 • 16:15",
      note: "Approved, shipping from the central warehouse. ETA 12 hours.",
      avatar: null,
      type: "parts"
    },
        {
      id: "6",
      user: "Li Jianguo",
      role: "Lead Field Engineer",
      action: "PENDING - PARTS ORDER APPLIED",
      timestamp: "Oct 23, 2023 • 16:15",
      note: "Apply for a replacement relay (SKU: RX-99) procured from central warehouse. ETA 12 hours.",
      avatar: "https://i.pravatar.cc/150?u=li",
      type: "parts"
    },
     {
      id: "5",
      user: "Zhang Wei (IT Operations)",
      role: "STORE MANAGER",
      action: "IN PROCESS - ON-SITE CONFIRMED",
      timestamp: "Oct 24, 2023 • 13:10:00",
      note: "Arrived at facility. Safety protocols initiated. Beginning diagnostic scan.",
      avatar: "https://i.pravatar.cc/150?u=li",
      type: "onsite"
    },
         {
      id: "4",
      user: "Li Jianguo",
      role: "Lead Field Engineer",
      action: "IN PROCESS - ON-SITE",
      timestamp: "Oct 24, 2023 • 13:10:00",
      note: "Arrived at facility. Safety protocols initiated. Beginning diagnostic scan.",
      avatar: "https://i.pravatar.cc/150?u=li",
      type: "onsite"
    },
         {
      id: "3",
      user: "Li Jianguo",
      role: "Lead Field Engineer",
      action: "IN PROCESS - TICKET ACCEPTED",
      timestamp: "Oct 24, 2023 • 11:45",
      note: "Ticket accepted, expected to be there on Oct 24, 2023 • 13:30:00",
      avatar:"https://i.pravatar.cc/150?u=li",
      type: "accepted"
    },
    {
      id: "2",
      user: "Marcus Vance",
      role: "Service Coordinator",
      action: "CREATED - ENGINEER ASSIGNED",
      timestamp: "Oct 23, 2023 • 11:20:00",
      note: "Li Jianguo assigned based on proximity and specific expertise in node calibration.",
      avatar: "https://i.pravatar.cc/150?u=marcus",
      type: "assigned"
    },
    {
      id: "1",
      user: "Customer Portal",
      role: "Automated Entry",
      action: "TICKET CREATED",
      timestamp: "Oct 23, 2023 • 10:05:00",
      note: "Incident reported via remote monitoring alert. Error code: NV-771.",
      avatar: null,
      initials: "C",
      type: "created"
    }
  ]
};

const StatusBadge = ({ status }: { status: WorkOrderStatus }) => {
  const styles = {
    [WorkOrderStatus.OPEN]: "bg-blue-50 text-blue-700 border-blue-200",
    [WorkOrderStatus.IN_PROGRESS]: "bg-amber-50 text-amber-700 border-amber-200",
    [WorkOrderStatus.PENDING]: "bg-gray-50 text-gray-700 border-gray-200",
    [WorkOrderStatus.COMPLETED]: "bg-emerald-50 text-emerald-700 border-emerald-200",
    [WorkOrderStatus.CLOSED]: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: WorkOrderPriority }) => {
  const styles = {
    [WorkOrderPriority.LOW]: "text-gray-500",
    [WorkOrderPriority.MEDIUM]: "text-blue-500",
    [WorkOrderPriority.HIGH]: "text-orange-500 font-semibold",
    [WorkOrderPriority.URGENT]: "text-red-600 font-bold",
  };

  return (
    <div className="flex items-center gap-1.5">
      <AlertCircle size={14} className={styles[priority]} />
      <span className={`text-sm ${styles[priority]}`}>{priority}</span>
    </div>
  );
};

export function TicketView({ onBack, approvalData }: { onBack?: () => void, approvalData?: any }) {
  const [wo] = useState<TicketWorkOrder>(MOCK_WORK_ORDER);
  const [expandedSections, setExpandedSections] = useState<string[]>(['history']);
  const [showSLADetail, setShowSLADetail] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Get chat session for this work order
  const chatSession = useMemo(() => {
    return MOCK_CHAT_SESSIONS.find(s => s.workOrderId === 'WO-2024-001') || null; // Using mock WO ID for now
  }, [isChatOpen]); // Re-evaluate when chat opens

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSession?.messages, isChatOpen]);

  const [files] = useState([
    { id: 1, name: 'HVAC_Unit1_Photo.jpg', size: '2.4 MB', type: 'image' },
    { id: 2, name: 'Maintenance_Log_2024.pdf', size: '1.1 MB', type: 'pdf' },
    { id: 3, name: 'Unit_Specs.docx', size: '450 KB', type: 'doc' },
  ]);
  const tabsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reassign Modal State
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignEngineer, setReassignEngineer] = useState('');
  const reassignCount = 2; // Mock data

  // Assign Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignEngineer, setAssignEngineer] = useState('');
  const [assignEmergencyNotice, setAssignEmergencyNotice] = useState<string[]>([]);
  const maxReassignCount = 5; // Mock data
  const reassignOperator = 'System Admin'; // Mock data
  const reassignTime = new Date().toLocaleString();

  // Complete Modal State
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [closureMethod, setClosureMethod] = useState('');
  const [solution, setSolution] = useState('');
  const completeOperator = 'System Admin'; // Mock data
  const completeTime = new Date().toLocaleString();

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
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      let type = 'file';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      
      handleSendMessage(type, result);
    };

    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      reader.readAsDataURL(file);
    } else {
      // For generic files, we'll just mock the name for now
      handleSendMessage('file', file.name);
    }
  };

  const commonTags = ['技术精湛', '服务态度好', '效率高'];
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const tabs = [
    { id: 'history', label: '活动历史', icon: History },
    { id: 'matching', label: '工程师命中规则', icon: Target },
    { id: 'sla', label: 'SLA规则', icon: ShieldCheck },
    { id: 'approval', label: '审批', icon: FileCheck },
    { id: 'evaluation', label: '评价', icon: Star },
    { id: 'closure', label: '结案', icon: CheckCircle2 },
    { id: 'complaints', label: '投诉', icon: AlertTriangle },
  ]

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderSectionContent = (id: string) => {
    switch (id) {
      case 'history':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-3 px-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">时间 (Time)</th>
                  <th className="py-3 px-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">操作 (Action)</th>
                  <th className="py-3 px-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">人员 (User)</th>
                  <th className="py-3 px-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">备注 (Note)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {wo.activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-4 text-[11px] font-bold text-slate-500 whitespace-nowrap">{activity.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight",
                        activity.type === 'complete' ? "bg-emerald-50 text-emerald-600" :
                        activity.type === 'deny' ? "bg-red-50 text-red-600" :
                        activity.type === 'onsite' ? "bg-amber-50 text-amber-600" :
                        "bg-indigo-50 text-indigo-600"
                      )}>
                        {activity.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {activity.avatar ? (
                          <img 
                            src={activity.avatar} 
                            className="w-7 h-7 rounded-lg object-cover border border-slate-100" 
                            referrerPolicy="no-referrer" 
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-black border border-slate-100">
                            {activity.initials || activity.user.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 leading-tight truncate">{activity.user}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight truncate">{activity.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 font-medium italic break-words min-w-[200px]">
                      {activity.note ? `"${activity.note}"` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'matching':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
              <Target size={18} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">匹配逻辑：综合规则命中</h4>
                <p className="text-xs text-blue-700">当前工程师满足以下所有核心匹配规则，系统已自动派单。</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { label: '工单类型', value: '上门', options: ['上门', '远程', '巡检', '安装改造'], version: 'V1.0' },
                { label: '技能命中', value: '暖通空调', options: ['暖通空调', '强电维护', '弱电布线', 'IT桌面运维'], version: 'V1.0' },
                { label: '距离范围命中', value: '1-3KM', options: ['1-3KM', '3-8KM', '8-15KM', '15KM以上'], version: 'V1.1' },
                { label: '可维修设备命中', value: 'POS机', options: ['POS机', '显示器', '小票打印机', '交换机'], version: 'V1.0' },
                { label: '优先级命中', value: 'P2', options: ['P1', 'P2', 'P3', 'P4'], version: 'V1.1' },
                { label: '接单量/当日额度', value: '2/5', options: ['2/5'], version: 'V1.0' },
                { label: '可接单时间', value: '上午09:00:00 ~ 12:00:00', options: ['上午09:00:00 ~ 12:00:00', '下午13:00:00 ~ 16:00:00'], version: 'V1.1' },
              ].map((rule, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{rule.label}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded uppercase tracking-tighter">
                        {rule.version}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rule.options.map((opt) => (
                      <span 
                        key={opt} 
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          opt === rule.value 
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' 
                          : 'bg-white border border-slate-200 text-slate-400'
                        }`}
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-blue-100">
                <span>点击查看更多</span>
                <MoreVertical size={14} className="rotate-90" />
              </button>
            </div>
          </div>
        );
      case 'sla':
        if (showSLADetail) {
          return (
            <div className="min-h-screen bg-[#F8F9FC] -m-4 sm:-m-8 p-4 sm:p-10 animate-in fade-in duration-500">
              {/* Header */}
              <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setShowSLADetail(false)}
                      className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-600 shadow-sm border border-transparent hover:border-slate-200 bg-white/50"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <div>
                      <h1 className="text-4xl font-black text-slate-900 tracking-tight">SLA Configuration</h1>
                      <p className="text-slate-500 mt-1.5 font-medium text-lg">Define service level agreement targets and automated response rules.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm opacity-60">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Status</span>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                  {/* Left Column: General Info & Priority Targets */}
                  <div className="xl:col-span-9 space-y-10">
                    {/* General Information */}
                    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                          <Info size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">General Information</h2>
                      </div>

                      <div className="grid grid-cols-1 gap-8">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">Rule Name</label>
                          <div className="w-full p-4 bg-[#FDFDFD] border border-slate-100 rounded-2xl text-slate-700 text-lg font-bold shadow-sm">
                            Gold Tier Support
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">Description</label>
                          <div className="w-full p-6 bg-[#FDFDFD] border border-slate-100 rounded-2xl text-slate-600 font-medium leading-relaxed text-base italic">
                            "High-priority service tier for premium corporate clients ensuring sub-4 hour resolution windows across all operational zones."
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Priority Targets */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Priority Targets</h2>
                        <div className="h-px flex-1 bg-slate-200/60" />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-5">
                        {/* Critical */}
                        <div className="bg-white rounded-[28px] p-6 border-t-[6px] border-t-red-500 border border-slate-100 shadow-md hover:shadow-xl transition-all flex flex-col min-h-[200px] group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                          <div className="relative z-10">
                            <span className="px-2.5 py-1 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-md">Critical</span>
                            <div className="mt-6 space-y-4">
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Response</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">30<span className="text-sm ml-1 text-slate-400 font-bold">mins</span></p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Resolution</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">2<span className="text-sm ml-1 text-slate-400 font-bold">hours</span></p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* High */}
                        <div className="bg-white rounded-[28px] p-6 border-t-[6px] border-t-indigo-500 border border-slate-100 shadow-md hover:shadow-xl transition-all flex flex-col min-h-[200px] group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                          <div className="relative z-10">
                            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-md">High</span>
                            <div className="mt-6 space-y-4">
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Response</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">1<span className="text-sm ml-1 text-slate-400 font-bold">hour</span></p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Resolution</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">4<span className="text-sm ml-1 text-slate-400 font-bold">hours</span></p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Medium */}
                        <div className="bg-white rounded-[28px] p-6 border-t-[6px] border-t-slate-400 border border-slate-100 shadow-md hover:shadow-xl transition-all flex flex-col min-h-[200px] group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-slate-400/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                          <div className="relative z-10">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-md">Medium</span>
                            <div className="mt-6 space-y-4">
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Response</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">4<span className="text-sm ml-1 text-slate-400 font-bold">hours</span></p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Resolution</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">8<span className="text-sm ml-1 text-slate-400 font-bold">hours</span></p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Low */}
                        <div className="bg-white rounded-[28px] p-6 border-t-[6px] border-t-emerald-400 border border-slate-100 shadow-md hover:shadow-xl transition-all flex flex-col min-h-[200px] group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                          <div className="relative z-10">
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-md">Low</span>
                            <div className="mt-6 space-y-4">
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Response</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">6<span className="text-sm ml-1 text-slate-400 font-bold">hours</span></p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Resolution</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">48<span className="text-sm ml-1 text-slate-400 font-bold">hours</span></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Escalations */}
                  <div className="xl:col-span-3">
                    <div className="bg-[#F1F3F9] rounded-[32px] p-6 border border-slate-200/50 shadow-inner sticky top-10">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                          <Bell size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Escalations</h2>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-50 relative group hover:scale-[1.02] transition-all cursor-default overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-600 shadow-sm group-hover:bg-fuchsia-100 transition-colors shrink-0">
                            <Bell size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">Notify Manager</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">After 50% time elapsed</p>
                          </div>
                          <div className="absolute right-4 w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                        </div>

                        <div className="bg-white p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-50 relative group hover:scale-[1.02] transition-all cursor-default overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-100 transition-colors shrink-0">
                            <UserCog size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">Auto-Reassign</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">At 80% time elapsed</p>
                          </div>
                          <div className="absolute right-4 w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                        </div>

                        <div className="bg-white/40 p-5 rounded-2xl flex items-center gap-4 border border-slate-200/50 relative opacity-50 grayscale overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <MessageSquareWarning size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-500 truncate">Client Alert</p>
                            <p className="text-[10px] text-slate-300 font-medium mt-0.5 truncate">Disabled</p>
                          </div>
                          <div className="absolute right-4 w-2 h-2 rounded-full bg-slate-200" />
                        </div>
                      </div>

                      <div className="mt-10 p-6 bg-indigo-600 rounded-2xl text-white relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 opacity-80">System Status</p>
                          <h3 className="text-lg font-bold leading-tight">Automated Rules Active</h3>
                          <div className="mt-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-bold opacity-90">Monitoring 24/7</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Last Modified</p>
                      <p className="text-xs font-bold text-slate-700">Oct 24, 2023 • 14:22 PM</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 italic">Read-only Configuration Mode</p>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
              <Target size={18} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">规则匹配逻辑：综合规则命中</h4>
                  <button 
                    onClick={() => setShowSLADetail(true)}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    SLA_002_Version1.0.2
                  </button>
                
              </div>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">响应时间 SLA</h4>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded uppercase tracking-tighter">V1.2</span>
                  </div>
                  <p className="text-xs text-slate-500 italic underline">要求：30分钟内响应</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">响应超时</span>
              </div>
              <div className="pt-3 border-t border-slate-50 space-y-2">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <span>派单时间：<span className="text-slate-700 font-medium">2026-05-12 15:00:24</span></span>
                  <span>接单时间：<span className="text-slate-700 font-medium">2026-05-12 15:05:15</span></span>
                </div>
                <div className="text-[11px] text-slate-500">
                  预计最迟响应时间 VS 实际响应时间: 
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-slate-700 font-medium">2026-05-12 17:05:15</span>
                    <span className="text-slate-300">VS</span>
                    <span className="text-yellow-500 font-bold">2026-05-12 17:35:15</span>
                    <span className="ml-2 text-yellow-500 font-bold bg-yellow-50 px-1.5 py-0.5 rounded">超时 0.5Hr(s)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">到场时间 SLA</h4>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded uppercase tracking-tighter">V1.0</span>
                  </div>
                  <p className="text-xs text-slate-500 italic underline">要求：2小时内到场</p>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">已达成</span>
              </div>
              <div className="pt-3 border-t border-slate-50 space-y-3">
                <div className="text-[11px] text-slate-500">
                  预计出发时间 VS 实际出发时间：
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-slate-700 font-medium">2026-05-12 15:30:15</span>
                    <span className="text-slate-300">VS</span>
                    <span className="text-slate-700 font-medium">2026-05-12 15:30:15</span>
                    <span className="ml-2 text-slate-400 font-medium">出发超时：0Hr(s)</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  预计到达时间 VS 实际到达时间：
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-slate-700 font-medium">2026-05-12 16:30:15</span>
                    <span className="text-slate-300">VS</span>
                    <span className="text-emerald-600 font-bold">2026-05-12 16:10:15</span>
                    <span className="ml-2 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">提前 0.3Hr(s)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">停表时间 SLA</h4>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded uppercase tracking-tighter">V2.1</span>
                  </div>
                  <p className="text-xs text-slate-500 italic underline">要求：按规定流程停表</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded">停表超时</span>
              </div>
              <div className="pt-3 border-t border-slate-50 space-y-2">
                <div className="text-[11px] text-slate-500">
                  <span>停表时间：<span className="text-slate-700 font-medium">2026-05-12 16:30:15</span></span>
                </div>
                <div className="text-[11px] text-slate-500">
                  预计开表时间 VS 实际开表时间：
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-slate-700 font-medium">2026-05-15 10:30:15</span>
                    <span className="text-slate-300">VS</span>
                    <span className="text-red-600 font-bold">2026-05-16 14:30:15</span>
                    <span className="ml-2 text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">超时 4Hr(s)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">修复时间 SLA</h4>
                  <p className="text-xs text-slate-500 italic underline">要求：4小时内修复</p>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">已修复</span>
              </div>
              <div className="pt-3 border-t border-slate-50 space-y-2">
                <div className="text-[11px] text-slate-500">
                  预计修复时间 VS 实际修复时间：
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-slate-700 font-medium">2026-05-15 15:05:15</span>
                    <span className="text-slate-300">VS</span>
                    <span className="text-emerald-600 font-bold">2026-05-15 12:05:15</span>
                    <span className="ml-2 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">提前 3Hr(s)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'approval':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-700">停表审批记录</h4>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">共 {approvalData ? 2 : 1} 条</span>
            </div>
            {approvalData && (
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                      <Clock size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">停表申请</div>
                      <div className="text-[10px] text-slate-400">{approvalData.applicationTime}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${approvalData.status === '通过' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    已{approvalData.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">申请人</span>
                    <span className="text-slate-700 font-medium">{approvalData.applicant}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">申请原因</span>
                    <span className="text-slate-700 font-medium">{approvalData.reason}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">预计开表时间</span>
                    <span className="text-slate-700 font-medium">{approvalData.expectedResumeTime ? new Date(approvalData.expectedResumeTime).toLocaleString() : '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">审批人</span>
                    <span className="text-slate-700 font-medium">{approvalData.approver}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">审批时间</span>
                    <span className="text-slate-700 font-medium">{approvalData.approvalTime}</span>
                  </div>
                </div>
                {approvalData.remark && (
                  <div className="mt-3 pt-3 border-t border-slate-200/50">
                    <span className="text-slate-400 block mb-1 text-[10px]">审批备注</span>
                    <p className="text-[11px] text-slate-600 italic">{approvalData.remark}</p>
                  </div>
                )}
              </div>
            )}
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">停表申请</div>
                    <div className="text-[10px] text-slate-400">2026-05-15 10:00:00</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-600 uppercase">已通过</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">申请原因</span>
                  <span className="text-slate-700 font-medium">等待备件到货 (HVAC 过滤器)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">预计开表时间</span>
                  <span className="text-slate-700 font-medium">2026-05-15 10:30:15</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">审批人</span>
                  <span className="text-slate-700 font-medium">System Admin</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">审批时间</span>
                  <span className="text-slate-700 font-medium">2026-05-15 10:05:20</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/50">
                <span className="text-slate-400 block mb-1 text-[10px]">审批备注</span>
                <p className="text-[11px] text-slate-600 italic">核实备件采购流程中，同意暂时停表以保证 SLA 准确性。</p>
              </div>
            </div>
          </div>
        );
      case 'evaluation':
        return (
          <div className="text-center py-8">
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={24} className="text-yellow-400" fill="currentColor" />
              ))}
            </div>
            <div className="max-w-md mx-auto px-4 space-y-4">
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                {commonTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'closure':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">结案方式</span>
                <span className="text-sm font-bold text-slate-900">远程解决</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">结案时间</span>
                <span className="text-sm font-bold text-slate-900">2026-03-15 14:30:00</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">解决方案</span>
                <span className="text-sm font-medium text-slate-700">重启路由器并重新配置网络参数，测试连接正常。</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">客户确认</span>
                <span className="text-sm font-bold text-emerald-600">是</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">一次性解决</span>
                <span className="text-sm font-bold text-emerald-600">是</span>
              </div>
            </div>
          </div>
        );
      case 'complaints':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-red-900">投诉记录</h4>
                  <span className="text-[10px] text-red-500 font-bold uppercase">处理完成</span>
                </div>
                <p className="text-sm text-red-700 font-medium mb-2">迟到并且态度不好</p>
                <div className="flex items-center gap-3 text-[10px] text-red-400">
                  <span>投诉时间：2026-03-16 10:30:00</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Work Order Detail</h1>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">{wo.id}</span>
              <StatusBadge status={wo.status} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 mr-2 pr-2 border-r border-slate-200">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500" title="Print">
              <Printer size={18} />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500" title="Share">
              <Share2 size={18} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Edit3 size={16} />
            <span className="hidden md:inline">Edit</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all shadow-sm shadow-blue-200">
            <CheckCircle2 size={16} />
            <span className="hidden md:inline">Complete</span>
            <span className="md:hidden">Done</span>
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <main className="w-full p-6 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* Summary Card */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{wo.title}</h2>
              <PriorityBadge priority={wo.priority} />
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              {wo.description}
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 pt-6 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider">工单分类</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Tag size={14} className="text-slate-400" />
                  {wo.category}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider">紧急度</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <PriorityBadge priority={wo.priority} />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider">设备分类</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Target size={14} className="text-slate-400" />
                  {wo.deviceCategory}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider">设备品牌</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Target size={14} className="text-slate-400" />
                  {wo.deviceBrand}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider">设备型号</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Target size={14} className="text-slate-400" />
                  {wo.deviceModel}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider">设备编号</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Tag size={14} className="text-slate-400" />
                  {wo.deviceNumber}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider">创建时间</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Clock size={14} className="text-slate-400" />
                  {wo.createdAt}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider">SLA 期望修复时间</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar size={14} className="text-slate-400" />
                  {wo.dueDate}
                  <SlaCountdown dueDate={wo.dueDate} />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Ticket Progress</h3>
              <div className="relative overflow-x-auto pb-4 custom-scrollbar">
                <div className="min-w-max relative px-4 pt-2">
                  {/* Background Line */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                  
                  {/* Active Line */}
                  <div 
                    className="absolute top-4 left-4 h-1 bg-indigo-500 -translate-y-1/2 rounded-full transition-all duration-500"
                    style={{ width: '10%' }} // Hardcoded for IN_PROGRESS state based on mock data
                  />
                  
                  {/* Steps */}
                  <div className="relative flex justify-between gap-8">
                    {[
                      { key: 'pending_accept', label: '待接单', active: true, completed: true },
                      { key: 'sd_accepted', label: '服务台已接单', active: true, completed: true },
                      { key: 'eng_accepted', label: '工程师已接单', active: true, completed: true },
                      { key: 'sd_processing', label: '服务台处理中', active: true, completed: false },
                      { key: 'pending_onsite', label: '待上门', active: false, completed: false },
                      { key: 'apply_stopwatch', label: '申请停表', active: false, completed: false },
                      { key: 'stopwatch_active', label: '停表中', active: false, completed: false },
                      { key: 'stopwatch_rejected', label: '停表拒绝', active: false, completed: false },
                      { key: 'stopwatch_resumed', label: '已开表', active: false, completed: false },
                      { key: 'apply_escalation', label: '申请技术升级', active: false, completed: false },
                      { key: 'expert_resolving', label: '技术专家解决中', active: false, completed: false },
                      { key: 'escalation_rejected', label: '技术升级拒绝', active: false, completed: false },
                      { key: 'transferred', label: '已转单', active: false, completed: false },
                      { key: 'apply_fee_change', label: '申请费用变更', active: false, completed: false },
                      { key: 'fee_changed', label: '费用已变更', active: false, completed: false },
                      { key: 'fee_change_rejected', label: '费用变更拒绝', active: false, completed: false },
                      { key: 'apply_receipt', label: '申请回单', active: false, completed: false },
                      { key: 'receipted', label: '已回单', active: false, completed: false },
                      { key: 'receipt_rejected', label: '回单拒绝', active: false, completed: false },
                      { key: 'departed', label: '已出发', active: false, completed: false },
                      { key: 'arrived', label: '已到达', active: false, completed: false },
                      { key: 'repairing', label: '到店维修中', active: false, completed: false },
                      { key: 'restarted', label: '重启', active: false, completed: false },
                      { key: 'refunding', label: '退款中', active: false, completed: false },
                      { key: 'pending_inspection', label: '待验收', active: false, completed: false },
                      { key: 'pending_payment', label: '待付款', active: false, completed: false },
                      { key: 'pending_evaluation', label: '待评价', active: false, completed: false },
                      { key: 'closed', label: '已关闭', active: false, completed: false },
                      { key: 'cancelled', label: '已取消', active: false, completed: false },
                      { key: 'archived', label: '已归档', active: false, completed: false },
                    ].map((step, index) => (
                      <div key={step.key} className="flex flex-col items-center gap-2 z-10 w-24">
                        <div 
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white transition-colors duration-300 ${
                            step.completed 
                              ? 'border-indigo-500 bg-indigo-500' 
                              : step.active 
                                ? 'border-indigo-500' 
                                : 'border-slate-200'
                          }`}
                        >
                          {step.completed && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className={`text-[10px] font-bold tracking-wider text-center ${
                          step.active ? 'text-indigo-600' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* New Tabs Section as Accordions */}
          <div className="space-y-4">
            {tabs.map((tab) => {
              const isExpanded = expandedSections.includes(tab.id);
              return (
                <motion.section 
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                >
                  <button 
                    onClick={() => toggleSection(tab.id)}
                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200/50">
                        <tab.icon size={18} />
                      </div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{tab.label}</h4>
                    </div>
                    <div className={cn(
                      "p-2 rounded-lg transition-all",
                      isExpanded ? "bg-indigo-50 text-indigo-600 rotate-180" : "bg-slate-50 text-slate-400"
                    )}>
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="p-6 border-t border-slate-100 bg-white">
                          {renderSectionContent(tab.id)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-6">
          {/* Personnel Card */}
          <motion.section 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Personnel</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <User size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">门店</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{wo.storeName}</span>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-tighter">
                      <Star size={10} className="fill-amber-500 text-amber-500" />
                      {wo.storeLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 relative">
                  <User size={20} />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assignee</span>
                    <div className="flex items-center gap-1 bg-emerald-50 px-1 py-0.5 rounded text-[8px] font-bold text-emerald-600 uppercase tracking-tight">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                      Online
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{wo.assignee}</span>
                    <button 
                      onClick={() => setIsMapOpen(true)}
                      className="p-1 text-indigo-500 hover:bg-indigo-50 rounded transition-colors"
                      title="查看地图定位"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full mt-8 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Chat History
            </button>
          </motion.section>

          {/* Attachments Section */}
          <motion.section 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">照片/视频凭证</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase">Files ({files.length})</span>
              </div>
              
              <div className="space-y-2">
                {files.map((file) => (
                  <button 
                    key={file.id}
                    onClick={() => alert(`Opening file: ${file.name}`)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{file.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{file.size}</p>
                      </div>
                    </div>
                    <div className="p-2 text-slate-300 group-hover:text-blue-400 transition-colors">
                      <ExternalLink size={16} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Action Section */}
          <motion.section 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">操作</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-emerald-300 bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-200/50 group"
              >
                <div className="p-3 rounded-full bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                  <CheckSquare size={24} />
                </div>
                <span className="text-sm font-bold">回单</span>
              </button>
              <button 
                onClick={() => setIsAssignModalOpen(true)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-blue-300 bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-sm shadow-blue-200/50 group"
              >
                <div className="p-3 rounded-full bg-white/20 text-white group-hover:rotate-180 transition-transform duration-500">
                  <RefreshCw size={24} />
                </div>
                <span className="text-sm font-bold">转派</span>
              </button>
              <button 
                onClick={() => setIsCompleteModalOpen(true)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-indigo-300 bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-sm shadow-indigo-200/50 group"
              >
                <div className="p-3 rounded-full bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                  <CheckSquare size={24} />
                </div>
                <span className="text-sm font-bold">完成</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-amber-300 bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-sm shadow-amber-200/50 group"
              >
                <div className="p-3 rounded-full bg-white/20 text-white">
                  <MessageSquare size={24} />
                </div>
                <span className="text-sm font-bold">响应</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-red-300 bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm shadow-red-200/50 group"
              >
                <div className="p-3 rounded-full bg-white/20 text-white group-hover:scale-110 transition-transform">
                   <PauseCircle size={24} />
                </div>
                <span className="text-sm font-bold">停表</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200/50 group"
              >
                <div className="p-3 rounded-full bg-white/20 text-white group-hover:scale-110 transition-transform">
                   <PlayCircle size={24} />
                </div>
                <span className="text-sm font-bold">开表</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-purple-300 bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-sm shadow-purple-200/50 group"
              >
                <div className="p-3 rounded-full bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                  <Target size={24} />
                </div>
                <span className="text-sm font-bold">技术升级</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-all group shadow-sm"
              >
                <div className="p-3 rounded-full bg-cyan-100 text-cyan-700 group-hover:bg-cyan-200 transition-colors">
                  <Package size={24} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-sm font-semibold">配件</span>
              </button>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsAssignModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">指派工单</h3>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  工程师候选人 <span className="text-[10px] font-normal text-slate-400 ml-2">(根据与门店距离推荐)</span>
                </label>
                <select 
                  value={assignEngineer}
                  onChange={(e) => setAssignEngineer(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="">请选择工程师</option>
                  <option value="eng1">张三 (距离 1.2km)</option>
                  <option value="eng2">李四 (距离 3.5km)</option>
                  <option value="eng3">王五 (距离 5.0km)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  紧急通知候选人
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={assignEmergencyNotice.includes('pm')}
                      onChange={(e) => {
                        if (e.target.checked) setAssignEmergencyNotice([...assignEmergencyNotice, 'pm']);
                        else setAssignEmergencyNotice(assignEmergencyNotice.filter(v => v !== 'pm'));
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">项目经理 (Project Manager)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={assignEmergencyNotice.includes('rm')}
                      onChange={(e) => {
                        if (e.target.checked) setAssignEmergencyNotice([...assignEmergencyNotice, 'rm']);
                        else setAssignEmergencyNotice(assignEmergencyNotice.filter(v => v !== 'rm'));
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">区域负责人 (Regional Manager)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  alert('指派成功');
                  setIsAssignModalOpen(false);
                }}
                disabled={!assignEngineer}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm shadow-blue-200"
              >
                确认指派
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMapOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                {wo.assignee} 的当前位置
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
                <div className="absolute inset-0 flex items-center justify-between px-32 relative">
                  {/* Line Between Them */}
                  <div className="absolute top-1/2 left-32 right-32 h-0.5 border-t-2 border-dashed border-indigo-400 z-0">
                     <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-md text-xs font-bold text-indigo-600 border border-indigo-200 shadow-sm flex items-center gap-1 z-10 whitespace-nowrap">
                       <MapPin size={12} />
                       距离: 1.2 KM
                     </div>
                  </div>

                  {/* Store Position */}
                  <div className="relative z-10" style={{ transform: 'translateY(-10px)' }}>
                    <MapPin className="w-12 h-12 text-slate-800 drop-shadow-md relative z-10" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap">
                      门店位置
                    </div>
                  </div>

                  {/* Engineer Position */}
                  <div className="relative z-10" style={{ transform: 'translateY(-10px)' }}>
                    <div className="absolute -inset-4 bg-emerald-500/20 rounded-full animate-ping"></div>
                    <MapPin className="w-12 h-12 text-emerald-600 drop-shadow-md relative z-10" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap">
                      工程师当前GPS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat History Drawer */}
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
                  Li
                  <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#4F46E5] rounded-full shadow-sm" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-lg leading-tight">Li Jianguo</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Online</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/80">
                    <Phone size={14} />
                    <span className="text-sm font-medium">+86 138-0000-0000</span>
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
              {(chatSession?.messages || []).map((chat) => {
                const isMe = chat.senderId === 'admin' || chat.senderRole === UserRole.ADMIN;
                return (
                <div key={chat.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    {!isMe && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{chat.senderName}</span>
                        {chat.senderName.includes(' Ming Li') && (
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
                    {chat.type === 'image' && (
                      <img src={chat.content} alt="Sent" className="max-w-full rounded-lg" referrerPolicy="no-referrer" />
                    )}
                    {chat.type === 'video' && (
                      <video src={chat.content} controls className="max-w-full rounded-lg" />
                    )}
                    {chat.type === 'file' && (
                      <div className="flex items-center gap-2">
                        <Paperclip size={16} />
                        <span className="underline cursor-pointer">{chat.content}</span>
                      </div>
                    )}
                  </div>
                </div>
              )})}
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
                        onFocus={() => setIsEmojiPickerOpen(false)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full bg-white border-none rounded-lg py-2.5 pl-4 pr-10 text-sm focus:ring-0 shadow-sm"
                        placeholder=""
                      />
                      <Mic size={20} className="absolute right-3 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
                    </>
                  ) : (
                    <button className="w-full bg-white border-none rounded-lg py-2.5 text-sm font-bold text-slate-800 shadow-sm active:bg-slate-100 transition-colors">
                      按住 说话
                    </button>
                  )}
                </div>

                {/* Smiley Icon */}
                <button 
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className={`hover:scale-110 transition-transform shrink-0 ${isEmojiPickerOpen ? 'text-blue-600' : 'text-slate-800'}`}
                >
                  <Smile size={28} strokeWidth={1.5} />
                </button>

                {/* Plus Icon */}
                <button 
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsEmojiPickerOpen(false);
                  }}
                  className="text-slate-800 hover:scale-110 transition-transform shrink-0"
                >
                  <PlusCircle size={28} strokeWidth={1.5} />
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

      {/* Reassign Modal */}
      {isReassignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsReassignModalOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">工单转派 (Reassign)</h3>
              <button 
                onClick={() => setIsReassignModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {reassignCount >= maxReassignCount && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>已达到最大转派次数限制，无法继续转派。</p>
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">转派次数</label>
                <input 
                  type="text" 
                  value={`${reassignCount}/${maxReassignCount}`}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">工程师</label>
                <select 
                  value={reassignEngineer}
                  onChange={(e) => setReassignEngineer(e.target.value)}
                  disabled={reassignCount >= maxReassignCount}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">请选择工程师 (按距离推荐)</option>
                  <option value="eng1">Li Jianguo (1.2km)</option>
                  <option value="eng2">Wang Wei (2.5km)</option>
                  <option value="eng3">Zhang San (3.8km)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">操作人</label>
                  <input 
                    type="text" 
                    value={reassignOperator}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">操作时间</label>
                  <input 
                    type="text" 
                    value={reassignTime}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsReassignModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button 
                disabled={reassignCount >= maxReassignCount || !reassignEngineer}
                onClick={() => {
                  alert('转派成功');
                  setIsReassignModalOpen(false);
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                确认转派
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Complete Modal */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCompleteModalOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">工单完成 (Complete)</h3>
              <button 
                onClick={() => setIsCompleteModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">解决方式</label>
                <select 
                  value={closureMethod}
                  onChange={(e) => setClosureMethod(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="">请选择解决方式</option>
                  <option value="onsite">现场 (On-site)</option>
                  <option value="remote">远程 (Remote)</option>
                  <option value="phone">电话 (Phone)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">解决方案</label>
                <select 
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="">请选择解决方案</option>
                  <option value="hw_repair">硬件维修 (Hardware Repair)</option>
                  <option value="hw_replace">硬件更换 (Hardware Replacement)</option>
                  <option value="sw_debug">软件调试 (Software Debug)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">完成人</label>
                  <input 
                    type="text" 
                    value={completeOperator}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">完成时间</label>
                  <input 
                    type="text" 
                    value={completeTime}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsCompleteModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button 
                disabled={!closureMethod || !solution}
                onClick={() => {
                  alert('工单已完成');
                  setIsCompleteModalOpen(false);
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                确认完成
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
