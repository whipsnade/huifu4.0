import { User, UserRole, DeviceCategory, Complexity, WorkOrder, KnowledgeArticle, CustomerLevel, VendorLevel, ChatSession } from './types';

// Mock Users
export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Alice Freeman', 
    email: 'alice@acme.com', 
    role: UserRole.CUSTOMER, 
    status: 'Active', 
    lastActive: '2 分钟前', 
    company: 'Acme Corp',
    joinDate: '2022-03-15',
    storeCount: 12,
    recentOrderCount: 45,
    totalSpending: 125000,
    customerLevel: CustomerLevel.GOLD,
    enterpriseType: '连锁企业',
    address: '123 Market St, Chicago, IL',
    adminPhone: '+1 (555) 010-1234',
    discountRate: 10,
    stores: [
      { id: 's1', storeNumber: 'ST-001', name: 'Acme 市中心店', address: '123 Main St', phone: '555-1111' },
      { id: 's2', storeNumber: 'ST-002', name: 'Acme 北区店', address: '456 North Ave', phone: '555-2222' }
    ]
  },
  { 
    id: '2', 
    name: 'Bob Smith', 
    email: 'bob@fixit.com', 
    role: UserRole.ENGINEER, 
    status: 'Busy', 
    lastActive: '1 小时前', 
    specialization: 'POS & KDS 专家',
    company: 'SmartFix 内部团队',
    level: 'Senior',
    hourlyRate: 95,
    totalIncome: 85400,
    joinDate: '2021-04-10',
    recentOrderCount: 42,
    age: 34,
    city: '芝加哥, IL',
    phoneNumber: '+1 (312) 555-0101',
    csat: 4.8,
    busyRate: 85,
    engType: '个人工程师',
    certifications: ['Toshiba POS 认证', 'CompTIA Network+', 'Low Voltage Safety'],
    recentCustomers: [
      { name: 'Acme Corp', date: '2023-10-01', project: 'POS系统升级' },
      { name: 'Wayne Ent', date: '2023-09-28', project: 'KDS安装' }
    ]
  },
  {
    id: 'mock-indiv-cust',
    name: '王老板的便利店',
    company: '王老板的便利店',
    email: '',
    role: UserRole.CUSTOMER,
    status: 'Active',
    lastActive: '刚刚',
    joinDate: new Date().toISOString().split('T')[0],
    storeCount: 1,
    recentOrderCount: 0,
    totalSpending: 0,
    address: '朝阳路123号',
    adminPhone: '13800138000',
    customerLevel: CustomerLevel.STANDARD,
    discountRate: 0,
    enterpriseType: '个人企业',
    isIndividualStoreCustomer: true,
    stores: [{
      id: 'mock-indiv-store',
      storeNumber: 'ST-9999',
      name: '王老板的便利店',
      address: '朝阳路123号',
      phone: '13800138000'
    }]
  },
  { 
    id: '3', 
    name: 'Global Parts Ltd', 
    email: 'contact@globalparts.com', 
    role: UserRole.VENDOR, 
    status: 'Active', 
    lastActive: '1 天前', 
    company: 'Global Parts Ltd',
    joinDate: '2021-05-20',
    vendorLevel: VendorLevel.PARTNER,
    registeredEngineers: 150,
    onlineEngineers: 42,
    recentOrderCount: 320,
    totalRevenue: 1250000,
    address: '88 Industrial Way, Houston, TX',
    adminPhone: '+1 (713) 555-0199',
    commissionRate: 12,
    supportedDeviceIds: ['POS 系统', 'KDS', '打印机', '笔记本电脑', '平板电脑']
  },
  { 
    id: '4', 
    name: 'Diana Prince', 
    email: 'diana@wayne.com', 
    role: UserRole.CUSTOMER, 
    status: 'Inactive', 
    lastActive: '1 个月前', 
    company: 'Wayne Enterprises',
    joinDate: '2021-06-10',
    storeCount: 54,
    recentOrderCount: 12,
    totalSpending: 850000,
    customerLevel: CustomerLevel.PLATINUM,
    address: '1007 Mountain Dr, Gotham, NJ',
    adminPhone: '+1 (555) 099-9999',
    discountRate: 15,
    stores: []
  },
  { 
    id: '5', 
    name: 'Evan Wright', 
    email: 'evan@fixit.com', 
    role: UserRole.ENGINEER, 
    status: 'Active', 
    lastActive: '5 分钟前', 
    specialization: '网络工程师',
    company: 'SmartFix 内部团队',
    level: 'Mid',
    hourlyRate: 75,
    totalIncome: 62000,
    joinDate: '2022-01-15',
    recentOrderCount: 28,
    age: 29,
    city: '底特律, MI',
    phoneNumber: '+1 (313) 555-0202',
    csat: 4.5,
    busyRate: 40,
    engType: '供应商工程师',
    certifications: ['Cisco CCNA', 'Wi-Fi 专家'],
    recentCustomers: [
      { name: 'TechStart Inc', date: '2023-10-05', project: '路由器配置' },
      { name: 'Global Parts', date: '2023-10-02', project: '网络审计' }
    ]
  },
  { 
    id: '6', 
    name: 'Sarah Connor', 
    email: 'sarah@fixit.com', 
    role: UserRole.ENGINEER, 
    status: 'Inactive', 
    lastActive: '2 天前', 
    specialization: 'IT 硬件',
    company: 'Cyberdyne Contractors',
    level: 'Expert',
    hourlyRate: 150,
    totalIncome: 115000,
    joinDate: '2020-11-30',
    recentOrderCount: 15,
    age: 31,
    city: '奥斯汀, TX',
    phoneNumber: '+1 (512) 555-0303',
    csat: 4.9,
    busyRate: 10,
    engType: '个人工程师',
    certifications: ['硬件维修 I级', '电气安全'],
    recentCustomers: []
  },
  { 
    id: '7', 
    name: 'Mike Ross', 
    email: 'mike@fixit.com', 
    role: UserRole.ENGINEER, 
    status: 'Active', 
    lastActive: '30 分钟前', 
    specialization: '一般维护',
    company: 'SmartFix 内部团队',
    level: 'Junior',
    hourlyRate: 45,
    totalIncome: 32000,
    joinDate: '2023-05-10',
    recentOrderCount: 55,
    age: 24,
    city: '芝加哥, IL',
    phoneNumber: '+1 (312) 555-0404',
    csat: 4.2,
    busyRate: 60,
    engType: '个人工程师',
    certifications: ['基础 IT 支持'],
    recentCustomers: []
  },
  { 
    id: '8', 
    name: 'Jessica Jones', 
    email: 'jessica@alias.com', 
    role: UserRole.ENGINEER, 
    status: 'Busy', 
    lastActive: '4 小时前', 
    specialization: '安防系统',
    company: 'Alias Investigations',
    level: 'Senior',
    hourlyRate: 110,
    totalIncome: 98000,
    joinDate: '2021-08-22',
    recentOrderCount: 38,
    age: 32,
    city: '纽约, NY',
    phoneNumber: '+1 (212) 555-0505',
    csat: 4.7,
    busyRate: 90,
    certifications: ['认证安防专家', 'CCTV 安装'],
    recentCustomers: []
  },
  { 
    id: '9', 
    name: 'Luke Cage', 
    email: 'luke@harlem.com', 
    role: UserRole.ENGINEER, 
    status: 'Active', 
    lastActive: '1 天前', 
    specialization: '重型设备',
    company: 'Heroes for Hire',
    level: 'Expert',
    hourlyRate: 130,
    totalIncome: 105000,
    joinDate: '2020-03-12',
    recentOrderCount: 22,
    age: 36,
    city: '纽约, NY',
    phoneNumber: '+1 (212) 555-0606',
    csat: 5.0,
    busyRate: 20,
    certifications: ['设备搬运', '安全第一认证'],
    recentCustomers: []
  },
  { 
    id: '10', 
    name: 'Danny Rand', 
    email: 'danny@rand.com', 
    role: UserRole.ENGINEER, 
    status: 'Inactive', 
    lastActive: '1 周前', 
    specialization: '电气系统',
    company: 'Rand Enterprises',
    level: 'Mid',
    hourlyRate: 85,
    totalIncome: 54000,
    joinDate: '2022-09-18',
    recentOrderCount: 18,
    age: 28,
    city: '纽约, NY',
    phoneNumber: '+1 (212) 555-0707',
    csat: 4.0,
    busyRate: 0,
    certifications: ['高级电工'],
    recentCustomers: []
  },
  { 
    id: '11', 
    name: 'Tony Stark', 
    email: 'tony@stark.com', 
    role: UserRole.ENGINEER, 
    status: 'Busy', 
    lastActive: '1 分钟前', 
    specialization: '系统集成',
    company: 'Stark Ind',
    level: 'Expert',
    hourlyRate: 300,
    totalIncome: 500000,
    joinDate: '2019-01-01',
    recentOrderCount: 5,
    age: 45,
    city: '马里布, CA',
    phoneNumber: '+1 (310) 555-0808',
    csat: 4.9,
    busyRate: 100,
    certifications: ['全栈工程师', 'AI 架构师'],
    recentCustomers: []
  },
  { 
    id: '12', 
    name: 'Natasha Romanoff', 
    email: 'nat@shield.com', 
    role: UserRole.ENGINEER, 
    status: 'Active', 
    lastActive: '10 分钟前', 
    specialization: '诊断专家',
    company: 'SmartFix 内部团队',
    level: 'Senior',
    hourlyRate: 100,
    totalIncome: 92000,
    joinDate: '2021-02-14',
    recentOrderCount: 48,
    age: 33,
    city: '华盛顿, DC',
    phoneNumber: '+1 (202) 555-0909',
    csat: 4.8,
    busyRate: 75,
    certifications: ['诊断专家认证'],
    recentCustomers: []
  },
  { 
    id: '13', 
    name: 'TechStart Inc', 
    email: 'contact@techstart.io', 
    role: UserRole.CUSTOMER, 
    status: 'Active', 
    lastActive: '3 天前', 
    company: 'TechStart Inc',
    joinDate: '2023-01-20',
    storeCount: 3,
    recentOrderCount: 8,
    totalSpending: 15400,
    customerLevel: CustomerLevel.STANDARD,
    address: '404 Innovation Blvd, San Jose, CA',
    adminPhone: '+1 (408) 555-0100',
    discountRate: 0,
    stores: []
  },
  { 
    id: '14', 
    name: 'RapidFix Services', 
    email: 'dispatch@rapidfix.com', 
    role: UserRole.VENDOR, 
    status: 'Active', 
    lastActive: '5 小时前', 
    company: 'RapidFix Services',
    joinDate: '2022-09-01',
    vendorLevel: VendorLevel.TIER_2,
    registeredEngineers: 25,
    onlineEngineers: 12,
    recentOrderCount: 85,
    totalRevenue: 150000,
    address: '12 Logistics Dr, Dallas, TX',
    adminPhone: '+1 (214) 555-0011',
    commissionRate: 15,
    supportedDeviceIds: ['路由器', '交换机', '监控摄像头', '服务器', '扫码枪']
  },
  { 
    id: '15', 
    name: 'Local Heroes LLC', 
    email: 'info@localheroes.com', 
    role: UserRole.VENDOR, 
    status: 'Inactive', 
    lastActive: '2 周前', 
    company: 'Local Heroes LLC',
    joinDate: '2023-01-15',
    vendorLevel: VendorLevel.TIER_3,
    registeredEngineers: 8,
    onlineEngineers: 0,
    recentOrderCount: 15,
    totalRevenue: 22000,
    address: '45 Main St, Smallville, KS',
    adminPhone: '+1 (316) 555-9988',
    commissionRate: 18,
    supportedDeviceIds: ['打印机', '钱箱', '电子秤', '排队机', '自助点餐机']
  },
  // RECRUITMENT APPLICANTS
  { 
    id: 'R-1', 
    name: 'John Doe', 
    email: 'john.doe@email.com', 
    role: UserRole.ENGINEER, 
    status: 'Applicant', 
    lastActive: '1 天前', 
    specialization: 'IT 支持',
    level: 'Junior',
    city: '西雅图, WA',
    phoneNumber: '+1 (206) 555-1234',
    applicationDate: '2023-10-10',
    matchScore: 85,
    certifications: ['Google IT Support']
  },
  { 
    id: 'R-2', 
    name: 'Jane Smith', 
    email: 'jane.smith@email.com', 
    role: UserRole.ENGINEER, 
    status: 'Interviewing', 
    lastActive: '3 小时前', 
    specialization: '网络工程',
    level: 'Mid',
    city: '波士顿, MA',
    phoneNumber: '+1 (617) 555-5678',
    applicationDate: '2023-10-05',
    matchScore: 92,
    certifications: ['CCNA', 'CCNP']
  },
  { 
    id: 'R-3', 
    name: 'Robert Brown', 
    email: 'robert.b@email.com', 
    role: UserRole.ENGINEER, 
    status: 'Applicant', 
    lastActive: '5 天前', 
    specialization: 'POS 维修',
    level: 'Senior',
    city: '迈阿密, FL',
    phoneNumber: '+1 (305) 555-9012',
    applicationDate: '2023-10-12',
    matchScore: 65,
    certifications: ['Toshiba Certified']
  },
  { 
    id: 'yum-cust-1', 
    name: '百胜中国 (YUM China)', 
    email: 'contact@yumchina.com', 
    role: UserRole.CUSTOMER, 
    status: 'Active', 
    lastActive: '刚刚', 
    company: 'YUM',
    joinDate: '2023-11-20',
    storeCount: 1,
    recentOrderCount: 5,
    totalSpending: 250000,
    customerLevel: CustomerLevel.PLATINUM,
    enterpriseType: '连锁企业',
    region: '华东大区',
    brands: ['肯德基', '必胜客', '塔可贝尔', '东方既白'],
    contractValidity: '2023-02-01 ~ 2026-01-31',
    address: '上海市徐汇区虹桥路',
    adminPhone: '+86 21 1234 5678',
    discountRate: 15,
    totalPoints: 5250,
    stores: [
      { id: 'yum-store-001', storeNumber: 'YUM-SH-001', name: '百胜 虹桥路店', address: '上海市虹桥路1号', phone: '021-87654321' }
    ]
  },
  { 
    id: 'yum-vend-1', 
    name: '百胜运维服务 (YUM Ops)', 
    email: 'ops@yum.com', 
    role: UserRole.VENDOR, 
    status: 'Active', 
    lastActive: '2 小时前', 
    company: 'YUM',
    joinDate: '2023-11-20',
    vendorLevel: VendorLevel.PARTNER,
    registeredEngineers: 300,
    onlineEngineers: 150,
    recentOrderCount: 500,
    totalRevenue: 5000000,
    address: '上海市徐汇区',
    adminPhone: '+86 21 0000 0000',
    commissionRate: 10,
    supportedDeviceIds: ['POS 系统', 'KDS', '打印机']
  }
];

