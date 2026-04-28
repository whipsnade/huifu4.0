export enum UserRole {
  ADMIN = 'ADMIN',
  ENGINEER = 'ENGINEER',
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR'
}

export enum Complexity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
  URGENT = 'Urgent'
}

export enum CustomerLevel {
  STANDARD = 'Standard',
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum'
}

export enum VendorLevel {
  TIER_1 = 'Tier 1',
  TIER_2 = 'Tier 2',
  TIER_3 = 'Tier 3',
  PARTNER = 'Strategic Partner'
}

export interface Store {
  id: string;
  storeNumber: string;
  name: string;
  address: string;
  phone: string;
  market?: string;
  brand?: string;
  timezone?: string;
  businessHours?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive' | 'Busy' | 'Applicant' | 'Interviewing' | 'Onboarding' | 'Rejected';
  lastActive: string;
  avatar?: string;
  specialization?: string; // For engineers
  company?: string; // For vendors/customers or engineers
  parentId?: string; // For sub-vendors
  subVendors?: User[]; // For nested vendors
  supportedDeviceIds?: string[]; // For vendors
  // Extended Engineer Profile
  age?: number;
  city?: string;
  csat?: number; // 1.0 - 5.0
  busyRate?: number; // 0 - 100%
  level?: 'Junior' | 'Mid' | 'Senior' | 'Expert';
  hourlyRate?: number;
  certifications?: string[];
  recentCustomers?: { name: string; date: string; project: string }[];
  totalIncome?: number;
  phoneNumber?: string;
  idCardUrl?: string;
  engType?: '个人工程师' | '供应商工程师';
  district?: string;
  serviceStations?: string[];
  
  // Extended Customer Profile
  joinDate?: string;
  storeCount?: number;
  recentOrderCount?: number; // Last 3 months
  totalSpending?: number;
  customerLevel?: CustomerLevel;
  address?: string;
  adminPhone?: string;
  discountRate?: number; // Percentage
  businessLicenseUrl?: string;
  enterpriseType?: '连锁企业' | '个人企业';
  brands?: string[];
  stores?: Store[];
  vendors?: string[]; // Array of vendor IDs
  isIndividualStoreCustomer?: boolean;
  contractValidity?: string; // e.g., "2023-02-01 ~ 2026-01-31"
  region?: string;
  totalPoints?: number;

  // Extended Vendor Profile
  vendorLevel?: VendorLevel;
  registeredEngineers?: number;
  onlineEngineers?: number;
  totalRevenue?: number;
  commissionRate?: number; // Percentage
  
  // Recruitment Specific
  applicationDate?: string;
  matchScore?: number; // 0-100
  resumeUrl?: string;
}

export interface DeviceBrand {
  id: string;
  name: string;
  models: string[];
}

export interface DeviceCategory {
  id: string;
  name: string;
  icon: string;
  brands?: DeviceBrand[];
  faults: DeviceFault[];
}

export interface DeviceFault {
  id: string;
  name: string;
  commonSolutions: Solution[];
}

export interface Solution {
  id: string;
  description: string;
  complexity: Complexity;
  basePrice: number;
  estimatedTimeMin: number;
}

export interface WorkOrder {
  id: string;
  title: string;
  customer: string;
  storeId?: string;
  storeName?: string;
  storeNumber?: string;
  market?: string;
  brand?: string;
  device?: string; // Missing device
  category?: string; // 工单分类
  repairCategory?: string; // 报修分类
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | '服务台处理中' | '逾期' | '逾期预警' | '工程师已接单' | '待上门' | '已回单' | '已关闭' | '停表' | '无人接单' | '停表待审核' | '变更待审核';
  caseLevel?: string; // 案件等级
  engineer: string;
  date: string;
  amount: number;
  complexity: Complexity;
  overdueStatus?: 'Normal' | 'Warning' | 'Overdue';
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  views: number;
  lastUpdated: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CUSTOMERS = 'CUSTOMERS',
  STORES = 'STORES',
  ENGINEERS = 'ENGINEERS',
  VENDORS = 'VENDORS',
  DEVICES = 'DEVICES',
  PRICING_ENGINEER = 'PRICING_ENGINEER',
  PRICING_SLA = 'PRICING_SLA',
  PRICING_DEVICE = 'PRICING_DEVICE',
  PRICING_ENG_PENALTY = 'PRICING_ENG_PENALTY',
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
  CUSTOMER_SLA = 'CUSTOMER_SLA',
  
