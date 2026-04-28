import React, { useState } from 'react';
import { Plus, Search, X, Copy } from 'lucide-react';

export interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  sendMethod: string;
  remarks: string;
  body: string;
  selectedFields: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export const MOCK_TEMPLATES: EmailTemplate[] = [
  {
    id: 'TPL-001',
    name: '工单创建通知',
    type: '接单超时',
    subject: 'iService Notification - Work Order Created',
    sendMethod: '实时发送',
    remarks: '当新工单创建时发送给客户',
    body: '客户名称: $[客户名称]\n工单编号: $[工单编号]\n工单描述: $[工单描述]',
    selectedFields: ['客户名称', '工单编号', '工单描述'],
    createdAt: '2023-10-01T10:00:00',
    createdBy: 'System Admin',
    updatedAt: '2023-10-01T10:00:00',
    updatedBy: 'System Admin',
  },
  {
    id: 'TPL-002',
    name: '每日工单汇总',
    type: '工单结案',
    subject: 'iService Notification - Daily Work Order Summary',
    sendMethod: '定时发送',
    remarks: '每日定时发送工单汇总报表',
    body: '',
    selectedFields: ['客户名称', '工单编号', '工单状态', '报修时间'],
    createdAt: '2023-10-02T10:00:00',
    createdBy: 'System Admin',
    updatedAt: '2023-10-02T10:00:00',
    updatedBy: 'System Admin',
  }
];

const AVAILABLE_FIELDS = {
  customer: [
    { label: '客户名称', value: '客户名称' },
    { label: '客户等级', value: '客户等级' },
  ],
  supplier: [
    { label: '供应商名称', value: '供应商名称' },
    { label: '供应商等级', value: '供应商等级' },
  ],
  workOrder: [
    { label: '工单编号', value: '工单编号' },
    { label: '工单类型', value: '工单类型' },
    { label: '工单状态', value: '工单状态' },
    { label: '紧急度', value: '紧急度' },
    { label: '报修设备', value: '报修设备' },
    { label: '报修人', value: '报修人' },
    { label: '报修时间', value: '报修时间' },
    { label: '工单描述', value: '工单描述' },
  ],
  engineer: [
    { label: '工程师名称', value: '工程师名称' },
    { label: '工程师类型', value: '工程师类型' },
    { label: '级别', value: '级别' },
    { label: '技能认证', value: '技能认证' },
  ]
};