// Mock Devices Hierarchy
export const MOCK_DEVICES: DeviceCategory[] = [
  {
    id: 'd1',
    name: 'POS 系统',
    icon: 'Monitor',
    brands: [
      { id: 'b1', name: 'Hisense', models: ['HK500', 'HK716', 'HK900'] },
      { id: 'b2', name: 'Sunmi', models: ['T2', 'T2s', 'D2s'] },
      { id: 'b3', name: 'Zonerich', models: ['ZQ-T8350', 'ZQ-T8356'] }
    ],
    faults: [
      {
        id: 'f1',
        name: '触摸屏失灵',
        commonSolutions: [
          { id: 's1', description: '更换屏幕组件', complexity: Complexity.MEDIUM, basePrice: 200, estimatedTimeMin: 60 },
          { id: 's2', description: '校准屏幕', complexity: Complexity.LOW, basePrice: 50, estimatedTimeMin: 30 }
        ]
      },
      {
        id: 'f2',
        name: '无法启动',
        commonSolutions: [
          { id: 's3', description: '主板维修', complexity: Complexity.HIGH, basePrice: 450, estimatedTimeMin: 120 }
        ]
      }
    ]
  },
  {
    id: 'd2',
    name: 'KDS',
    icon: 'Tv',
    brands: [
      { id: 'b4', name: 'Hisense', models: ['KDS-15', 'KDS-21'] },
      { id: 'b5', name: 'Elo', models: ['I-Series 15', 'I-Series 22'] }
    ],
    faults: [
      {
        id: 'f3',
        name: '显示花屏',
        commonSolutions: [
          { id: 's4', description: '更换控制器', complexity: Complexity.MEDIUM, basePrice: 300, estimatedTimeMin: 90 }
        ]
      }
    ]
  },
  {
    id: 'd3',
    name: '打印机',
    icon: 'Printer',
    brands: [
      { id: 'b6', name: 'Epson', models: ['TM-T88VI', 'TM-m30II'] },
      { id: 'b7', name: 'Zebra', models: ['ZD421', 'ZT230'] }
    ],
    faults: [
      {
        id: 'f4',
        name: '卡纸',
        commonSolutions: [
          { id: 's5', description: '清理滚轮', complexity: Complexity.LOW, basePrice: 80, estimatedTimeMin: 30 }
        ]
      }
    ]
  }
];

