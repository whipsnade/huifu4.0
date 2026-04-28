import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Headset, 
  PieChart, 
  Activity, 
  Home, 
  Wrench, 
  FileText, 
  DollarSign, 
  Box, 
  Truck, 
  Briefcase, 
  Users, 
  Settings, 
  BarChart3, 
  Book,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ChevronLeft,
  Shield,
  TrendingUp,
  Workflow,
  LayoutTemplate,
  ListTodo,
  ClipboardList,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewState } from '../types';

interface SidebarProps {
  activeView: ViewState;
  onViewChange: (viewId: ViewState) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onClose: () => void;
}

const menuItems = [
  {
    section: '概览',
    items: [
      { name: '仪表盘', icon: LayoutGrid, id: ViewState.DASHBOARD },
      { name: '客户支持', icon: Headset, id: ViewState.CUSTOMER_SUPPORT },
    ]
  },
  {
    section: '数据分析',
    items: [
      {
        name: '数据洞察',
        icon: PieChart,
        id: 'insights',
        subItems: [
          { name: '设备概况', icon: Activity, id: ViewState.ANALYTICS_DEVICES },
          { name: '门店概况', icon: Home, id: ViewState.ANALYTICS_STORES },
          { name: '工程师概况', icon: Wrench, id: ViewState.ANALYTICS_ENGINEERS },
          { name: '工单分析', icon: FileText, id: ViewState.ANALYTICS_WORK_ORDERS },
          { name: '收入分析', icon: DollarSign, id: ViewState.ANALYTICS_REVENUE },
          { name: '备件分析', icon: Box, id: ViewState.ANALYTICS_SPARE_PARTS },
          { name: '供应商服务', icon: Truck, id: ViewState.ANALYTICS_VENDORS },
          { name: '客户分析', icon: Briefcase, id: ViewState.ANALYTICS_CUSTOMERS },
        ]
      }
    ]
  },
  {
    section: '人员',
    items: [
      { name: '客户管理', icon: Users, id: ViewState.CUSTOMERS },
      { name: '门店', icon: Home, id: ViewState.STORES },
      { name: '工程师', icon: Wrench, id: ViewState.ENGINEERS },
      { name: '供应商', icon: Truck, id: ViewState.VENDORS },
    ]
  },
  {
    section: '运营',
    items: [
      { 
        name: '设备管理', 
        icon: Settings, 
        id: 'devices_menu',
        subItems: [
          { name: '设备配置', icon: Settings, id: ViewState.DEVICES },
        ]
      },
      {
        name: '定价规则',
        icon: BarChart3,
        id: 'pricing_menu',
        subItems: [
          { name: '工程师定价规则', icon: BarChart3, id: ViewState.PRICING_ENGINEER },
          { name: 'SLA 定价规则', icon: FileText, id: ViewState.PRICING_SLA },
          { name: '设备定价规则', icon: Box, id: ViewState.PRICING_DEVICE },
          { name: '工程师奖惩规则', icon: Settings, id: ViewState.PRICING_ENG_PENALTY },
        ]
      },
      { name: '客户SLA', icon: FileText, id: ViewState.CUSTOMER_SLA },
      { name: '知识库', icon: Book, id: ViewState.KNOWLEDGE_BASE },
      {
        name: '工单通知配置',
        icon: Settings,
        id: 'notification_config_menu',
        subItems: [
          { name: '邮件通知配置', icon: Settings, id: ViewState.NOTIFICATION_CONFIG },
          { name: '邮件通知模板', icon: FileText, id: ViewState.EMAIL_TEMPLATES },
        ]
      },
      {
        name: '工程类工单管理',
        icon: Briefcase,
        id: 'engineering_work_order_menu',
        subItems: [
          { name: '工程类工单', icon: FileText, id: ViewState.ENGINEERING_WORK_ORDERS },
          { name: '客户工单配置', icon: Settings, id: ViewState.CUSTOMER_WORK_ORDER_CONFIG },
          { name: '工程基础配置', icon: Settings, id: ViewState.ENGINEERING_BASIC_CONFIG },
        ]
      },
      {
        name: '费用管理',
        icon: DollarSign,
        id: 'expense_management_menu',
        subItems: [
          { name: '工单支付审批', icon: FileText, id: ViewState.EXPENSE_PAYMENT_APPROVAL },
          { name: '工单费用变更审批', icon: FileText, id: ViewState.EXPENSE_CHANGE_APPROVAL },
          { name: '费用充值', icon: DollarSign, id: ViewState.CUS_ACCOUNT_REFILL_CONFIG },
        ]
      },
      {
        name: '业务流程管理',
        icon: Activity,
        id: 'business_process_menu',
        subItems: [
          { name: '工单费用变更流程', icon: FileText, id: ViewState.BUSINESS_PROCESS_FEE_CHANGE },
          { name: '工单支付审批流程', icon: FileText, id: ViewState.BUSINESS_PROCESS_PAYMENT_APPROVAL },
        ]
      },
      {
        name: '账号管理',
        icon: Users,
        id: 'account_management_menu',
        subItems: [
          { name: '账号列表', icon: Users, id: ViewState.ACCOUNT_LIST },
          { name: '角色与权限', icon: Shield, id: ViewState.ROLES_PERMISSIONS },
        ]
      },
      {
        name: '客户报表管理',
        icon: BarChart3,
        id: 'customer_reports_menu',
        subItems: [
          { name: '客户通用报表', icon: FileText, id: ViewState.CUS_GENERAL_REPORT },
          { name: '客户自定义报表', icon: ListTodo, id: ViewState.CUS_CUSTOMIZE_REPORT_DASHBOARD },
        ]
      },
      { name: '工单总览', icon: ClipboardList, id: ViewState.VENDOR_CASE_OVERVIEW }
    ]
  },
  {
    section: '客户配置',
    items: [
      { name: '项目通知配置', icon: Settings, id: ViewState.PROJECT_NOTIFICATION_CONFIG },
      { name: '表单管理', icon: FileText, id: 'form_management_menu', subItems: [ 
        { name: '表单模板列表', icon: ClipboardList, id: ViewState.FORM_TEMPLATE_LIST },
        { name: '表单定义', icon: FileText, id: ViewState.FORM_DEFINITION }
      ] },
      { name: '设备报修分类与案件等级', icon: ListTodo, id: ViewState.CUS_BASIC_BUSINESS_DASHBOARD },
      { name: '客户门店与案件等级', icon: ListTodo, id: ViewState.CUS_STORE_AND_PRIORITY_CONFIG },
      { name: '工单逻辑配置列表', icon: ListTodo, id: ViewState.BASIC_BUSINESS_PROCESS_LIST },
      { name: '派单组配置', icon: Users, id: ViewState.DISPATCH_GROUP_CONFIG },
      { name: '客户结案类型与解决方案', icon: FileText, id: ViewState.CLOSURE_TYPE_CONFIG },
      { name: '设备报修分类配置', icon: FileText, id: ViewState.REPAIR_CATEGORY_CONFIG },
      { name: '客户认证名称配置', icon: Settings, id: ViewState.COGNITIVE_NAME_CONFIG_CUSTOMER },
      { name: '区域设置', icon: Settings, id: ViewState.REGION_SETTINGS },
      { name: '案件等级配置', icon: Settings, id: ViewState.CASE_LEVEL_CONFIG },
      { name: 'zone设置', icon: Settings, id: ViewState.ZONE_SETTINGS },
      { name: '用户品牌设置', icon: Settings, id: ViewState.USER_BRAND_SETTINGS },
    ]
  },
  {
    section: '系统设置',
    items: [
      { name: '结案类型与解决方案', icon: FileText, id: ViewState.SYS_CLOSURE_CONFIG },
      { name: '字典配置', icon: Book, id: ViewState.DICTIONARY_CONFIG },
      { name: '发送邮箱SMTP设置', icon: Settings, id: ViewState.SMTP_SETTINGS },
      { name: '服务技能配置', icon: Wrench, id: ViewState.SERVICE_SKILL_CONFIG },
      { name: '行业与认证名称配置', icon: Settings, id: ViewState.COGNITIVE_NAME_CONFIG_SYSTEM },
      {
        name: '设备配置',
        icon: Box,
        id: 'system_device_config_menu',
        subItems: [
          { name: '设备分类与品牌配置', icon: Box, id: ViewState.DEVICE_CATEGORY_BRAND_CONFIG },
        ]
      },
      { name: '繁忙度设置', icon: Activity, id: ViewState.BUSYNESS_SETTINGS },
      { name: '工程师满意度配置', icon: Star, id: ViewState.ENG_SATISFACTION_CONFIG },
      { name: '工程师信用分配置', icon: Shield, id: ViewState.ENG_CREDIT_CONFIG },
      { name: '工单任务清单设置', icon: ClipboardList, id: ViewState.CUS_CASE_CHECKLIST_CONFIG },
      { name: '工程师升级配置', icon: TrendingUp, id: ViewState.ENG_PROMOTE_CONFIG },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isCollapsed, setIsCollapsed, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['insights']);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 260 }}
      exit={{ x: -300 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="h-screen bg-white border-r border-slate-100 flex flex-col sticky top-0 overflow-hidden z-50"
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="whitespace-nowrap"
            >
              <h1 className="text-xl font-bold text-slate-900 leading-tight">iService</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">管理后台</p>
            </motion.div>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
              title="折叠菜单"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-400 transition-colors"
              title="隐藏菜单"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isCollapsed && (
        <div className="flex flex-col items-center gap-2 px-6 mb-4">
          <button 
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
            title="展开菜单"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-400 transition-colors"
            title="隐藏菜单"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-4 custom-scrollbar">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && (
              <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {section.section}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.subItems) {
                        toggleSection(item.id as string);
                      } else {
                        onViewChange(item.id as ViewState);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                      activeView === item.id 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${
                      activeView === item.id 
                        ? 'text-indigo-600' 
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">{item.name}</span>
                        {item.subItems && (
                          expandedSections.includes(item.id) 
                            ? <ChevronDown className="w-4 h-4" /> 
                            : <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                  
                  {/* Sub Items */}
                  {!isCollapsed && item.subItems && expandedSections.includes(item.id) && (
                    <div className="mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => onViewChange(subItem.id as ViewState)}
                          className={`w-full flex items-center gap-3 px-4 py-2 pl-12 transition-all group ${
                            activeView === subItem.id 
                              ? 'text-indigo-600 font-semibold' 
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <subItem.icon className={`w-4 h-4 ${
                            activeView === subItem.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                          }`} />
                          <span className="text-sm">{subItem.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Admin" 
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">管理员</p>
              <p className="text-[10px] text-slate-400 truncate">admin@smartfix.io</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