export const EmailTemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(MOCK_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('接单超时');
  const [subject, setSubject] = useState('');
  const [sendMethod, setSendMethod] = useState('实时发送');
  const [remarks, setRemarks] = useState('');
  const [body, setBody] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const handleAddNew = () => {
    setEditingTemplate(null);
    setName('');
    setType('接单超时');
    setSubject('iService Notification - ');
    setSendMethod('实时发送');
    setRemarks('');
    setBody('');
    setSelectedFields([]);
    setIsDrawerOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setName(template.name);
    setType(template.type || '接单超时');
    setSubject(template.subject);
    setSendMethod(template.sendMethod || '实时发送');
    setRemarks(template.remarks);
    setBody(template.body);
    setSelectedFields(template.selectedFields || []);
    setIsDrawerOpen(true);
  };

  const handleCopy = (e: React.MouseEvent, template: EmailTemplate) => {
    e.stopPropagation();
    const newTemplate: EmailTemplate = {
      ...template,
      id: `TPL-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      name: `${template.name} (复制)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates([newTemplate, ...templates]);
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    if (editingTemplate) {
      const updatedTemplates = templates.map(t => t.id === editingTemplate.id ? {
        ...t,
        name,
        type,
        subject,
        sendMethod,
        remarks,
        body,
        selectedFields,
        updatedAt: now,
        updatedBy: 'System Admin',
      } : t);
      setTemplates(updatedTemplates);
    } else {
      const newTemplate: EmailTemplate = {
        id: `TPL-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name,
        type,
        subject,
        sendMethod,
        remarks,
        body,
        selectedFields,
        createdAt: now,
        createdBy: 'System Admin',
        updatedAt: now,
        updatedBy: 'System Admin',
      };
      setTemplates([newTemplate, ...templates]);
    }
    setIsDrawerOpen(false);
  };

  const handleFieldToggle = (fieldValue: string, checked: boolean) => {
    const placeholder = `$[${fieldValue}]`;
    if (checked) {
      setSelectedFields(prev => [...prev, fieldValue]);
      if (sendMethod === '实时发送') {
        setBody(prev => prev ? `${prev}\n${fieldValue}: ${placeholder}` : `${fieldValue}: ${placeholder}`);
      }
    } else {
      setSelectedFields(prev => prev.filter(f => f !== fieldValue));
      if (sendMethod === '实时发送') {
        // Try to remove the field and its placeholder
        const regex = new RegExp(`(?:^|\\n)${fieldValue}:\\s*\\$\\[${fieldValue}\\]`, 'g');
        let newBody = body.replace(regex, '');
        // Also try to remove just the placeholder if the user modified the prefix
        newBody = newBody.replace(placeholder, '');
        setBody(newBody.trim());
      }
    }
  };

  const isFieldSelected = (fieldValue: string) => {
    return selectedFields.includes(fieldValue);
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">邮件通知模板</h1>
          <p className="text-slate-500 text-sm">管理系统自动发送的邮件通知模板</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> 新增
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="搜索模板名称或主题..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4">模板名称</th>
                <th className="p-4">模板主题</th>
                <th className="p-4">模板类型</th>
                <th className="p-4">模板发送方式</th>
                <th className="p-4">备注</th>
                <th className="p-4">创建人</th>
                <th className="p-4">创建时间点</th>
                <th className="p-4">更新人</th>
                <th className="p-4">更新时间</th>
                <th className="p-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTemplates.map(template => (
                <tr key={template.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleEdit(template)}>
                  <td className="p-4 font-medium text-slate-900">{template.name}</td>
                  <td className="p-4 text-slate-600">{template.subject}</td>
                  <td className="p-4 text-slate-600">{template.type}</td>
                  <td className="p-4 text-slate-600">{template.sendMethod}</td>
                  <td className="p-4 text-slate-600 truncate max-w-[200px]">{template.remarks}</td>
                  <td className="p-4 text-slate-600">{template.createdBy}</td>
                  <td className="p-4 text-slate-600">{new Date(template.createdAt).toLocaleString()}</td>
                  <td className="p-4 text-slate-600">{template.updatedBy}</td>
                  <td className="p-4 text-slate-600">{new Date(template.updatedAt).toLocaleString()}</td>
                  <td className="p-4">
                    <button 
                      onClick={(e) => handleCopy(e, template)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                    >
                      <Copy className="w-4 h-4" /> 复制
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div 
             className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" 
             onClick={() => setIsDrawerOpen(false)} 
           />
           <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
               <h2 className="text-lg font-bold text-slate-900">{editingTemplate ? '编辑模板' : '新增模板'}</h2>
               <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">模板名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="输入模板名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">模板主题 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="iService Notification - xxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">模板类型 <span className="text-red-500">*</span></label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="接单超时">接单超时</option>
                    <option value="响应超时">响应超时</option>
                    <option value="工单结案">工单结案</option>
                    <option value="工单停表">工单停表</option>
                    <option value="SLA 超时">SLA 超时</option>
                    <option value="工单已支付">工单已支付</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">模板发送方式 <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="sendMethod" 
                        value="实时发送" 
                        checked={sendMethod === '实时发送'}
                        onChange={(e) => setSendMethod(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">实时发送</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="sendMethod" 
                        value="定时发送" 
                        checked={sendMethod === '定时发送'}
                        onChange={(e) => setSendMethod(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">定时发送</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
                  <textarea 
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                    placeholder="输入备注信息"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    {sendMethod === '定时发送' ? '可选字段 (勾选字段将作为xls表格字段名称进行展示)' : '可选字段 (勾选以插入到模板正文)'}
                  </label>
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">客户 & 门店</h4>
                      <div className="space-y-2">
                        {AVAILABLE_FIELDS.customer.map(field => (
                          <label key={field.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={isFieldSelected(field.value)}
                              onChange={(e) => handleFieldToggle(field.value, e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            {field.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">供应商</h4>
                      <div className="space-y-2">
                        {AVAILABLE_FIELDS.supplier.map(field => (
                          <label key={field.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={isFieldSelected(field.value)}
                              onChange={(e) => handleFieldToggle(field.value, e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            {field.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">工单</h4>
                      <div className="space-y-2">
                        {AVAILABLE_FIELDS.workOrder.map(field => (
                          <label key={field.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={isFieldSelected(field.value)}
                              onChange={(e) => handleFieldToggle(field.value, e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            {field.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">工程师</h4>
                      <div className="space-y-2">
                        {AVAILABLE_FIELDS.engineer.map(field => (
                          <label key={field.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={isFieldSelected(field.value)}
                              onChange={(e) => handleFieldToggle(field.value, e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            {field.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">模板正文 <span className="text-red-500">*</span></label>
                  {sendMethod === '实时发送' ? (
                    <div className="border border-slate-300 rounded-lg overflow-hidden flex flex-col">
                      <div className="bg-slate-50 p-3 border-b border-slate-200 text-sm text-slate-600 font-mono whitespace-pre-wrap">
                        Dear Sir/Madam,<br/><br/>
                        This is a Notification<br/><br/>
                        
                      </div>
                      <textarea 
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full p-3 focus:outline-none focus:ring-0 min-h-[150px] font-mono text-sm resize-y"
                        placeholder="在此处编辑动态内容..."
                      />
                      <div className="bg-slate-50 p-3 border-t border-slate-200 text-sm text-slate-600 font-mono whitespace-pre-wrap">
                        <br/><br/>
                        This mail is sent from iService system automatically, please do not reply. Thanks<br/><br/>
                        Best regards & Thanks<br/>
                        iService Support Team
                      </div>
                    </div>
                  ) : (
                    <div className="border border-slate-300 rounded-lg overflow-hidden flex flex-col bg-slate-50 p-4 text-sm text-slate-600 font-mono whitespace-pre-wrap">
                      Dear Sir/Madam,<br/><br/>
                      This is a Notification, please find attachment。<br/><br/>
                      This mail is sent from iService system automatically, please do not reply. Thanks<br/><br/>
                      Best regards & Thanks<br/>
                      iService Support Team
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">创建人</label>
                    <input type="text" disabled value={editingTemplate ? editingTemplate.createdBy : "System Admin"} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">创建时间点</label>
                    <input type="text" disabled value={editingTemplate ? new Date(editingTemplate.createdAt).toLocaleString() : new Date().toLocaleString()} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">更新人</label>
                    <input type="text" disabled value={editingTemplate ? editingTemplate.updatedBy : "System Admin"} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">更新时间</label>
                    <input type="text" disabled value={editingTemplate ? new Date(editingTemplate.updatedAt).toLocaleString() : new Date().toLocaleString()} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
                  </div>
                </div>
             </div>
             
             <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
               <button onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">取消</button>
               <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">保存</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