// Mock Work Orders for BI
export const MOCK_WORK_ORDERS: WorkOrder[] = [
  { id: 'WO-1001', title: 'POS 维护', customer: '百胜中国 (YUM China)', storeName: '百胜 虹桥路店', storeNumber: 'YUM-SH-001', category: '上门', repairCategory: '硬件故障', engineer: 'Bob Smith', device: 'POS机', status: 'Completed', date: '2023-10-01 10:00', amount: 450, complexity: Complexity.MEDIUM, caseLevel: 'P3' },
  { id: 'WO-1002', title: 'KDS 维修', customer: 'Wayne Ent', storeName: 'Wayne 第一工厂', storeNumber: 'WAY-FAC-001', category: '上门', repairCategory: '软件故障', engineer: 'Evan Wright', device: 'KDS', status: 'In Progress', date: '2023-10-02 14:30', amount: 1200, complexity: Complexity.HIGH, caseLevel: 'P1' },
  { id: 'WO-1003', title: '路由器配置', customer: 'Acme Corp', storeName: 'Acme 北区店', storeNumber: 'ACM-N-005', category: '远程', repairCategory: '网络故障', engineer: 'Bob Smith', device: '路由器', status: 'Completed', date: '2023-10-03 09:15', amount: 150, complexity: Complexity.LOW, caseLevel: 'P4' },
  { id: 'WO-1004', title: '打印机卡纸', customer: 'TechStart Inc', storeName: 'TechStart 总部', storeNumber: 'TCH-HQ-001', category: '上门', repairCategory: '硬件故障', engineer: 'Evan Wright', device: '打印机', status: '待上门', overdueStatus: 'Overdue', date: '2023-10-05 16:45', amount: 600, complexity: Complexity.HIGH, caseLevel: 'P2' },
  { id: 'WO-1005', title: '例行检查', customer: 'Wayne Ent', storeName: 'Wayne 第二工厂', storeNumber: 'WAY-FAC-002', category: '巡检', repairCategory: '日常维护', engineer: 'Bob Smith', device: 'POS机', status: '工程师已接单', overdueStatus: 'Warning', date: '2023-10-06 11:20', amount: 200, complexity: Complexity.LOW, caseLevel: 'P3' },
  { id: 'WO-1006', title: '系统升级', customer: '百胜中国 (YUM China)', storeName: '百胜 虹桥路店', storeNumber: 'YUM-SH-001', category: '远程', repairCategory: '软件故障', engineer: 'Natasha Romanoff', device: '服务器', status: '服务台处理中', date: '2023-10-10 08:00', amount: 800, complexity: Complexity.MEDIUM, caseLevel: 'P2' },
  { id: 'WO-1007', title: '网络修复', customer: 'Acme Corp', storeName: 'Acme 北区店', storeNumber: 'ACM-N-005', category: '上门', repairCategory: '网络故障', engineer: 'Bob Smith', device: '路由器', status: '工程师已接单', date: '2023-10-12 10:30', amount: 300, complexity: Complexity.MEDIUM, caseLevel: 'P3' },
  { id: 'WO-1008', title: '显示器更换', customer: 'TechStart Inc', storeName: 'TechStart 总部', storeNumber: 'TCH-HQ-001', category: '上门', repairCategory: '硬件故障', engineer: 'Evan Wright', device: '显示器', status: '待上门', overdueStatus: 'Warning', date: '2023-10-15 09:00', amount: 500, complexity: Complexity.MEDIUM, caseLevel: 'P1' },
  { id: 'WO-1009', title: '费用核对', customer: 'Wayne Ent', storeName: 'Wayne 第一工厂', storeNumber: 'WAY-FAC-001', category: '巡检', repairCategory: '日常维护', engineer: 'Evan Wright', device: 'POS机', status: '已回单', overdueStatus: 'Overdue', date: '2023-10-16 14:00', amount: 150, complexity: Complexity.LOW, caseLevel: 'P4' },
  // Warning cases (5)
  { id: 'WO-1010', title: '收银系统卡顿', customer: '百胜中国 (YUM China)', storeName: '百胜 虹桥路店', storeNumber: 'YUM-SH-001', category: '远程', repairCategory: '软件故障', engineer: 'Natasha Romanoff', device: '服务器', status: '服务台处理中', overdueStatus: 'Warning', date: '2026-04-24 14:30', amount: 120, complexity: Complexity.MEDIUM, caseLevel: 'P2' },
  { id: 'WO-1011', title: '厨房打印机离线', customer: 'Acme Corp', storeName: 'Acme 北区店', storeNumber: 'ACM-N-005', category: '上门', repairCategory: '硬件故障', engineer: 'Bob Smith', device: '打印机', status: '工程师已接单', overdueStatus: 'Warning', date: '2026-04-24 14:15', amount: 250, complexity: Complexity.MEDIUM, caseLevel: 'P1' },
  { id: 'WO-1012', title: '网络异常波动', customer: 'TechStart Inc', storeName: 'TechStart 总部', storeNumber: 'TCH-HQ-001', category: '上门', repairCategory: '网络故障', engineer: 'Evan Wright', device: '路由器', status: '待上门', overdueStatus: 'Warning', date: '2026-04-24 15:00', amount: 400, complexity: Complexity.HIGH, caseLevel: 'P1' },
  { id: 'WO-1013', title: '自助点餐机黑屏', customer: 'Wayne Ent', storeName: 'Wayne 第一工厂', storeNumber: 'WAY-FAC-001', category: '上门', repairCategory: '硬件故障', engineer: 'Mike Ross', device: 'POS机', status: 'In Progress', overdueStatus: 'Warning', date: '2026-04-24 13:20', amount: 350, complexity: Complexity.MEDIUM, caseLevel: 'P2' },
  { id: 'WO-1014', title: '电子秤误差修复', customer: '百胜中国 (YUM China)', storeName: '百胜 虹桥路店', storeNumber: 'YUM-SH-001', category: '上门', repairCategory: '日常维护', engineer: 'Sarah Connor', device: 'POS机', status: 'Pending', overdueStatus: 'Warning', date: '2026-04-24 14:45', amount: 180, complexity: Complexity.LOW, caseLevel: 'P3' },
  // Overdue cases (5)
  { id: 'WO-1015', title: '主服务器宕机', customer: 'Acme Corp', storeName: 'Acme 市中心店', storeNumber: 'ST-001', category: '上门', repairCategory: '硬件故障', engineer: 'Tony Stark', device: '服务器', status: '工程师已接单', overdueStatus: 'Overdue', date: '2026-04-24 08:00', amount: 2000, complexity: Complexity.CRITICAL, caseLevel: 'P1' },
  { id: 'WO-1016', title: '监控点位缺失', customer: 'Wayne Ent', storeName: 'Wayne 第二工厂', storeNumber: 'WAY-FAC-002', category: '上门', repairCategory: '硬件故障', engineer: 'Jessica Jones', device: 'POS机', status: '待上门', overdueStatus: 'Overdue', date: '2026-04-24 09:30', amount: 550, complexity: Complexity.MEDIUM, caseLevel: 'P2' },
  { id: 'WO-1017', title: '防火墙规则配置', customer: 'TechStart Inc', storeName: 'TechStart 总部', storeNumber: 'TCH-HQ-001', category: '远程', repairCategory: '软件故障', engineer: 'Evan Wright', device: '路由器', status: '服务台处理中', overdueStatus: 'Overdue', date: '2026-04-24 11:20', amount: 300, complexity: Complexity.MEDIUM, caseLevel: 'P3' },
  { id: 'WO-1018', title: '备用电源维护', customer: 'Acme Corp', storeName: 'Acme 北区店', storeNumber: 'ACM-N-005', category: '巡检', repairCategory: '日常维护', engineer: 'Luke Cage', device: 'POS机', status: '已回单', overdueStatus: 'Overdue', date: '2026-04-24 10:00', amount: 150, complexity: Complexity.LOW, caseLevel: 'P4' },
  { id: 'WO-1019', title: 'KDS 系统升级失败', customer: 'Wayne Ent', storeName: 'Wayne 第一工厂', storeNumber: 'WAY-FAC-001', category: '远程', repairCategory: '软件故障', engineer: 'Bob Smith', device: 'KDS', status: 'In Progress', overdueStatus: 'Overdue', date: '2026-04-24 11:15', amount: 450, complexity: Complexity.HIGH, caseLevel: 'P2' },
  // All (Normal) cases (5)
  { id: 'WO-1020', title: '常规硬件巡检', customer: '百胜中国 (YUM China)', storeName: '百胜 虹桥路店', storeNumber: 'YUM-SH-001', category: '巡检', repairCategory: '日常维护', engineer: 'Mike Ross', device: 'POS机', status: 'Completed', date: '2023-10-19 10:00', amount: 100, complexity: Complexity.LOW, caseLevel: 'P4' },
  { id: 'WO-1021', title: '新店设备调试', customer: 'Acme Corp', storeName: 'Acme 北区店', storeNumber: 'ACM-N-005', category: '上门', repairCategory: '硬件故障', engineer: 'Steve Rogers', device: '服务器', status: 'In Progress', date: '2023-10-19 11:30', amount: 800, complexity: Complexity.MEDIUM, caseLevel: 'P3' },
  { id: 'WO-1022', title: '网络扩容咨询', customer: 'TechStart Inc', storeName: 'TechStart 总部', storeNumber: 'TCH-HQ-001', category: '远程', repairCategory: '网络故障', engineer: 'Natasha Romanoff', device: '路由器', status: 'Pending', date: '2023-10-19 14:00', amount: 0, complexity: Complexity.LOW, caseLevel: 'P4' },
  { id: 'WO-1023', title: 'POS 机滚轮更换', customer: 'Wayne Ent', storeName: 'Wayne 第二工厂', storeNumber: 'WAY-FAC-002', category: '上门', repairCategory: '硬件故障', engineer: 'Bob Smith', device: 'POS机', status: '工程师已接单', date: '2023-10-19 15:45', amount: 120, complexity: Complexity.LOW, caseLevel: 'P3' },
  { id: 'WO-1024', title: '软件版本回退', customer: '百胜中国 (YUM China)', storeName: '百胜 虹桥路店', storeNumber: 'YUM-SH-001', category: '远程', repairCategory: '软件故障', engineer: 'Tony Stark', device: '服务器', status: '待上门', date: '2023-10-19 16:30', amount: 300, complexity: Complexity.MEDIUM, caseLevel: 'P2' },
  
  // 无人接单 Cases (5)
  { id: 'WO-1030', title: '收银机断电', customer: 'Acme Corp', storeName: 'Acme 北区店', storeNumber: 'ACM-N-005', category: '上门', repairCategory: '硬件故障', engineer: '', device: 'POS机', status: '无人接单', date: '2026-04-24 15:00', amount: 0, complexity: Complexity.HIGH, caseLevel: 'P2' },
  { id: 'WO-1031', title: '网络连接丢包', customer: 'TechStart Inc', storeName: 'TechStart 总部', storeNumber: 'TCH-HQ-001', category: '远程', repairCategory: '网络故障', engineer: '', device: '路由器', status: '无人接单', date: '2026-04-24 15:15', amount: 0, complexity: Complexity.MEDIUM, caseLevel: 'P3' },
  { id: 'WO-1032', title: '自助点餐机异响', customer: 'Wayne Ent', storeName: 'Wayne 第一工厂', storeNumber: 'WAY-FAC-001', category: '上门', repairCategory: '硬件故障', engineer: '', device: 'POS机', status: '无人接单', date: '2026-04-24 15:30', amount: 0, complexity: Complexity.LOW, caseLevel: 'P4' },
  { id: 'WO-1033', title: '打印机缺纸报警', customer: '百胜中国 (YUM China)', storeName: '百胜 虹桥路店', storeNumber: 'YUM-SH-001', category: '巡检', repairCategory: '日常维护', engineer: '', device: '打印机', status: '无人接单', date: '2026-04-24 15:45', amount: 0, complexity: Complexity.LOW, caseLevel: 'P3' },
  { id: 'WO-1034', title: '仓库摄像头离线', customer: 'Acme Corp', storeName: 'Acme 市中心店', storeNumber: 'ST-001', category: '上门', repairCategory: '硬件故障', engineer: '', device: 'POS机', status: '无人接单', date: '2026-04-24 15:30', amount: 0, complexity: Complexity.MEDIUM, caseLevel: 'P2' },

  // 停表待审核 Cases (5)
  { id: 'WO-1040', title: '空调维保审核', customer: 'Wayne Ent', storeName: 'Wayne 第二工厂', storeNumber: 'WAY-FAC-002', category: '上门', repairCategory: '日常维护', engineer: 'Bob Smith', device: 'POS机', status: '停表待审核', date: '2026-04-24 16:00', amount: 500, complexity: Complexity.MEDIUM, caseLevel: 'P3' },
  { id: 'WO-1041', title: '支付网关调整', customer: '百胜中国 (YUM China)', storeName: '百胜 虹桥路店', storeNumber: 'YUM-SH-001', category: '远程', repairCategory: '软件故障', engineer: 'Natasha Romanoff', device: '服务器', status: '停表待审核', date: '2026-04-24 16:15', amount: 200, complexity: Complexity.LOW, caseLevel: 'P2' },
  { id: 'WO-1042', title: '显示屏支架更换', customer: 'Acme Corp', storeName: 'Acme 北区店', storeNumber: 'ACM-N-005', category: '上门', repairCategory: '硬件故障', engineer: 'Mike Ross', device: 'POS机', status: '停表待审核', date: '2026-04-24 16:10', amount: 150, complexity: Complexity.LOW, caseLevel: 'P4' },
  { id: 'WO-1043', title: '主站数据库扩容', customer: 'TechStart Inc', storeName: 'TechStart 总部', storeNumber: 'TCH-HQ-001', category: '远程', repairCategory: '软件故障', engineer: 'Evan Wright', device: '服务器', status: '停表待审核', date: '2026-04-24 16:10', amount: 800, complexity: Complexity.HIGH, caseLevel: 'P1' },
  { id: 'WO-1044', title: '网络波动检测', customer: 'Wayne Ent', storeName: 'Wayne 第一工厂', storeNumber: 'WAY-FAC-001', category: '巡检', repairCategory: '网络故障', engineer: 'Bob Smith', device: '路由器', status: '停表待审核', date: '2026-04-24 16:00', amount: 0, complexity: Complexity.LOW, caseLevel: 'P3' },

  // 工单变更待审核 Cases (5)
  { id: 'WO-1050', title: '追加人工费用', customer: '百胜中国 (YUM China)', storeName: '百胜 虹桥路店', storeNumber: 'YUM-SH-001', category: '上门', repairCategory: '硬件故障', engineer: 'Steve Rogers', device: 'POS机', status: '变更待审核', date: '2026-04-24 16:15', amount: 1200, complexity: Complexity.HIGH, caseLevel: 'P2' },
  { id: 'WO-1051', title: '服务范围调整', customer: 'Acme Corp', storeName: 'Acme 市中心店', storeNumber: 'ST-001', category: '上门', repairCategory: '硬件故障', engineer: 'Tony Stark', device: '服务器', status: '变更待审核', date: '2026-04-24 16:20', amount: 1500, complexity: Complexity.HIGH, caseLevel: 'P1' },
  { id: 'WO-1052', title: '变更维护周期', customer: 'Wayne Ent', storeName: 'Wayne 第二工厂', storeNumber: 'WAY-FAC-002', category: '巡检', repairCategory: '日常维护', engineer: 'Jessica Jones', device: 'POS机', status: '变更待审核', date: '2026-04-24 16:22', amount: 300, complexity: Complexity.MEDIUM, caseLevel: 'P3' },
  { id: 'WO-1053', title: '临时上门费申请', customer: 'TechStart Inc', storeName: 'TechStart 总部', storeNumber: 'TCH-HQ-001', category: '上门', repairCategory: '日常维护', engineer: 'Evan Wright', device: '显示器', status: '变更待审核', date: '2026-04-24 16:18', amount: 450, complexity: Complexity.MEDIUM, caseLevel: 'P2' },
  { id: 'WO-1054', title: '备件型号变更', customer: '百胜中国 (YUM China)', storeName: '百胜 虹桥路店', storeNumber: 'YUM-SH-001', category: '上门', repairCategory: '硬件故障', engineer: 'Sarah Connor', device: '打印机', status: '变更待审核', date: '2026-04-24 16:20', amount: 600, complexity: Complexity.MEDIUM, caseLevel: 'P3' },
];