  // Data Insights
  ANALYTICS_DEVICES = 'ANALYTICS_DEVICES',
  ANALYTICS_STORES = 'ANALYTICS_STORES',
  ANALYTICS_ENGINEERS = 'ANALYTICS_ENGINEERS',
  ANALYTICS_WORK_ORDERS = 'ANALYTICS_WORK_ORDERS',
  ANALYTICS_REVENUE = 'ANALYTICS_REVENUE',
  ANALYTICS_SPARE_PARTS = 'ANALYTICS_SPARE_PARTS',
  ANALYTICS_VENDORS = 'ANALYTICS_VENDORS',
  ANALYTICS_CUSTOMERS = 'ANALYTICS_CUSTOMERS',
  TICKET_VIEW = 'TICKET_VIEW',
  WORK_ORDER_DETAIL = 'WORK_ORDER_DETAIL',
  NOTIFICATION_CONFIG = 'NOTIFICATION_CONFIG',
  EMAIL_TEMPLATES = 'EMAIL_TEMPLATES',
  ENGINEERING_WORK_ORDERS = 'ENGINEERING_WORK_ORDERS',
  CUSTOMER_WORK_ORDER_CONFIG = 'CUSTOMER_WORK_ORDER_CONFIG',
  ENGINEERING_BASIC_CONFIG = 'ENGINEERING_BASIC_CONFIG',
  EXPENSE_PAYMENT_APPROVAL = 'EXPENSE_PAYMENT_APPROVAL',
  EXPENSE_CHANGE_APPROVAL = 'EXPENSE_CHANGE_APPROVAL',
  BUSINESS_PROCESS_FEE_CHANGE = 'BUSINESS_PROCESS_FEE_CHANGE',
  BUSINESS_PROCESS_PAYMENT_APPROVAL = 'BUSINESS_PROCESS_PAYMENT_APPROVAL',
  ACCOUNT_LIST = 'ACCOUNT_LIST',
  ROLES_PERMISSIONS = 'ROLES_PERMISSIONS',
  VENDOR_CASE_OVERVIEW = 'VENDOR_CASE_OVERVIEW',

  // Customer Configuration
  PROJECT_NOTIFICATION_CONFIG = 'PROJECT_NOTIFICATION_CONFIG',
  FORM_DEFINITION = 'FORM_DEFINITION',
  DISPATCH_GROUP_CONFIG = 'DISPATCH_GROUP_CONFIG',
  CLOSURE_TYPE_CONFIG = 'CLOSURE_TYPE_CONFIG',
  REPAIR_CATEGORY_CONFIG = 'REPAIR_CATEGORY_CONFIG',
  COGNITIVE_NAME_CONFIG_CUSTOMER = 'COGNITIVE_NAME_CONFIG_CUSTOMER',
  REGION_SETTINGS = 'REGION_SETTINGS',
  CASE_LEVEL_CONFIG = 'CASE_LEVEL_CONFIG',
  ENGINEER_PENALTY_CONFIG = 'ENGINEER_PENALTY_CONFIG',
  ZONE_SETTINGS = 'ZONE_SETTINGS',
  USER_BRAND_SETTINGS = 'USER_BRAND_SETTINGS',
  WORK_ORDER_SETTINGS = 'WORK_ORDER_SETTINGS',
  FORM_TEMPLATE_LIST = 'FORM_TEMPLATE_LIST',
  CUS_BASIC_BUSINESS_PROCESS = 'CUS_BASIC_BUSINESS_PROCESS',
  CUS_BASIC_BUSINESS_TEMPLATE = 'CUS_BASIC_BUSINESS_TEMPLATE',
  CUS_BASIC_BUSINESS_DASHBOARD = 'CUS_BASIC_BUSINESS_DASHBOARD',
  CUS_STORE_AND_PRIORITY_CONFIG = 'CUS_STORE_AND_PRIORITY_CONFIG',

