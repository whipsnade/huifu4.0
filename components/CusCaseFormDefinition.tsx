import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  Search,
  Type,
  AlignLeft,
  Calendar,
  Upload,
  CheckSquare,
  ChevronDown,
  LayoutTemplate,
  GripVertical,
  X,
  Table as TableIcon,
  Paperclip,
  MoveUp,
  MoveDown,
  Columns,
  MousePointer2,
  ToggleLeft,
  MapPin,
  Save,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { cn } from '../lib/utils';
import { FormField, FormTemplate } from '../types';

interface CusCaseFormDefinitionProps {
  template?: FormTemplate | null;
  onSave: (template: FormTemplate) => void;
  onBack: () => void;
}

const COMPONENT_TYPES = [
  { type: 'text', label: '单行文本 (Short Text)', icon: <Type size={18} /> },
  { type: 'textarea', label: '多行文本 (Paragraph)', icon: <AlignLeft size={18} /> },
  { type: 'date', label: '日期选择 (Date Picker)', icon: <Calendar size={18} /> },
  { type: 'file', label: '文件上传 (File Upload)', icon: <Upload size={18} /> },
  { type: 'attachment', label: '附件上传 (Attachment)', icon: <Paperclip size={18} /> },
  { type: 'checkbox', label: '复选框组 (Checkbox)', icon: <CheckSquare size={18} /> },
  { type: 'dropdown', label: '下拉菜单 (Dropdown)', icon: <ChevronDown size={18} /> },
  { type: 'table', label: '表格 (Table/Grid)', icon: <TableIcon size={18} /> },
  { type: 'button', label: '按钮 (Button)', icon: <MousePointer2 size={18} /> },
  { type: 'switch', label: '开关 (Switch)', icon: <ToggleLeft size={18} /> },
  { type: 'location', label: '定位 (Geolocation)', icon: <MapPin size={18} /> },
];

const WIDTH_OPTIONS = [
  { value: '1/4', label: '25%' },
  { value: '1/3', label: '33%' },
  { value: '1/2', label: '50%' },
  { value: '2/3', label: '66%' },
  { value: '3/4', label: '75%' },
  { value: 'full', label: '100%' },
];