export const MOCK_KNOWLEDGE_BASE: KnowledgeArticle[] = [
  { id: 'ka1', title: 'POS 触摸屏校准指南', category: 'POS', content: '进入服务菜单，选择触摸校准，点击屏幕四角...', views: 1250, lastUpdated: '2023-09-15' },
  { id: 'ka2', title: 'KDS 网络故障排除', category: 'KDS', content: '检查交换机端口灯，确认 IP 配置...', views: 890, lastUpdated: '2023-08-20' },
  { id: 'ka3', title: '客户沟通最佳实践', category: '软技能', content: '在维修过程的每个阶段都让客户知情...', views: 3400, lastUpdated: '2023-10-01' },
];

export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'chat-1',
    customerName: 'Alice Freeman',
    engineerName: 'Bob Smith',
    workOrderId: 'WO-1001',
    lastMessage: '工程师已到达现场。',
    lastMessageTime: '上午 10:30',
    unreadCount: 2,
    status: 'active',
    messages: [
      { id: 'm1', senderId: '1', senderName: 'Alice Freeman', senderRole: UserRole.CUSTOMER, content: 'POS 机又卡死了，无法结账。', timestamp: '上午 10:00', type: 'text' },
      { id: 'm2', senderId: 'admin', senderName: '支持专员', senderRole: UserRole.ADMIN, content: '收到。是 3 号收银台吗？', timestamp: '上午 10:02', type: 'text' },
      { id: 'm3', senderId: '1', senderName: 'Alice Freeman', senderRole: UserRole.CUSTOMER, content: '是的，主收银台。', timestamp: '上午 10:03', type: 'text' },
      { id: 'm4', senderId: 'system', senderName: '系统', senderRole: UserRole.ADMIN, content: '工单 WO-1001 已创建', timestamp: '上午 10:05', type: 'system' },
      { id: 'm5', senderId: '2', senderName: 'Bob Smith', senderRole: UserRole.ENGINEER, content: '我就在附近。我可以接这个单。', timestamp: '上午 10:15', type: 'text' },
      { id: 'm6', senderId: '2', senderName: 'Bob Smith', senderRole: UserRole.ENGINEER, content: '正在到达。', timestamp: '上午 10:30', type: 'text' }
    ]
  },
  {
    id: 'chat-2',
    customerName: 'Diana Prince',
    engineerName: 'Evan Wright',
    workOrderId: 'WO-1002',
    lastMessage: '备件已订购，重新安排在明天。',
    lastMessageTime: '昨天',
    unreadCount: 0,
    status: 'active',
    messages: [
      { id: 'm1', senderId: '4', senderName: 'Diana Prince', senderRole: UserRole.CUSTOMER, content: 'KDS 屏幕不亮了。', timestamp: '昨天 下午 2:00', type: 'text' },
      { id: 'm2', senderId: '5', senderName: 'Evan Wright', senderRole: UserRole.ENGINEER, content: '我检查过了。电源模块烧毁。', timestamp: '昨天 下午 3:00', type: 'text' },
      { id: 'm3', senderId: '5', senderName: 'Evan Wright', senderRole: UserRole.ENGINEER, content: '备件已订购，重新安排在明天。', timestamp: '昨天 下午 3:05', type: 'text' }
    ]
  }
];

