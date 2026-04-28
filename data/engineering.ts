export interface Equipment {
  id: string;
  name: string;
  quantity?: number;
}

export interface AcceptanceCriteria {
  id: string;
  name?: string;
  imageUrl: string;
  thumbnailUrl: string;
}

export interface SubTask {
  id: string;
  name: string;
  estCost: number;
  estDuration: number;
  acceptanceCriteria: AcceptanceCriteria[];
  equipment: Equipment[];
  actualAcceptanceCriteria?: AcceptanceCriteria[];
  actualEquipment?: Equipment[];
  assignee?: string;
  estStartDate?: string;
  estEndDate?: string;
  estProgress?: number;
  status?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  actualProgress?: number;
  actualStatus?: string;
}

export interface TaskPackage {
  id: string;
  name: string;
  subTasks: SubTask[];
}

export interface ProjectDrawing {
  id: string;
  name: string;
  url: string;
}

export interface EngineeringWorkOrder {
  id: string;
  workOrderNumber: string;
  customerName: string;
  projectName: string;
  storeName: string;
  status: string;
  estTotalCost: number;
  estTotalDuration: number;
  engineerCount: number;
  drawings: ProjectDrawing[];
  taskPackages: TaskPackage[];
}

export const MOCK_ENGINEERING_WORK_ORDERS: EngineeringWorkOrder[] = [
  {
    id: 'wo-1',
    workOrderNumber: 'WO-2024050001',
    customerName: '星巴克',
    projectName: '上海南京路店网络改造',
    storeName: '南京路步行街店',
    status: 'IN PROCESS',
    estTotalCost: 3800,
    estTotalDuration: 5,
    engineerCount: 2,
    drawings: [],
    taskPackages: [
      {
        id: 'tp-1',
        name: '网络设备安装包',
        subTasks: [
          {
            id: 'st-1',
            name: '路由器安装',
            estCost: 500,
            estDuration: 1,
            acceptanceCriteria: [
              { id: 'ac-1', name: '路由器通电亮灯', imageUrl: 'https://picsum.photos/seed/router/800/600', thumbnailUrl: 'https://picsum.photos/seed/router/200/150' }
            ],
            equipment: [
              { id: 'eq-1', name: 'Cisco ISR 1100', quantity: 1 },
              { id: 'eq-2', name: '网线 (米)', quantity: 10 }
            ],
            actualAcceptanceCriteria: [],
            actualEquipment: [
              { id: 'eq-1-act', name: 'Cisco ISR 1100', quantity: 1 },
              { id: 'eq-2-act', name: '网线 (米)', quantity: 10 }
            ],
            assignee: 'Zhang San',
            estStartDate: '2024-05-24',
            estEndDate: '2024-05-24',
            status: 'IN PROGRESS',
            actualStartDate: '2024-05-24',
            actualEndDate: '',
            actualStatus: 'IN PROGRESS'
          },
          {
            id: 'st-2',
            name: '交换机配置',
            estCost: 800,
            estDuration: 2,
            acceptanceCriteria: [
              { id: 'ac-2', name: '交换机端口状态', imageUrl: 'https://picsum.photos/seed/switch/800/600', thumbnailUrl: 'https://picsum.photos/seed/switch/200/150' }
            ],
            equipment: [
              { id: 'eq-3', name: 'Cisco Catalyst 9200', quantity: 2 }
            ],
            actualAcceptanceCriteria: [],
            actualEquipment: [
              { id: 'eq-3-act', name: 'Cisco Catalyst 9200', quantity: 2 }
            ],
            assignee: 'Li Si',
            estStartDate: '2024-05-25',
            estEndDate: '2024-05-26',
            status: 'PENDING',
            actualStartDate: '',
            actualEndDate: '',
            actualStatus: 'PENDING'
          }
        ]
      },
      {
        id: 'tp-2',
        name: '无线覆盖优化包',
        subTasks: [
          {
            id: 'st-3',
            name: 'AP点位部署',
            estCost: 1500,
            estDuration: 2,
            acceptanceCriteria: [
              { id: 'ac-3', name: 'AP安装位置图', imageUrl: 'https://picsum.photos/seed/ap/800/600', thumbnailUrl: 'https://picsum.photos/seed/ap/200/150' }
            ],
            equipment: [
              { id: 'eq-4', name: 'Aruba AP-515', quantity: 4 },
              { id: 'eq-5', name: '安装支架', quantity: 4 }
            ],
            actualAcceptanceCriteria: [],
            actualEquipment: [
              { id: 'eq-4-act', name: 'Aruba AP-515', quantity: 4 },
              { id: 'eq-5-act', name: '安装支架', quantity: 4 }
            ],
            assignee: 'Wang Wu',
            estStartDate: '2024-05-27',
            estEndDate: '2024-05-28',
            status: 'PENDING',
            actualStartDate: '',
            actualEndDate: '',
            actualStatus: 'PENDING'
          },
          {
            id: 'st-4',
            name: '信号测试与调优',
            estCost: 1000,
            estDuration: 1,
            acceptanceCriteria: [
              { id: 'ac-4', name: '热力图报告', imageUrl: 'https://picsum.photos/seed/heatmap/800/600', thumbnailUrl: 'https://picsum.photos/seed/heatmap/200/150' }
            ],
            equipment: [],
            actualAcceptanceCriteria: [],
            actualEquipment: [],
            assignee: 'Wang Wu',
            estStartDate: '2024-05-29',
            estEndDate: '2024-05-29',
            status: 'PENDING',
            actualStartDate: '',
            actualEndDate: '',
            actualStatus: 'PENDING'
          }
        ]
      }
    ]
  }
];

export const MOCK_TASK_PACKAGES: TaskPackage[] = [
  {
    id: 'tp-1',
    name: '网络设备安装包',
    subTasks: [
      {
        id: 'st-1-1',
        name: '路由器安装',
        estCost: 500,
        estDuration: 1,
        acceptanceCriteria: [
          { id: 'ac-1', imageUrl: 'https://picsum.photos/seed/router1/800/600', thumbnailUrl: 'https://picsum.photos/seed/router1/150/150' },
          { id: 'ac-2', imageUrl: 'https://picsum.photos/seed/router2/800/600', thumbnailUrl: 'https://picsum.photos/seed/router2/150/150' }
        ],
        equipment: [
          { id: 'eq-1', name: '企业级路由器' },
          { id: 'eq-2', name: '网线' }
        ]
      },
      {
        id: 'st-1-2',
        name: '交换机配置',
        estCost: 800,
        estDuration: 2,
        acceptanceCriteria: [
          { id: 'ac-3', imageUrl: 'https://picsum.photos/seed/switch1/800/600', thumbnailUrl: 'https://picsum.photos/seed/switch1/150/150' }
        ],
        equipment: [
          { id: 'eq-3', name: '核心交换机' }
        ]
      }
    ]
  },
  {
    id: 'tp-2',
    name: '监控系统部署包',
    subTasks: [
      {
        id: 'st-2-1',
        name: '摄像头安装',
        estCost: 1200,
        estDuration: 3,
        acceptanceCriteria: [
          { id: 'ac-4', imageUrl: 'https://picsum.photos/seed/cam1/800/600', thumbnailUrl: 'https://picsum.photos/seed/cam1/150/150' }
        ],
        equipment: [
          { id: 'eq-4', name: '高清摄像头' },
          { id: 'eq-5', name: '支架' }
        ]
      }
    ]
  }
];