export default function CusCaseFormDefinition({ template, onSave, onBack }: CusCaseFormDefinitionProps) {
  const [templateName, setTemplateName] = useState(template?.name || '新建表单模板 (New Template)');
  const [fields, setFields] = useState<FormField[]>(template?.fields || [
    {
      id: 'f-1',
      type: 'text',
      label: '全称 (Full Name)',
      placeholder: 'Enter your full legal name...',
      required: true,
      width: '1/2'
    }
  ]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(fields[0]?.id || null);
  const isReadOnly = template?.status === 'Deprecated';

  useEffect(() => {
    if (template) {
      setTemplateName(template.name);
      setFields(template.fields);
      setSelectedFieldId(template.fields[0]?.id || null);
    }
  }, [template]);

  const addField = (type: string) => {
    if (isReadOnly) return;
    const newField: FormField = {
      id: `f-${Date.now()}`,
      type,
      label: COMPONENT_TYPES.find(c => c.type === type)?.label.split(' (')[0] || 'New Field',
      placeholder: '请输入内容...',
      required: false,
      width: '1/2'
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const removeField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReadOnly) return;
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    if (isReadOnly) return;
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSave = () => {
    const isNew = !template?.id;
    const result: FormTemplate = {
      id: template?.id || `ft-${Date.now()}`,
      name: templateName,
      version: template?.version || '1.0.0',
      status: template?.status === 'Published' ? 'Unpublished' : (template?.status || 'Unpublished'),
      creator: template?.creator || 'Admin',
      createdAt: template?.createdAt || new Date().toISOString().replace('T', ' ').split('.')[0],
      fields
    };
    onSave(result);
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  const renderFieldInput = (field: FormField) => {
    switch (field.type) {
      case 'textarea':
        return <textarea className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white focus:outline-none" rows={3} placeholder={field.placeholder} disabled />;
      case 'date':
        return (
          <div className="relative">
            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white focus:outline-none" placeholder={field.placeholder} disabled />
            <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        );
      case 'file':
      case 'attachment':
        return (
          <div className="w-full px-4 py-4 border-2 border-dashed border-slate-200 rounded-md bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1">
            <Upload size={20} />
            <span className="text-xs font-medium">点击或拖拽上传文件</span>
          </div>
        );
      case 'switch':
        return (
          <div className="w-12 h-6 bg-slate-200 rounded-full relative">
            <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
          </div>
        );
      case 'button':
        return (
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-sm">{field.label}</button>
        );
      case 'location':
        return (
          <div className="w-full px-4 py-10 border border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-3">
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-500 border border-indigo-50"><MapPin size={20} /></div>
             <span className="text-xs font-bold text-slate-400">点击获取当前地理位置信息</span>
          </div>
        );
      case 'table':
        return (
          <div className="w-full border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-slate-500 font-bold">列 1</th>
                  <th className="px-3 py-2 text-slate-500 font-bold">列 2</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 italic text-slate-300">
                  <td className="px-3 py-2 whitespace-nowrap">示例数据...</td>
                  <td className="px-3 py-2 whitespace-nowrap">示例数据...</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white focus:outline-none" placeholder={field.placeholder} disabled />;
    }
  };

  const getWidthClass = (width: string) => {
    switch (width) {
      case '1/4': return 'w-1/4';
      case '1/3': return 'w-1/3';
      case '1/2': return 'w-1/2';
      case '2/3': return 'w-2/3';
      case '3/4': return 'w-3/4';
      case 'full': return 'w-full';
      default: return 'w-full';
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#F8F9FA] rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <LayoutTemplate className="text-indigo-600" size={20} />
            表单设计器 (Form Designer)
          </h2>
          {isReadOnly && (
            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase ml-2">READ ONLY (已弃用)</span>
          )}
        </div>
        <div className="flex gap-3">
           <button 
            onClick={handleSave}
            disabled={isReadOnly}
            className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
           >
             <Save size={16} />
             保存模板
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Field Components */}
        {!isReadOnly && (
          <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 p-5 overflow-y-auto">
            <h3 className="font-bold text-slate-500 text-[10px] uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">基础控件 (Basic Components)</h3>
            <div className="grid grid-cols-1 gap-2 mb-8">
              {COMPONENT_TYPES.slice(0, 7).map(comp => (
                <div 
                  key={comp.type}
                  onClick={() => addField(comp.type)}
                  className="border border-slate-100 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 bg-white transition-all group border-b-2 border-slate-100/50"
                >
                    <div className="bg-slate-50 p-2.5 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                      {comp.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{comp.label}</span>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-slate-500 text-[10px] uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">高级控件 (Advanced)</h3>
            <div className="grid grid-cols-1 gap-2">
              {COMPONENT_TYPES.slice(7).map(comp => (
                <div 
                  key={comp.type}
                  onClick={() => addField(comp.type)}
                  className="border border-slate-100 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 bg-white transition-all group border-b-2 border-slate-100/50"
                >
                    <div className="bg-slate-50 p-2.5 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                      {comp.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{comp.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Canvas Area */}
        <div className="flex-1 bg-slate-50 overflow-y-auto p-10 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 p-10 min-h-[90vh]">
                <div className="mb-10 border-b border-slate-100 pb-8 flex flex-col gap-4">
                   <div className="group relative">
                      <input 
                        type="text" 
                        value={templateName}
                        onChange={(e) => !isReadOnly && setTemplateName(e.target.value)}
                        readOnly={isReadOnly}
                        className={cn(
                          "text-3xl font-black text-slate-900 bg-transparent border-none outline-none focus:ring-0 w-full p-0",
                          !isReadOnly && "hover:bg-slate-50 focus:bg-slate-50 cursor-edit"
                        )}
                      />
                      {!isReadOnly && <div className="absolute -bottom-2 left-0 h-1 w-0 bg-indigo-600 group-hover:w-full transition-all duration-300"></div>}
                   </div>
                   <p className="text-slate-400 text-sm font-medium">配置业务字段信息，设计完成后点击保存以更新版本。</p>
                </div>
                
                {/* Reorderable Form Elements */}
                {isReadOnly ? (
                  <div className="flex flex-wrap -mx-3">
                    {fields.map((field) => (
                      <div 
                        key={field.id}
                        className={cn("px-3 mb-6 relative", getWidthClass(field.width))}
                      >
                         <div className="border-2 border-slate-100 bg-white rounded-2xl p-6 h-full shadow-sm">
                            <div className="mb-3">
                                <label className="block text-sm font-black text-slate-800 mb-1 flex items-center gap-1 uppercase tracking-tight">
                                {field.label} {field.required && <span className="text-red-500 text-xs">*</span>}
                                </label>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                {field.type.toUpperCase()} | {WIDTH_OPTIONS.find(o => o.value === field.width)?.label}
                                </span>
                            </div>
                            {renderFieldInput(field)}
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Reorder.Group 
                    axis="y" 
                    values={fields} 
                    onReorder={setFields}
                    className="flex flex-wrap -mx-3"
                  >
                    <AnimatePresence initial={false}>
                      {fields.map((field) => (
                        <Reorder.Item 
                          key={field.id}
                          value={field}
                          className={cn("px-3 mb-6 relative group", getWidthClass(field.width))}
                        >
                          <motion.div 
                            layout
                            onClick={() => setSelectedFieldId(field.id)}
                            className={cn(
                              "border-2 rounded-2xl p-6 transition-all duration-300 relative h-full",
                              selectedFieldId === field.id 
                                ? "border-indigo-500 bg-indigo-50/20 ring-4 ring-indigo-500/5 shadow-lg" 
                                : "border-slate-100 bg-white hover:border-slate-300 shadow-sm"
                            )}
                          >
                            {/* Controls Overlay */}
                            <div className={cn(
                              "absolute -top-3 right-4 flex items-center gap-1 transition-all duration-200 opacity-0 group-hover:opacity-100",
                              selectedFieldId === field.id && "opacity-100"
                            )}>
                              <button 
                                onClick={(e) => removeField(field.id, e)}
                                className="p-2 bg-white border border-slate-200 text-red-500 rounded-lg hover:bg-red-50 shadow-lg" 
                                title="删除"
                              >
                                <X size={14} />
                              </button>
                              <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg cursor-grab active:cursor-grabbing">
                                <GripVertical size={14} />
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="block text-sm font-black text-slate-800 mb-1 flex items-center gap-1 uppercase tracking-tight">
                                {field.label} {field.required && <span className="text-red-500 text-xs">*</span>}
                              </label>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                {field.type.toUpperCase()} | {WIDTH_OPTIONS.find(o => o.value === field.width)?.label}
                              </span>
                            </div>
                            
                            {renderFieldInput(field)}
                          </motion.div>
                        </Reorder.Item>
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                )}

                {!isReadOnly && fields.length === 0 && (
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center justify-center text-slate-300 bg-white/50">
                    <LayoutTemplate size={48} className="mb-4 opacity-20" />
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-400">请点击左侧组件开始设计表单</span>
                  </div>
                )}
            </div>
        </div>

        {/* Right Sidebar - Field Properties */}
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-xl z-20 shrink-0 overflow-y-auto">
           <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-slate-50/30">
              <div className="p-1.5 bg-indigo-600 text-white rounded-lg"><Settings size={18} /></div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">字段属性配置</h3>
           </div>
           
           {selectedField ? (
             <div className="flex-1 p-6 space-y-6">
                <div className={cn(isReadOnly && "opacity-50 pointer-events-none")}>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">标签名称 (Label Text)</label>
                   <input 
                    type="text" 
                    value={selectedField.label}
                    onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                    className="w-full h-12 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm" 
                   />
                </div>
                
                <div className={cn(isReadOnly && "opacity-50 pointer-events-none")}>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">占位符 (Placeholder)</label>
                   <input 
                    type="text" 
                    value={selectedField.placeholder}
                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                    className="w-full h-12 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm" 
                   />
                </div>

                <div className={cn(isReadOnly && "opacity-50 pointer-events-none")}>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">显示宽度 (Field Width)</label>
                   <div className="grid grid-cols-2 gap-2">
                      {WIDTH_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => updateField(selectedField.id, { width: opt.value as any })}
                          className={cn(
                            "py-2.5 rounded-xl border-2 text-[11px] font-bold transition-all flex items-center justify-center gap-2",
                            selectedField.width === opt.value
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                              : "bg-white border-slate-100 text-slate-500 hover:border-indigo-200"
                          )}
                        >
                          <Columns size={12} />
                          {opt.label}
                        </button>
                      ))}
                   </div>
                </div>
                
                <div className={cn("bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100", isReadOnly && "opacity-50 pointer-events-none")}>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tight">必填项 (Required Field)</span>
                      <div 
                        onClick={() => updateField(selectedField.id, { required: !selectedField.required })}
                        className={cn(
                          "w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200",
                          selectedField.required ? "bg-indigo-600" : "bg-slate-300"
                        )}
                      >
                        <motion.div 
                          animate={{ x: selectedField.required ? 26 : 2 }}
                          className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm"
                        ></motion.div>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 border border-slate-200">
                  <Plus size={32} className="text-slate-200" />
                </div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">未选中字段</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">点击设计区域的表单项，<br />以在此处配置其属性</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