// --- ANALYTICS MOCK DATA ---

// DEVICE ANALYTICS
export const MOCK_DEVICE_ANALYTICS = {
  overview: [
    { name: 'POS机', count: 450, faultCategoryCount: { '软件': 200, '网络': 150, '硬件': 100 }, avgLifeExp: 5 },
    { name: 'KDS', count: 320, faultCategoryCount: { '显示': 180, '连接': 100, '电源': 40 }, avgLifeExp: 4 },
    { name: '路由器', count: 280, faultCategoryCount: { '信号': 150, '配置': 100, '过热': 30 }, avgLifeExp: 3 },
    { name: '打印机', count: 150, faultCategoryCount: { '卡纸': 80, '墨盒': 50, '驱动': 20 }, avgLifeExp: 2 },
  ],
  drillDown: {
    'POS机': {
      brands: [
        { name: 'Toshiba', repairs: 150, health: 85 },
        { name: 'NCR', repairs: 120, health: 92 },
        { name: 'Elo', repairs: 90, health: 78 },
        { name: 'HP', repairs: 40, health: 65 },
      ],
      faults: [
        { name: '触摸屏失灵', count: 120 },
        { name: '无法开机', count: 90 },
        { name: '读卡器故障', count: 80 },
        { name: '系统崩溃', count: 60 },
      ],
      lifecycle: [
        { year: 1, Toshiba: 1, NCR: 0.5, Elo: 1.5, HP: 2 },
        { year: 2, Toshiba: 4, NCR: 2, Elo: 5, HP: 7 },
        { year: 3, Toshiba: 12, NCR: 6, Elo: 15, HP: 18 },
        { year: 4, Toshiba: 35, NCR: 20, Elo: 45, HP: 55 },
        { year: 5, Toshiba: 75, NCR: 45, Elo: 82, HP: 90 },
      ]
    }
  }
};

