import React, { useState } from 'react';

import { Layout } from './components/Layout';
import { DashboardView } from './components/DashboardView';
import { EngineersView } from './components/EngineersView';
import { CustomersView } from './components/CustomersView';
import { StoresView } from './components/StoresView';
import { VendorsView } from './components/VendorsView';
import { DeviceManagerView } from './components/DeviceManagerView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { PricingView } from './components/PricingView';
import { CustomerSLAView } from './components/CustomerSLAView';
import { CustomerSupportView } from './components/CustomerSupportView';
import { DataInsightsView } from './components/DataInsightsView';
import { TicketView } from './components/TicketView';
import { EmailTemplatesView } from './components/EmailTemplatesView';
import { NotificationConfigView } from './components/NotificationConfigView';
import { EngineeringBasicConfigView } from './components/EngineeringBasicConfigView';
import { CustomerWorkOrderConfigView } from './components/CustomerWorkOrderConfigView';
import { EngineeringWorkOrdersView } from './components/EngineeringWorkOrdersView';
import { ExpensePaymentApprovalView } from './components/ExpensePaymentApprovalView';
import { ExpenseChangeApprovalView } from './components/ExpenseChangeApprovalView';
import { BusinessProcessFeeChangeView } from './components/BusinessProcessFeeChangeView';
import { BusinessProcessPaymentApprovalView } from './components/BusinessProcessPaymentApprovalView';
import { AccountListView } from './components/AccountListView';
import { RolesPermissionsView } from './components/RolesPermissionsView';

import { CusProjectNotificationConfigView } from './components/CusProjectNotificationConfigView';
import CusCaseFormDefinition from './components/CusCaseFormDefinition';
import CusCaseAssigneeConfigView from './components/CusCaseAssigneeConfigView';
import CusCaseFormDefinitionView from './components/CusCaseFormDefinitionView';
import { CusClosedCaseCategoryAndSolutionConfigView } from './components/CusClosedCaseCategoryAndSolutionConfigView';
import { ClosedCaseCategoryAndSolutionConfigView } from './components/ClosedCaseCategoryAndSolutionConfigView';
import { CusCaseCategoryConfigView } from './components/CusCaseCategoryConfigView';
import { CusCertificationConfigView } from './components/CusCertificationConfigView';
import CustomerRegionSettings from './components/CusRegionConfigView';
import GlobalRegionConfig from './components/GlobalRegionConfigView';
import { CusCasePriorityConfigView } from './components/CusCasePriorityConfigView';
import { CusEngPenaltyConfigView } from './components/CusEngPenaltyConfigView';
import { CusZoneConfigView } from './components/CusZoneConfigView';
import { CusBrandConfigView } from './components/CusBrandConfigView';
import CusCaseCategoryAndPriorityConfigView from './components/CusCaseCategoryAndPriorityConfigView';
import CusCaseCategoryAndPriorityDashboard from './components/CusCaseCategoryAndPriorityDashboard';
import CusCaseLogicConfigView from './components/CusCaseLogicConfigView';
import CusCaseLogicDashboard from './components/CusCaseLogicDashboard';
import { CusITAndVendorCaseView } from './components/cusITAndVendorCaseView';
import { CusStoreAndPriorityConfigView, StoreConfigDesignView, StoreConfigProcess } from './components/CusStoreAndPriorityConfigView';

import { DictionaryConfigView } from './components/DictionaryConfigView';
import { EmailSMTPConfigView } from './components/EmailSMTPConfigView';
import { SkillConfigeView } from './components/SkillConfigeView';
import { IndustryCertificationConfigView } from './components/IndustryCertificationConfigView';
import { DeviceCategoryAndBrandConfig } from './components/DeviceCategoryAndBrandConfig';
import { BusyLevelConfigView } from './components/BusyLevelConfigView';
import { ENGPromoteConfigView } from './components/ENGPromoteConfigView';
import { ENGSatisfactionConfigView } from './components/ENGSatisfactionConfigView';
import { ENGCreditConfigView } from './components/ENGCreditConfigView';
import { CusCaseChecklistConfigView } from './components/CusCaseChecklistConfigView';
import { CusAccountRefillConfigView } from './components/CusAccountRefillConfigView';
import { CusGeneralReportConfigView } from './components/CusGeneralReportConfigView';
import { CusCustomizeReportConfigView } from './components/CusCustomizeReportConfigView';
import { CusCustomizeReportConfigDashboard, CustomizedReport } from './components/CusCustomizeReportConfigDashboard';



import { ViewState, Process, LogicGroup, CustomerRegion, AssigneeGroup, FormTemplate } from './types';