  // System Settings
  SYS_CLOSURE_CONFIG = 'SYS_CLOSURE_CONFIG',
  DICTIONARY_CONFIG = 'DICTIONARY_CONFIG',
  SMTP_SETTINGS = 'SMTP_SETTINGS',
  SERVICE_SKILL_CONFIG = 'SERVICE_SKILL_CONFIG',
  COGNITIVE_NAME_CONFIG_SYSTEM = 'COGNITIVE_NAME_CONFIG_SYSTEM',
  DEVICE_CATEGORY_BRAND_CONFIG = 'DEVICE_CATEGORY_BRAND_CONFIG',
  DEVICE_TYPE_CONFIG = 'DEVICE_TYPE_CONFIG',
  DEVICE_BRAND_CONFIG = 'DEVICE_BRAND_CONFIG',
  DEVICE_MODEL_CONFIG = 'DEVICE_MODEL_CONFIG',
  BUSYNESS_SETTINGS = 'BUSYNESS_SETTINGS',
  ENG_PROMOTE_CONFIG = 'ENG_PROMOTE_CONFIG',
  BASIC_BUSINESS_PROCESS = 'BASIC_BUSINESS_PROCESS',
  BASIC_BUSINESS_PROCESS_LIST = 'BASIC_BUSINESS_PROCESS_LIST',
  BASIC_BUSINESS_PROCESS_DESIGN = 'BASIC_BUSINESS_PROCESS_DESIGN',
  BASIC_BUSINESS_TEMPLATE = 'BASIC_BUSINESS_TEMPLATE',
  BASIC_BUSINESS_DASHBOARD = 'BASIC_BUSINESS_DASHBOARD',
  ENG_SATISFACTION_CONFIG = 'ENG_SATISFACTION_CONFIG',
  ENG_CREDIT_CONFIG = 'ENG_CREDIT_CONFIG',
  CUS_CASE_CHECKLIST_CONFIG = 'CUS_CASE_CHECKLIST_CONFIG',
  CUS_ACCOUNT_REFILL_CONFIG = 'CUS_ACCOUNT_REFILL_CONFIG',
  CUS_GENERAL_REPORT = 'CUS_GENERAL_REPORT',
  CUS_CUSTOMIZE_REPORT = 'CUS_CUSTOMIZE_REPORT',
  CUS_CUSTOMIZE_REPORT_DASHBOARD = 'CUS_CUSTOMIZE_REPORT_DASHBOARD'
}

// Chat Types
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'system' | 'work_order';
  meta?: any;
}

export interface ChatSession {
  id: string;
  customerName: string;
  engineerName?: string;
  workOrderId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'resolved';
  messages: ChatMessage[];
}

export interface Option {
  id: string;
  label: string;
  fieldId: string;
  children?: Option[];
  parentId?: string;
  type?: 'category' | 'attribute'; // Useful for distinction in flat list
}

export interface Field {
  id: string;
  name: string;
  options: Option[];
  isTree?: boolean;
  type?: 'select' | 'number';
  defaultValue?: number;
}

export interface LogicNode {
  id: string;
  fieldId: string;
  selectedOptionIds: string[]; // Changed from optionId to support multi-select
  value?: number; // Support numeric values for 'number' type fields
}

export interface LogicGroup {
  id: string;
  name: string;
  nodes: LogicNode[];
}

export type ProcessStatus = 'published' | 'draft' | 'deprecated';

export interface Process {
  id: string;
  customerName: string;
  processName: string;
  status: ProcessStatus;
  version: string;
  creator: string;
  groups: LogicGroup[];
  updatedAt: string;
  createdAt: string;
}

export interface CustomerRegion {
  id: string;
  customerName: string;
  regionName: string;
  markets: string[];
  continentCountry?: string;
  country?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface AssigneeGroup {
  id: string;
  customerName: string;
  groupName: string;
  type: 'Service Desk' | 'Supplier';
  members: string[]; // List of names or emails
  createdAt: string;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  width: '1/4' | '1/3' | '1/2' | '2/3' | '3/4' | 'full';
  options?: string[];
}

export interface FormTemplate {
  id: string;
  name: string;
  version: string;
  status: 'Published' | 'Unpublished' | 'Deprecated';
  createdAt: string;
  creator: string;
  fields: FormField[];
}