// STORE ANALYTICS
export const MOCK_STORE_ANALYTICS = {
  regional: [
    { name: '北区', repairs: 450 },
    { name: '南区', repairs: 320 },
    { name: '东区', repairs: 550 },
    { name: '西区', repairs: 210 },
  ],
  byLevel: [
    { name: '白金级', repairs: 600 },
    { name: '黄金级', repairs: 400 },
    { name: '白银级', repairs: 300 },
    { name: '标准级', repairs: 230 },
  ],
  breakdowns: {
    device: [
       { name: 'POS', count: 500 }, { name: 'KDS', count: 400 }, { name: '网络', count: 300 }
    ],
    brand: [
       { name: 'Toshiba', count: 300 }, { name: 'Epson', count: 250 }, { name: 'Cisco', count: 150 }
    ],
    fault: [
       { name: '硬件', count: 600 }, { name: '软件', count: 400 }, { name: '配置', count: 100 }
    ]
  },
  stats: {
    completionTime: {
      avg: '4.2 小时',
      top3: [{ name: '门店 A (北区)', val: '1.5 小时' }, { name: '门店 B (东区)', val: '2.1 小时' }, { name: '门店 C (西区)', val: '2.5 小时' }]
    },
    arrivalTime: {
      avg: '45 分钟',
      top3: [{ name: '门店 X (南区)', val: '15 分钟' }, { name: '门店 Y (北区)', val: '20 分钟' }, { name: '门店 Z (东区)', val: '25 分钟' }]
    },
    handlingTime: {
      avg: '3.5 小时',
      top3: [{ name: '门店 D (西区)', val: '1.2 小时' }, { name: '门店 E (南区)', val: '1.8 小时' }, { name: '门店 F (北区)', val: '2.0 小时' }]
    }
  }
};