import CusCasePriorityDashboard from './components/CusCasePriorityDashboard';
import CusZoneDashboard from './components/CusZoneDashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [viewParams, setViewParams] = useState<any>(null);
  
  const [priorityProcesses, setPriorityProcesses] = useState<Process[]>([
    {
      id: 'pp-1',
      customerName: 'YUM',
      processName: '标准案件等级定义',
      status: 'published',
      version: '1.0.2',
      creator: 'Admin',
      groups: [], 
      updatedAt: '2024-04-23',
      createdAt: '2024-04-20',
      // @ts-ignore
      priorities: ['P1', 'P2', 'P3', 'P4', 'P5']
    },
    {
      id: 'pp-2',
      customerName: '汉堡王',
      processName: '标准案件等级定义',
      status: 'published',
      version: '1.0.2',
      creator: 'ADMIN',
      groups: [],
      updatedAt: '2026-04-23',
      createdAt: '2026-04-23',
      // @ts-ignore
      priorities: ['Urgent', 'High', 'Medium', 'Low']
    }
  ]);

  const [zoneProcesses, setZoneProcesses] = useState<Process[]>([
    {
      id: 'zp-1',
      customerName: 'YUM',
      processName: '标准 Zone 距离规则',
      status: 'published',
      version: '1.0.0',
      creator: 'Admin',
      groups: [],
      updatedAt: '2026-04-23',
      createdAt: '2026-04-20',
      // @ts-ignore
      zones: [
        { id: 'z1', name: '1', min: '0', minOp: '<', maxOp: '<=', max: '5' },
        { id: 'z2', name: '2', min: '5', minOp: '<', maxOp: '<=', max: '10' },
        { id: 'z3', name: '3', min: '10', minOp: '<', maxOp: '<=', max: '15' },
        { id: 'z4', name: '4', min: '15', minOp: '<', maxOp: '<=', max: '20' },
        { id: 'z5', name: '5', min: '20', minOp: '<', maxOp: '', max: '' },
      ]
    },
    {
      id: 'zp-2',
      customerName: '汉堡王',
      processName: '标准 Zone 距离规则',
      status: 'published',
      version: '1.0.0',
      creator: 'Admin',
      groups: [],
      updatedAt: '2026-04-23',
      createdAt: '2026-04-20',
      // @ts-ignore
      zones: [
        { id: 'z6', name: '1', min: '', minOp: '', maxOp: '<=', max: '15' },
        { id: 'z7', name: '2', min: '15', minOp: '<', maxOp: '<=', max: '30' },
        { id: 'z8', name: '3', min: '30', minOp: '<', maxOp: '<=', max: '45' },
        { id: 'z9', name: '4', min: '45', minOp: '<', maxOp: '<=', max: '60' },
        { id: 'z10', name: '5', min: '60', minOp: '<', maxOp: '', max: '' },
      ]
    }
  ]);

  const [regions, setRegions] = useState<CustomerRegion[]>([
    {
      id: 'r-1',
      customerName: 'YUM',
      regionName: '亚太运营区',
      markets: ['华北市场', '西南市场', '东南市场'],
      continentCountry: '亚洲/中国',
      country: { id: 'china', name: 'China' },
      createdAt: '2024-04-10'
    }
  ]);

  const [assigneeGroups, setAssigneeGroups] = useState<AssigneeGroup[]>([
    {
      id: 'ag-1',
      customerName: 'YUM',
      groupName: '华东区二线支持组',
      type: 'Service Desk',
      members: ['John Doe', 'Alice Smith'],
      createdAt: '2024-04-12'
    }
  ]);
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([
    {
      id: 'ft-1',
      name: '百胜基础工单模板',
      version: '1.0.0',
      status: 'Published',
      createdAt: '2024-04-10 10:00:00',
      creator: 'Admin',
      fields: [
        { id: 'f-1', type: 'text', label: '联系人', placeholder: '请输入联系人姓名', required: true, width: '1/2' },
        { id: 'f-2', type: 'text', label: '联系电话', placeholder: '请输入电话号码', required: true, width: '1/2' }
      ]
    },
    {
      id: 'ft-2',
      name: '门店保修标准模板',
      version: '1.0.1',
      status: 'Unpublished',
      createdAt: '2024-04-11 14:30:00',
      creator: 'User01',
      fields: [
        { id: 'f-3', type: 'textarea', label: '故障描述', placeholder: '请详细描述故障现象', required: true, width: 'full' }
      ]
    }
  ]);

  const [processes, setProcesses] = useState<Process[]>([
    {
      id: 'p-yum-logic',
      customerName: 'YUM',
      processName: '百胜集团核心工单逻辑配置',
      status: 'published',
      version: '1.0.0',
      creator: 'Admin',
      groups: [
        {
          id: 'g-1',
          name: '高优先级特殊处理',
          nodes: [
            { id: 'n-1', fieldId: 'case-level', selectedOptionIds: ['yum-lvl-p1'] },
            { id: 'n-2', fieldId: 'work-order-classification', selectedOptionIds: ['yum-woc-1'] },
            { id: 'n-3', fieldId: 'grab', selectedOptionIds: ['grab-1'] },
            { id: 'n-gt', fieldId: 'grab-time', selectedOptionIds: [], value: 30 },
            { id: 'n-ist', fieldId: 'it-stay-time', selectedOptionIds: [], value: 120 }
          ]
        },
        {
          id: 'g-2',
          name: '超时预警流程',
          nodes: [
            { id: 'n-4', fieldId: 'case-level', selectedOptionIds: ['yum-lvl-p1', 'yum-lvl-p2'] },
            { id: 'n-ist2', fieldId: 'it-stay-time', selectedOptionIds: [], value: 60 },
            { id: 'n-pcc', fieldId: 'phone-call-count', selectedOptionIds: [], value: 3 },
            { id: 'n-pcd', fieldId: 'phone-call-duration', selectedOptionIds: [], value: 5 }
          ]
        }
      ],
      createdAt: '2024-04-18',
      updatedAt: '2024-04-18'
    },
    {
      id: 'p1',
      customerName: '阿里云',
      processName: '设备保修标准设计',
      status: 'published',
      version: '1.0.1',
      creator: 'Admin',
      groups: [],
      createdAt: '2024-03-20',
      updatedAt: '2024-03-21'
    },
    {
      id: 'p2',
      customerName: '腾讯云',
      processName: '上门维修标准逻辑',
      status: 'draft',
      version: '0.9.0',
      creator: 'Admin',
      groups: [],
      createdAt: '2024-03-22',
      updatedAt: '2024-03-22'
    }
  ]);

  const [cusProcesses, setCusProcesses] = useState<Process[]>([
    {
      id: 'p-yum',
      customerName: 'YUM',
      processName: '百胜集团报修分类与案件等级设计',
      status: 'published',
      version: '1.2.0',
      creator: 'Admin',
      groups: [],
      createdAt: '2024-04-16',
      updatedAt: '2024-04-16'
    }
  ]);

  const [storeConfigProcesses, setStoreConfigProcesses] = useState<StoreConfigProcess[]>([
    {
      id: 'scp-yum',
      customerName: 'YUM',
      processName: 'YUM 百胜集团门店等级关联配置',
      remarks: '百胜集团核心门店案件等级与区域对应关系配置',
      status: 'published',
      version: '1.0.0',
      creator: 'Admin',
      groups: [],
      createdAt: '2024-04-20',
      updatedAt: '2024-04-21',
      config: {
        casePriority: 'P1',
        zone: 'Zone 1',
        continentCountry: '亚洲/中国',
        markets: ['华东市场', '华南市场'],
        brands: ['KFC', 'Pizza Hut'],
        suppliers: ['Vendor Alpha'],
        dateTypes: {
          workday: { 
            selected: true, 
            days: [
              { name: '周一', selected: true, timeRange: ['08:00:00', '20:00:00'] },
              { name: '周二', selected: true, timeRange: ['08:00:00', '20:00:00'] },
              { name: '周三', selected: true, timeRange: ['08:00:00', '20:00:00'] },
              { name: '周四', selected: true, timeRange: ['08:00:00', '20:00:00'] },
              { name: '周五', selected: true, timeRange: ['08:00:00', '20:00:00'] },
            ] 
          },
          weekend: { 
            selected: true, 
            days: [
              { name: '周六', selected: true, timeRange: ['09:00:00', '18:00:00'] },
              { name: '周日', selected: true, timeRange: ['09:00:00', '18:00:00'] },
            ] 
          },
          holiday: { 
            selected: false, 
            days: [
              { name: '周一', selected: true, timeRange: ['09:00:00', '18:00:00'] },
              { name: '周二', selected: true, timeRange: ['09:00:00', '18:00:00'] },
              { name: '周三', selected: true, timeRange: ['09:00:00', '18:00:00'] },
              { name: '周四', selected: true, timeRange: ['09:00:00', '18:00:00'] },
              { name: '周五', selected: true, timeRange: ['09:00:00', '18:00:00'] },
              { name: '周六', selected: true, timeRange: ['09:00:00', '18:00:00'] },
              { name: '周日', selected: true, timeRange: ['09:00:00', '18:00:00'] },
            ] 
          },
        }
      }
    }
  ]);

  const [customizedReports, setCustomizedReports] = useState<CustomizedReport[]>([]);

  const handleViewChange = (view: ViewState, params?: any) => {
    setCurrentView(view);
    setViewParams(params);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardView />;
      case ViewState.CUSTOMERS:
        return <CustomersView regions={regions} />;
      case ViewState.STORES:
        return <StoresView regions={regions} />;
      case ViewState.VENDOR_CASE_OVERVIEW:
        return <CusITAndVendorCaseView onViewChange={handleViewChange} />;
      case ViewState.ENGINEERS:
        return <EngineersView />;
      case ViewState.VENDORS:
        return (
          <VendorsView 
            initialVendorId={viewParams?.vendorId} 
            initialReadOnly={viewParams?.readOnly}
            onClearParams={() => setViewParams(null)}
          />
        );
      case ViewState.DEVICES:
        return <DeviceManagerView />;
      case ViewState.PRICING_ENGINEER:
        return <PricingView showSection="engineer" />;
      case ViewState.PRICING_SLA:
        return <PricingView showSection="sla" />;
      case ViewState.PRICING_DEVICE:
        return (
          <div className="p-6 text-center text-slate-500">
            设备定价规则功能开发中...
          </div>
        );
      case ViewState.PRICING_ENG_PENALTY:
        return <CusEngPenaltyConfigView />;
      case ViewState.KNOWLEDGE_BASE:
        return <KnowledgeBaseView />;
      case ViewState.CUSTOMER_SUPPORT:
        return <CustomerSupportView onChangeView={handleViewChange} />;
      case ViewState.CUSTOMER_SLA:
        return <CustomerSLAView />;
      case ViewState.NOTIFICATION_CONFIG:
        return <NotificationConfigView />;
      case ViewState.EMAIL_TEMPLATES:
        return <EmailTemplatesView />;
      case ViewState.ENGINEERING_BASIC_CONFIG:
        return <EngineeringBasicConfigView />;
      case ViewState.CUSTOMER_WORK_ORDER_CONFIG:
        return <CustomerWorkOrderConfigView />;
      case ViewState.ENGINEERING_WORK_ORDERS:
        return <EngineeringWorkOrdersView />;
      case ViewState.EXPENSE_PAYMENT_APPROVAL:
        return <ExpensePaymentApprovalView onChangeView={handleViewChange} />;
      case ViewState.EXPENSE_CHANGE_APPROVAL:
        return <ExpenseChangeApprovalView onChangeView={handleViewChange} />;
      case ViewState.BUSINESS_PROCESS_FEE_CHANGE:
        return <BusinessProcessFeeChangeView />;
      case ViewState.BUSINESS_PROCESS_PAYMENT_APPROVAL:
        return <BusinessProcessPaymentApprovalView />;
      case ViewState.ACCOUNT_LIST:
        return <AccountListView />;
      case ViewState.ROLES_PERMISSIONS:
        return <RolesPermissionsView />;
      
      // Customer Configuration
      case ViewState.PROJECT_NOTIFICATION_CONFIG:
        return <CusProjectNotificationConfigView />;
      case ViewState.FORM_DEFINITION:
        return <CusCaseFormDefinition 
          template={viewParams} 
          onSave={(template) => {
            setFormTemplates(prev => {
              const exists = prev.some(t => t.id === template.id);
              if (exists) {
                return prev.map(t => t.id === template.id ? template : t);
              }
              return [...prev, template];
            });
            setCurrentView(ViewState.FORM_TEMPLATE_LIST);
          }}
          onBack={() => setCurrentView(ViewState.FORM_TEMPLATE_LIST)} 
        />;
      case ViewState.FORM_TEMPLATE_LIST:
        return <CusCaseFormDefinitionView 
          templates={formTemplates} 
          onEdit={(template) => {
            setViewParams(template);
            setCurrentView(ViewState.FORM_DEFINITION);
          }}
          onAdd={() => {
            setViewParams(null);
            setCurrentView(ViewState.FORM_DEFINITION);
          }}
          onCopy={(template) => {
            const copy = { 
              ...template, 
              id: `ft-${Date.now()}`,
              name: `${template.name} (Copy)`,
              status: 'Unpublished' as const,
              version: '1.0.0',
              createdAt: new Date().toISOString().replace('T', ' ').split('.')[0]
            };
            setFormTemplates(prev => [...prev, copy]);
          }}
          onUpdateStatus={(id, status) => {
            setFormTemplates(prev => prev.map(t => {
                if (t.id === id) {
                    return { ...t, status };
                }
                // If a new version is published, maybe deprecate others? 
                // The prompt says: "完成之后之前的版本移动到 已弃用，且状态变为 已弃用"
                // This implies versioning logic.
                return t;
            }));
          }}
          onPublish={(templateId) => {
            setFormTemplates(prev => {
                const target = prev.find(t => t.id === templateId);
                if (!target) return prev;
                
                return prev.map(t => {
                    if (t.id === templateId) {
                        return { ...t, status: 'Published' };
                    }
                    if (t.name === target.name && t.id !== templateId && t.status === 'Published') {
                        return { ...t, status: 'Deprecated' };
                    }
                    return t;
                });
            });
          }}
        />;
      case ViewState.DISPATCH_GROUP_CONFIG:
        return (
          <CusCaseAssigneeConfigView 
            groups={assigneeGroups}
            onSave={(data, id) => {
              if (id) {
                setAssigneeGroups(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
              } else {
                setAssigneeGroups(prev => [...prev, { ...data, id: `ag-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }]);
              }
            }}
            onDelete={(id) => setAssigneeGroups(prev => prev.filter(g => g.id !== id))}
          />
        );
      case ViewState.CLOSURE_TYPE_CONFIG:
        return <CusClosedCaseCategoryAndSolutionConfigView />;
      case ViewState.REPAIR_CATEGORY_CONFIG:
        return <CusCaseCategoryConfigView />;
      case ViewState.COGNITIVE_NAME_CONFIG_CUSTOMER:
        return <CusCertificationConfigView />;
      case ViewState.REGION_SETTINGS:
        if (viewParams?.isEditing) {
          return (
            <GlobalRegionConfig 
              initialData={viewParams.region}
              onCancel={() => handleViewChange(ViewState.REGION_SETTINGS)}
              onSave={(data) => {
                if (viewParams.region?.id) {
                  setRegions(prev => prev.map(r => r.id === viewParams.region.id ? { ...r, ...data } : r));
                } else {
                  setRegions(prev => [...prev, { ...data, id: `r-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }]);
                }
                handleViewChange(ViewState.REGION_SETTINGS);
              }}
            />
          );
        }
        return (
          <CustomerRegionSettings 
            regions={regions}
            onAddNew={() => handleViewChange(ViewState.REGION_SETTINGS, { isEditing: true })}
            onEdit={(region) => handleViewChange(ViewState.REGION_SETTINGS, { isEditing: true, region })}
          />
        );
      case ViewState.CASE_LEVEL_CONFIG:
        if (viewParams?.isDesigning) {
          return (
            <CusCasePriorityConfigView 
              initialData={viewParams.process}
              isReadOnly={viewParams.process?.status === 'deprecated'}
              onBack={() => handleViewChange(ViewState.CASE_LEVEL_CONFIG)}
              onSave={(priorities) => {
                setPriorityProcesses(prev => {
                  const target = prev.find(p => p.id === viewParams.process.id);
                  if (!target) return prev;
                  
                  if (target.status === 'published' || target.status === 'deprecated') {
                    const newP: Process = {
                      ...target,
                      id: `pp-${Date.now()}`,
                      status: 'draft',
                      updatedAt: new Date().toISOString().split('T')[0],
                      // @ts-ignore
                      priorities: priorities
                    };
                    return [newP, ...prev];
                  }
                  
                  return prev.map(p => p.id === viewParams.process.id ? {
                    ...p,
                    updatedAt: new Date().toISOString().split('T')[0],
                    // @ts-ignore
                    priorities: priorities
                  } : p);
                });
                handleViewChange(ViewState.CASE_LEVEL_CONFIG);
              }}
            />
          );
        }
        return (
          <CusCasePriorityDashboard 
            processes={priorityProcesses}
            onOpenDesign={(p) => handleViewChange(ViewState.CASE_LEVEL_CONFIG, { isDesigning: true, process: p })}
            onCreateNew={(data) => {
              const newP: Process = {
                id: `pp-${Date.now()}`,
                ...data,
                status: 'draft',
                version: '1.0.0',
                creator: 'Admin',
                groups: [],
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0]
              };
              setPriorityProcesses(prev => [newP, ...prev]);
              handleViewChange(ViewState.CASE_LEVEL_CONFIG, { isDesigning: true, process: newP });
            }}
            onUpdateStatus={(id, status) => {
              setPriorityProcesses(prev => {
                const target = prev.find(p => p.id === id);
                if (status === 'published' && target) {
                  return prev.map(p => {
                    if (p.id === id) {
                      const v = p.version.split('.');
                      v[v.length-1] = (parseInt(v[v.length-1]) + 1).toString();
                      return { ...p, status: 'published', version: v.join('.'), updatedAt: new Date().toISOString().split('T')[0] };
                    }
                    if (p.customerName === target.customerName && p.processName === target.processName && p.status === 'published') {
                      return { ...p, status: 'deprecated' };
                    }
                    return p;
                  });
                }
                return prev.map(p => p.id === id ? { ...p, status } : p);
              });
            }}
          />
        );
      case ViewState.ENGINEER_PENALTY_CONFIG:
        return <CusEngPenaltyConfigView />;
      case ViewState.ZONE_SETTINGS:
        if (viewParams?.isDesigning) {
          return (
            <CusZoneConfigView 
              initialData={viewParams.process}
              isReadOnly={viewParams.process?.status === 'deprecated'}
              onBack={() => handleViewChange(ViewState.ZONE_SETTINGS)}
              onSave={(zones) => {
                setZoneProcesses(prev => {
                  const target = prev.find(p => p.id === viewParams.process.id);
                  if (!target) return prev;
                  
                  if (target.status === 'published' || target.status === 'deprecated') {
                    const newP: Process = {
                      ...target,
                      id: `zp-${Date.now()}`,
                      status: 'draft',
                      updatedAt: new Date().toISOString().split('T')[0],
                      // @ts-ignore
                      zones: zones
                    };
                    return [newP, ...prev];
                  }
                  
                  return prev.map(p => p.id === viewParams.process.id ? {
                    ...p,
                    updatedAt: new Date().toISOString().split('T')[0],
                    // @ts-ignore
                    zones: zones
                  } : p);
                });
                handleViewChange(ViewState.ZONE_SETTINGS);
              }}
            />
          );
        }
        return (
          <CusZoneDashboard 
            processes={zoneProcesses}
            onOpenDesign={(p) => handleViewChange(ViewState.ZONE_SETTINGS, { isDesigning: true, process: p })}
            onCreateNew={(data) => {
              const newP: Process = {
                id: `zp-${Date.now()}`,
                ...data,
                status: 'draft',
                version: '1.0.0',
                creator: 'Admin',
                groups: [],
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0]
              };
              setZoneProcesses(prev => [newP, ...prev]);
              handleViewChange(ViewState.ZONE_SETTINGS, { isDesigning: true, process: newP });
            }}
            onUpdateStatus={(id, status) => {
              setZoneProcesses(prev => {
                const target = prev.find(p => p.id === id);
                if (status === 'published' && target) {
                  return prev.map(p => {
                    if (p.id === id) {
                      const v = p.version.split('.');
                      v[v.length-1] = (parseInt(v[v.length-1]) + 1).toString();
                      return { ...p, status: 'published', version: v.join('.'), updatedAt: new Date().toISOString().split('T')[0] };
                    }
                    if (p.customerName === target.customerName && p.processName === target.processName && p.status === 'published') {
                      return { ...p, status: 'deprecated' };
                    }
                    return p;
                  });
                }
                return prev.map(p => p.id === id ? { ...p, status } : p);
              });
            }}
          />
        );
      case ViewState.USER_BRAND_SETTINGS:
        return <CusBrandConfigView />;
      case ViewState.CUS_STORE_AND_PRIORITY_CONFIG:
        if (viewParams?.isDesigning) {
          return (
            <StoreConfigDesignView 
              initialData={viewParams.process}
              regions={regions}
              onBack={() => handleViewChange(ViewState.CUS_STORE_AND_PRIORITY_CONFIG)}
              onSave={(config) => {
                setStoreConfigProcesses(prev => {
                  const target = prev.find(p => p.id === viewParams.process.id);
                  if (!target) return prev;
                  
                  if (target.status === 'published' || target.status === 'deprecated') {
                    const newP: StoreConfigProcess = {
                      ...target,
                      id: `scp-${Date.now()}`,
                      status: 'draft',
                      updatedAt: new Date().toISOString().split('T')[0],
                      config: config
                    };
                    return [newP, ...prev];
                  }
                  
                  return prev.map(p => p.id === viewParams.process.id ? {
                    ...p,
                    updatedAt: new Date().toISOString().split('T')[0],
                    config: config
                  } : p);
                });
                handleViewChange(ViewState.CUS_STORE_AND_PRIORITY_CONFIG);
              }}
            />
          );
        }
        return (
          <CusStoreAndPriorityConfigView 
            processes={storeConfigProcesses}
            onOpenDesign={(p) => handleViewChange(ViewState.CUS_STORE_AND_PRIORITY_CONFIG, { isDesigning: true, process: p })}
            onCreateNew={(data) => {
              const newP: StoreConfigProcess = {
                id: `scp-${Date.now()}`,
                customerName: data.customerName,
                processName: `${data.customerName} 关联配置`,
                remarks: data.remarks,
                status: 'draft',
                version: '1.0.0',
                creator: 'Admin',
                groups: [],
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0]
              };
              setStoreConfigProcesses(prev => [newP, ...prev]);
              handleViewChange(ViewState.CUS_STORE_AND_PRIORITY_CONFIG, { isDesigning: true, process: newP });
            }}
            onUpdateStatus={(id, status) => {
              setStoreConfigProcesses(prev => {
                const target = prev.find(p => p.id === id);
                if (status === 'published' && target) {
                  return prev.map(p => {
                    if (p.id === id) {
                      const v = p.version.split('.');
                      v[v.length-1] = (parseInt(v[v.length-1]) + 1).toString();
                      return { ...p, status: 'published', version: v.join('.'), updatedAt: new Date().toISOString().split('T')[0] };
                    }
                    if (p.customerName === target.customerName && p.status === 'published') {
                      return { ...p, status: 'deprecated' };
                    }
                    return p;
                  });
                }
                return prev.map(p => p.id === id ? { ...p, status } : p);
              });
            }}
            onCopy={(p) => {
              const copy: StoreConfigProcess = {
                ...p,
                id: `scp-${Date.now()}`,
                status: 'draft',
                version: '1.0.0',
                creator: 'Admin',
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0]
              };
              setStoreConfigProcesses(prev => [copy, ...prev]);
            }}
          />
        );
      case ViewState.CUS_BASIC_BUSINESS_PROCESS:
        return (
          <CusCaseCategoryAndPriorityConfigView 
            initialData={viewParams?.process}
            onSave={(groups: LogicGroup[]) => {
              if (viewParams?.process) {
                setCusProcesses(prev => {
                  const isPublished = viewParams.process.status === 'published';
                  if (isPublished) {
                    // Create NEW draft entry
                    const newP: Process = {
                      ...viewParams.process,
                      id: `p-${Date.now()}`,
                      groups,
                      status: 'draft',
                      updatedAt: new Date().toISOString().split('T')[0]
                    };
                    return [newP, ...prev];
                  } else {
                    // Update existing draft/deprecated
                    return prev.map(p => p.id === viewParams.process.id ? { 
                      ...p, 
                      groups, 
                      status: 'draft',
                      updatedAt: new Date().toISOString().split('T')[0] 
                    } : p);
                  }
                });
              }
              handleViewChange(ViewState.CUS_BASIC_BUSINESS_DASHBOARD);
            }}
          />
        );
      case ViewState.CUS_BASIC_BUSINESS_DASHBOARD:
        return (
          <CusCaseCategoryAndPriorityDashboard 
            processes={cusProcesses}
            onOpenDesign={(p) => handleViewChange(ViewState.CUS_BASIC_BUSINESS_PROCESS, { process: p })}
            onCreateNew={(data) => {
              const newP: Process = {
                id: `p-${Date.now()}`,
                ...data,
                status: 'draft',
                version: '1.0.0',
                creator: 'Admin',
                groups: [],
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0]
              };
              setCusProcesses(prev => [newP, ...prev]);
              handleViewChange(ViewState.CUS_BASIC_BUSINESS_PROCESS, { process: newP });
            }}
            onUpdateStatus={(id, status) => {
              setCusProcesses(prev => {
                if (status === 'published') {
                  const targetProcess = prev.find(p => p.id === id);
                  if (targetProcess) {
                    return prev.map(p => {
                      if (p.id === id) {
                        // Increment version on publish if it was a draft
                        const vParts = p.version.split('.');
                        if (vParts.length === 3) {
                          vParts[2] = (parseInt(vParts[2]) + 1).toString();
                        }
                        const newVersion = vParts.join('.');
                        return { ...p, status: 'published', version: newVersion, updatedAt: new Date().toISOString().split('T')[0] };
                      }
                      // Deprecate older published versions of the same process
                      if (p.customerName === targetProcess.customerName && 
                          p.processName === targetProcess.processName && 
                          p.status === 'published') {
                        return { ...p, status: 'deprecated', updatedAt: new Date().toISOString().split('T')[0] };
                      }
                      return p;
                    });
                  }
                }
                return prev.map(p => p.id === id ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p);
              });
            }}
          />
        );

      // System Settings
      case ViewState.BASIC_BUSINESS_PROCESS_LIST:
        return (
          <CusCaseLogicDashboard 
            processes={processes}
            onOpenDesign={(p) => handleViewChange(ViewState.BASIC_BUSINESS_PROCESS_DESIGN, { process: p })}
            onCreateNew={(data) => {
              const newP: Process = {
                id: `p-${Date.now()}`,
                ...data,
                status: 'draft',
                version: '1.0.0',
                creator: 'Admin',
                groups: [],
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0]
              };
              setProcesses(prev => [newP, ...prev]);
              handleViewChange(ViewState.BASIC_BUSINESS_PROCESS_DESIGN, { process: newP });
            }}
            onUpdateStatus={(id, status) => {
              setProcesses(prev => {
                if (status === 'published') {
                  const targetProcess = prev.find(p => p.id === id);
                  if (targetProcess) {
                    return prev.map(p => {
                      if (p.id === id) {
                        // Increment version on publish if it was a draft
                        const vParts = p.version.split('.');
                        if (vParts.length === 3) {
                          vParts[2] = (parseInt(vParts[2]) + 1).toString();
                        }
                        const newVersion = vParts.join('.');
                        return { ...p, status: 'published', version: newVersion, updatedAt: new Date().toISOString().split('T')[0] };
                      }
                      // Deprecate older published versions of the same process
                      if (p.customerName === targetProcess.customerName && 
                          p.processName === targetProcess.processName && 
                          p.status === 'published') {
                        return { ...p, status: 'deprecated', updatedAt: new Date().toISOString().split('T')[0] };
                      }
                      return p;
                    });
                  }
                }
                return prev.map(p => p.id === id ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p);
              });
            }}
          />
        );
      case ViewState.BASIC_BUSINESS_PROCESS_DESIGN:
        return (
          <CusCaseLogicConfigView 
            initialData={viewParams?.process}
            onSave={(groups: LogicGroup[]) => {
              if (viewParams?.process) {
                setProcesses(prev => {
                  const isPublished = viewParams.process.status === 'published';
                  if (isPublished) {
                    // Create NEW draft entry
                    const newP: Process = {
                      ...viewParams.process,
                      id: `p-${Date.now()}`,
                      groups,
                      status: 'draft',
                      updatedAt: new Date().toISOString().split('T')[0]
                    };
                    return [newP, ...prev];
                  } else {
                    // Update existing draft
                    return prev.map(p => p.id === viewParams.process.id ? { 
                      ...p, 
                      groups, 
                      status: 'draft', // Edit automatically sets status to draft
                      updatedAt: new Date().toISOString().split('T')[0] 
                    } : p);
                  }
                });
              }
              handleViewChange(ViewState.BASIC_BUSINESS_PROCESS_LIST);
            }}
          />
        );
      case ViewState.SYS_CLOSURE_CONFIG:
        return <ClosedCaseCategoryAndSolutionConfigView />;
      case ViewState.DICTIONARY_CONFIG:
        return <DictionaryConfigView />;
      case ViewState.SMTP_SETTINGS:
        return <EmailSMTPConfigView />;
      case ViewState.SERVICE_SKILL_CONFIG:
        return <SkillConfigeView />;
      case ViewState.COGNITIVE_NAME_CONFIG_SYSTEM:
        return <IndustryCertificationConfigView />;
      case ViewState.DEVICE_CATEGORY_BRAND_CONFIG:
        return <DeviceCategoryAndBrandConfig />;
      case ViewState.BUSYNESS_SETTINGS:
        return <BusyLevelConfigView />;
      case ViewState.ENG_PROMOTE_CONFIG:
        return <ENGPromoteConfigView />;
      case ViewState.ENG_SATISFACTION_CONFIG:
        return <ENGSatisfactionConfigView />;
      case ViewState.ENG_CREDIT_CONFIG:
        return <ENGCreditConfigView />;
      case ViewState.CUS_CASE_CHECKLIST_CONFIG:
        return <CusCaseChecklistConfigView />;
      case ViewState.CUS_ACCOUNT_REFILL_CONFIG:
        return <CusAccountRefillConfigView />;
      case ViewState.CUS_GENERAL_REPORT:
        return <CusGeneralReportConfigView />;
      case ViewState.CUS_CUSTOMIZE_REPORT_DASHBOARD:
        return (
          <CusCustomizeReportConfigDashboard 
            reports={customizedReports}
            onCreateNew={(data: { name: string; description: string }) => {
              const newReport: CustomizedReport = {
                id: `cr-${Date.now()}`,
                name: data.name,
                description: data.description,
                chartType: 'table',
                creator: '管理员',
                updatedAt: new Date().toISOString().split('T')[0],
                config: { selectedFields: [], filters: [] }
              };
              handleViewChange(ViewState.CUS_CUSTOMIZE_REPORT, { report: newReport });
            }}
            onEdit={(report) => handleViewChange(ViewState.CUS_CUSTOMIZE_REPORT, { report })}
            onCopy={(report) => {
              const copy = { ...report, id: `cr-${Date.now()}`, name: `${report.name} (Copy)` };
              setCustomizedReports(prev => [copy, ...prev]);
            }}
            onDelete={(id) => setCustomizedReports(prev => prev.filter(r => r.id !== id))}
          />
        );
      case ViewState.CUS_CUSTOMIZE_REPORT:
        return (
          <CusCustomizeReportConfigView 
            initialData={viewParams?.report}
            onSave={(report) => {
              setCustomizedReports(prev => {
                const exists = prev.some(r => r.id === report.id);
                if (exists) {
                  return prev.map(r => r.id === report.id ? report : r);
                }
                return [report, ...prev];
              });
              handleViewChange(ViewState.CUS_CUSTOMIZE_REPORT_DASHBOARD);
            }}
            onBack={() => handleViewChange(ViewState.CUS_CUSTOMIZE_REPORT_DASHBOARD)}
          />
        );

      // Data Insights Routes
      case ViewState.ANALYTICS_DEVICES:
      case ViewState.ANALYTICS_STORES:
      case ViewState.ANALYTICS_ENGINEERS:
      case ViewState.ANALYTICS_WORK_ORDERS:
      case ViewState.ANALYTICS_REVENUE:
      case ViewState.ANALYTICS_SPARE_PARTS:
      case ViewState.ANALYTICS_VENDORS:
      case ViewState.ANALYTICS_CUSTOMERS:
        return <DataInsightsView view={currentView} onChangeView={handleViewChange} />;
        
      case ViewState.TICKET_VIEW:
        return <TicketView onBack={() => handleViewChange(viewParams?.fromView || ViewState.ANALYTICS_WORK_ORDERS)} approvalData={viewParams?.approvalData} />;
        
      default:
        return <DashboardView />;
    }
  };

  const isDesigner = currentView === ViewState.BASIC_BUSINESS_PROCESS || 
                     currentView === ViewState.BASIC_BUSINESS_PROCESS_DESIGN ||
                     currentView === ViewState.CUS_BASIC_BUSINESS_PROCESS ||
                     (currentView === ViewState.CASE_LEVEL_CONFIG && viewParams?.isDesigning) ||
                     (currentView === ViewState.ZONE_SETTINGS && viewParams?.isDesigning);

  const ViewRenderer = () => {
    return renderContent();
  };

  return (
    <Layout currentView={currentView} onChangeView={handleViewChange} noPadding={isDesigner}>
      <ViewRenderer />
    </Layout>
  );
};

export default App;