// ENGINEER ANALYTICS
export const MOCK_ENGINEER_ANALYTICS = {
  busyRate: [
     { time: '08:00', level: 'Senior', region: 'North', rate: 40 },
     { time: '10:00', level: 'Senior', region: 'North', rate: 85 },
     { time: '12:00', level: 'Senior', region: 'North', rate: 60 },
     { time: '14:00', level: 'Senior', region: 'North', rate: 90 },
     { time: '16:00', level: 'Senior', region: 'North', rate: 75 },
     { time: '18:00', level: 'Senior', region: 'North', rate: 30 },
  ],
  mostBusy: [
    { name: 'Sarah Connor', rate: 98, role: '硬件专家' },
    { name: 'Tony Stark', rate: 95, role: '系统集成' },
    { name: 'Jessica Jones', rate: 92, role: '安防' }
  ],
  performance: {
    totalOrders: {
       top3: [{ name: 'Tony Stark', val: '150' }, { name: 'Luke Cage', val: '145' }, { name: 'Natasha Romanoff', val: '130' }]
    },
    avgHandling: {
       top3: [{ name: 'Bruce Banner', val: '45分' }, { name: 'Peter Parker', val: '50分' }, { name: 'Scott Lang', val: '55分' }]
    },
    avgCompletion: {
       top3: [{ name: 'Tony Stark', val: '1.5小时' }, { name: 'Steve Rogers', val: '1.8小时' }, { name: 'Thor', val: '2.0小时' }]
    },
    avgArrival: {
       top3: [{ name: 'Barry Allen', val: '5分' }, { name: 'Pietro Maximoff', val: '8分' }, { name: 'Clark Kent', val: '10分' }]
    }
  }
};

import { Field, Option } from './types';

// Mock data: Mapping customer names to specific options for different fields
const CUSTOMER_SPECIFIC_OPTIONS: Record<string, Record<string, Option[]>> = {
  'YUM': {
    'category': [
      {
        id: 'yum-cat-hw',
        label: '硬件故障',
        fieldId: 'category',
        children: [
          { 
            id: 'yum-cat-hw-rs', 
            label: '餐厅硬件故障', 
            fieldId: 'category', 
            parentId: 'yum-cat-hw',
            children: [
              {
                id: 'yum-cat-hw-rs-ds',
                label: '点餐屏故障',
                fieldId: 'category',
                parentId: 'yum-cat-hw-rs',
                children: [
                  {
                    id: 'yum-cat-hw-rs-ds-de',
                    label: '屏幕显示异常',
                    fieldId: 'category',
                    parentId: 'yum-cat-hw-rs-ds',
                    children: [
                      { id: 'yum-cat-hw-rs-ds-de-lp', label: '亮点/暗点', fieldId: 'category', parentId: 'yum-cat-hw-rs-ds-de', type: 'attribute' }
                    ]
                  }
                ]
              }
            ]
          },
          { id: 'yum-cat-hw-nw', label: '网络设备故障', fieldId: 'category', parentId: 'yum-cat-hw', type: 'attribute' },
        ]
      },
      {
        id: 'yum-cat-sw',
        label: '软件报错',
        fieldId: 'category',
        children: [
          { 
            id: 'yum-cat-sw-rs', 
            label: '餐厅软件报错', 
            fieldId: 'category', 
            parentId: 'yum-cat-sw',
            children: [
              {
                id: 'yum-cat-sw-rs-ps',
                label: '支付系统异常',
                fieldId: 'category',
                parentId: 'yum-cat-sw-rs',
                children: [
                  {
                    id: 'yum-cat-sw-rs-ps-wp',
                    label: '微信支付报错',
                    fieldId: 'category',
                    parentId: 'yum-cat-sw-rs-ps',
                    children: [
                      { id: 'yum-cat-sw-rs-ps-wp-sv', label: '签名验证失败', fieldId: 'category', parentId: 'yum-cat-sw-rs-ps-wp', type: 'attribute' },
                      { id: 'yum-cat-sw-rs-ps-wp-qf', label: '二维码生成失败', fieldId: 'category', parentId: 'yum-cat-sw-rs-ps-wp', type: 'attribute' },
                      { id: 'yum-cat-sw-rs-ps-wp-qt', label: '交易查询超时', fieldId: 'category', parentId: 'yum-cat-sw-rs-ps-wp', type: 'attribute' }
                    ]
                  }
                ]
              }
            ]
          },
          { id: 'yum-cat-sw-py', label: '支付异常', fieldId: 'category', parentId: 'yum-cat-sw', type: 'attribute' },
        ]
      }
    ],
    'case-level': [
      { id: 'yum-lvl-p1', label: 'P1', fieldId: 'case-level' },
      { id: 'yum-lvl-p2', label: 'P2', fieldId: 'case-level' },
      { id: 'yum-lvl-p3', label: 'P3', fieldId: 'case-level' },
      { id: 'yum-lvl-p4', label: 'P4', fieldId: 'case-level' },
      { id: 'yum-lvl-p5', label: 'P5', fieldId: 'case-level' },
    ],
    'zone': [
      { id: 'yum-zone-1', label: '1', fieldId: 'zone' },
      { id: 'yum-zone-2', label: '2', fieldId: 'zone' },
      { id: 'yum-zone-3', label: '3', fieldId: 'zone' },
      { id: 'yum-zone-4', label: '4', fieldId: 'zone' },
      { id: 'yum-zone-5', label: '5', fieldId: 'zone' },
    ],
    'work-order-classification': [
      { id: 'yum-woc-1', label: '上门', fieldId: 'work-order-classification' },
      { id: 'yum-woc-2', label: '远程', fieldId: 'work-order-classification' },
      { id: 'yum-woc-3', label: '巡检', fieldId: 'work-order-classification' },
      { id: 'yum-woc-4', label: '安装改造', fieldId: 'work-order-classification' },
    ]
  },
  '阿里云': {
    'category': [
      { id: 'ali-cat-1', label: '云端修复', fieldId: 'category' },
      { id: 'ali-cat-2', label: '机房驻守', fieldId: 'category' },
    ],
    'device': [
      { id: 'ali-dev-1', label: '云服务器', fieldId: 'device' },
      { id: 'ali-dev-2', label: '负载均衡', fieldId: 'device' },
    ]
  },
  '腾讯云': {
    'category': [
      { id: 'tx-cat-1', label: '后台维护', fieldId: 'category' },
      { id: 'tx-cat-2', label: '硬件更换', fieldId: 'category' },
    ],
    'device': [
      { id: 'tx-dev-1', label: '数据库节点', fieldId: 'device' },
      { id: 'tx-dev-2', label: 'CDN节点', fieldId: 'device' },
    ]
  }
};

export const getFieldsForCustomer = (customerName: string): Field[] => {
  const customerOptions = CUSTOMER_SPECIFIC_OPTIONS[customerName] || {};
  
  return INITIAL_FIELDS.map(field => {
    // If we have specific options for this customer and field, use them
    if (customerOptions[field.id]) {
      return {
        ...field,
        options: customerOptions[field.id]
      };
    }
    // Otherwise fallback to initial defaults
    return field;
  });
};

// 工单设置-客户工单报修逻辑设置
export const INITIAL_FIELDS: Field[] = [
  {
    id: 'case-level',
    name: '案件等级',
    options: [
      { id: 'lvl-1', label: '高', fieldId: 'case-level' },
      { id: 'lvl-2', label: '中', fieldId: 'case-level' },
      { id: 'lvl-3', label: '低', fieldId: 'case-level' },
    ],
  },
  {
    id: 'category',
    name: '报修分类',
    isTree: true,
    options: [
      {
        id: 'tech-specs',
        label: 'Technical Specs',
        fieldId: 'category',
        children: [
          { id: 'perf-metrics', label: 'Performance Metrics', fieldId: 'category', parentId: 'tech-specs', type: 'attribute' },
          { id: 'sec-compliance', label: 'Security Compliance', fieldId: 'category', parentId: 'tech-specs', type: 'attribute' },
        ]
      },
      {
        id: 'biz-rules',
        label: 'Business Rules',
        fieldId: 'category',
        children: [
          { id: 'ui-guidelines', label: 'UI Guidelines', fieldId: 'category', parentId: 'biz-rules', type: 'attribute' },
          { 
            id: 'data-masking', 
            label: 'Data Masking', 
            fieldId: 'category', 
            parentId: 'biz-rules',
            children: [
              { id: 'pii-scrubber', label: 'PII Scrubber', fieldId: 'category', parentId: 'data-masking', type: 'attribute' },
              { id: 'reg-anonymizer', label: 'Regional Anonymizer', fieldId: 'category', parentId: 'data-masking', type: 'attribute' },
            ]
          },
        ]
      }
    ],
  },
  {
    id: 'zone',
    name: 'zone',
    options: [
      { id: 'zone-1', label: 'Zone 1', fieldId: 'zone' },
      { id: 'zone-2', label: 'Zone 2', fieldId: 'zone' },
    ]
  },
  {
    id: 'work-order-classification',
    name: '工单分类',
    options: [
      { id: 'woc-1', label: '上门', fieldId: 'work-order-classification' },
      { id: 'woc-2', label: '远程', fieldId: 'work-order-classification' },
      { id: 'woc-3', label: '巡检', fieldId: 'work-order-classification' },
      { id: 'woc-4', label: '安装改造', fieldId: 'work-order-classification' },
    ],
  },
  {
    id: 'grab',
    name: '抢单',
    options: [
      { id: 'grab-1', label: '是', fieldId: 'grab' },
      { id: 'grab-2', label: '否', fieldId: 'grab' },
    ],
  },
  {
    id: 'grab-time',
    name: '抢单时间(Mins)',
    type: 'number',
    defaultValue: 5,
    options: [],
  },
  {
    id: 'it-stay',
    name: 'IT 停留',
    options: [
      { id: 'stay-1', label: '是', fieldId: 'it-stay' },
      { id: 'stay-2', label: '否', fieldId: 'it-stay' },
    ],
  },
  {
    id: 'it-stay-time',
    name: 'IT停留时间(Mins)',
    type: 'number',
    defaultValue: 5,
    options: [],
  },
  {
    id: 'phone-call-count',
    name: '电话通知(次)',
    type: 'number',
    defaultValue: 5,
    options: [],
  },
  {
    id: 'phone-call-duration',
    name: '通知时长(mins)',
    type: 'number',
    defaultValue: 5,
    options: [],
  },
  {
    id: 'device',
    name: '报修设备',
    options: [
      { id: 'dev-1', label: 'KDS', fieldId: 'device' },
      { id: 'dev-2', label: '笔记本电脑', fieldId: 'device' },
      { id: 'dev-3', label: '热敏打印机', fieldId: 'device' },
      { id: 'dev-4', label: 'POS机', fieldId: 'device' },
      { id: 'dev-5', label: '卡钟', fieldId: 'device' },
    ],
  },
];
