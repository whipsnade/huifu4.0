import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, 
  Search, 
  Table as TableIcon, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Settings2, 
  Plus, 
  X, 
  Database,
  Terminal,
  PlayCircle,
  Eye,
  Filter,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart as ReChartLine, Line,
  PieChart as ReChartPie, Pie, Cell
} from 'recharts';
import { CustomizedReport } from './CusCustomizeReportConfigDashboard';

// Metadata for tables and fields
const databaseSchema = [
  {
    table: 'customer',
    label: '客户表',
    fields: [
      { name: 'id', label: '客户ID', type: 'string' },
      { name: 'name', label: '客户名称', type: 'string' },
      { name: 'email', label: '联系邮箱', type: 'string' },
      { name: 'customer_level', label: '客户等级', type: 'enum', options: ['Standard', 'Silver', 'Gold', 'Platinum'] },
      { name: 'join_date', label: '入驻日期', type: 'date' },
    ]
  },
  {
    table: 'store',
    label: '门店表',
    fields: [
      { name: 'id', label: '门店ID', type: 'string' },
      { name: 'store_number', label: '门店编号', type: 'string' },
      { name: 'name', label: '门店名称', type: 'string' },
      { name: 'market', label: '所属市场', type: 'string' },
      { name: 'brand', label: '所属品牌', type: 'string' },
      { name: 'region', label: '所在区域', type: 'string' },
    ]
  },
  {
    table: 'work_order',
    label: '工单表',
    fields: [
      { name: 'id', label: '工单ID', type: 'string' },
      { name: 'title', label: '工单标题', type: 'string' },
      { name: 'status', label: '工单状态', type: 'enum', options: ['Pending', 'In Progress', 'Completed', 'Cancelled'] },
      { name: 'amount', label: '金额', type: 'number' },
      { name: 'date', label: '创建日期', type: 'date' },
      { name: 'case_level', label: '案件等级', type: 'string' },
    ]
  },
  {
    table: 'engineer',
    label: '工程师表',
    fields: [
      { name: 'id', label: '工程师ID', type: 'string' },
      { name: 'name', label: '工程师姓名', type: 'string' },
      { name: 'city', label: '所在城市', type: 'string' },
      { name: 'level', label: '等级', type: 'enum', options: ['Junior', 'Mid', 'Senior', 'Expert'] },
      { name: 'csat', label: '满意度', type: 'number' },
    ]
  }
];

type ChartType = 'table' | 'bar' | 'line' | 'pie';

interface SelectedField {
  tableName: string;
  fieldName: string;
  label: string;
  type: string;
}

interface FilterCondition {
  id: string;
  tableName: string;
  fieldName: string;
  operator: string;
  value: string;
}

interface Props {
  initialData?: CustomizedReport;
  onSave: (report: CustomizedReport) => void;
  onBack: () => void;
}

export function CusCustomizeReportConfigView({ initialData, onSave, onBack }: Props) {
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>(initialData?.config?.selectedFields || []);
  const [filters, setFilters] = useState<FilterCondition[]>(initialData?.config?.filters || []);
  const [chartType, setChartType] = useState<ChartType>(initialData?.chartType || 'table');
  const [reportName, setReportName] = useState(initialData?.name || '未命名自定义报表');
  const [reportDescription, setReportDescription] = useState(initialData?.description || '');
  const [activeStep, setActiveStep] = useState<'fields' | 'preview'>('fields');
  const [configTab, setConfigTab] = useState<'filters' | 'columns'>('filters');

  // Toggle field selection
  const toggleField = (tableName: string, field: { name: string; label: string; type: string }) => {
    const fieldKey = `${tableName}.${field.name}`;
    const exists = selectedFields.some(f => `${f.tableName}.${f.fieldName}` === fieldKey);

    if (exists) {
      setSelectedFields(prev => prev.filter(f => `${f.tableName}.${f.fieldName}` !== fieldKey));
    } else {
      setSelectedFields(prev => [...prev, {
        tableName,
        fieldName: field.name,
        label: field.label,
        type: field.type
      }]);
    }
  };

  // Filter operators based on type
  const getOperators = (type: string) => {
    switch (type) {
      case 'number': return ['=', '>', '<', '>=', '<=', '!='];
      case 'date': return ['=', '>', '<', '>=', '<=', 'BETWEEN'];
      case 'enum': return ['=', '!=', 'IN'];
      default: return ['=', 'LIKE', '!=', 'CONTAINS'];
    }
  };

  const addFilter = () => {
    if (selectedFields.length === 0 && databaseSchema.length > 0) {
      setFilters(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        tableName: databaseSchema[0].table,
        fieldName: databaseSchema[0].fields[0].name,
        operator: '=',
        value: ''
      }]);
      return;
    }
    const firstField = selectedFields[0] || { tableName: databaseSchema[0].table, fieldName: databaseSchema[0].fields[0].name };
    setFilters(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      tableName: firstField.tableName,
      fieldName: firstField.fieldName,
      operator: '=',
      value: ''
    }]);
  };

  const removeFilter = (id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    setFilters(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  // Generated SQL
  const autoSql = useMemo(() => {
    if (selectedFields.length === 0) return '-- Please select at least one field to generate SQL';

    const tables = Array.from(new Set(selectedFields.map(f => f.tableName)));
    const selectClause = selectedFields.map(f => `  ${f.tableName}.${f.fieldName} AS "${f.label}"`).join(',\n');
    let fromClause = `FROM ${tables[0]}`;
    
    for (let i = 1; i < tables.length; i++) {
      fromClause += `\nJOIN ${tables[i]} ON ${tables[0]}.id = ${tables[i]}.customer_id`;
    }

    let whereClause = '';
    if (filters.length > 0) {
      whereClause = '\nWHERE ' + filters.map(f => {
        const val = isNaN(Number(f.value)) || f.value === '' ? `'${f.value}'` : f.value;
        return `${f.tableName}.${f.fieldName} ${f.operator} ${val}`;
      }).join(' AND ');
    }

    return `SELECT\n${selectClause}\n${fromClause}${whereClause};\nLIMIT 100;`;
  }, [selectedFields, filters]);

  const [editableSql, setEditableSql] = useState(autoSql);

  // Sync auto SQL to editable if it wasn't modified manually yet (simple implementation)
  useEffect(() => {
    setEditableSql(autoSql);
  }, [autoSql]);

  const handleSave = () => {
    const report: CustomizedReport = {
      id: initialData?.id || `cr-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      chartType: chartType,
      creator: initialData?.creator || '管理员',
      updatedAt: new Date().toISOString().split('T')[0],
      config: {
        selectedFields,
        filters,
        manualSql: editableSql
      }
    };
    onSave(report);
  };

  // Mock Report Data
  const reportData = useMemo(() => {
    return [
      { name: 'KFC 上海', value: 400, date: '2024-01-01', status: 'Completed' },
      { name: 'Pizza Hut 北京', value: 300, date: '2024-01-02', status: 'Pending' },
      { name: 'KFC 广州', value: 500, date: '2024-01-03', status: 'Completed' },
      { name: 'Taco Bell 深圳', value: 200, date: '2024-01-04', status: 'Cancelled' },
      { name: 'KFC 杭州', value: 600, date: '2024-01-05', status: 'Completed' },
    ];
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-colors" onClick={onBack}>
            <span>运营</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">自定义报表</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <input 
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="text-xl font-black text-slate-900 border-none outline-none focus:ring-0 p-0 w-64 bg-transparent placeholder:text-slate-300"
            placeholder="报表名称..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['fields', 'preview'] as const).map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={cn(
                  "px-4 py-1.5 text-xs font-black rounded-lg transition-all uppercase tracking-widest",
                  activeStep === step ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {step === 'fields' && '报表设计'}
                {step === 'preview' && '效果预览'}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-slate-200 mx-2" />
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Save className="w-4 h-4" />
            保存报表
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Form Items / Field Selection */}
        <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索库表字段..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
            {databaseSchema.map((table) => (
              <div key={table.table} className="space-y-1">
                <div className="px-3 py-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-900" />
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{table.label}</span>
                </div>
                <div className="space-y-1 pl-2">
                  {table.fields.map((field) => {
                    const isSelected = selectedFields.some(f => f.tableName === table.table && f.fieldName === field.name);
                    return (
                      <button
                        key={field.name}
                        onClick={() => toggleField(table.table, field)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all",
                          isSelected 
                            ? "bg-indigo-50 text-indigo-700 font-bold" 
                            : "text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        <span>{field.label}</span>
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all",
                          isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-200"
                        )}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
          {/* Toolbar / Config */}
          <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">报表类型</label>
                  <div className="flex gap-2">
                    {(['table', 'bar', 'line', 'pie'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          chartType === type ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        )}
                      >
                        {type === 'table' && <TableIcon className="w-4 h-4" />}
                        {type === 'bar' && <BarChart3 className="w-4 h-4" />}
                        {type === 'line' && <LineChart className="w-4 h-4" />}
                        {type === 'pie' && <PieChart className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">已选字段</span>
                <span className="text-sm font-black text-slate-900">{selectedFields.length} 个字段</span>
              </div>
              <button 
                onClick={addFilter}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-600 shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col p-8 gap-6 custom-scrollbar">
            {/* Step Content: FIELDS & FILTERS (Config Mode) */}
            {activeStep === 'fields' && (
              <div className="flex flex-col gap-6 flex-1 min-h-0">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl flex flex-col shrink-0">
                  <div className="absolute top-0 right-0 p-8">
                    <Terminal className="w-24 h-24 text-white opacity-5 rotate-12" />
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                      <Terminal className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white tracking-tight">SQL 逻辑脚本生成</h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Editable Logic Script</p>
                    </div>
                  </div>

                  <textarea
                    value={editableSql}
                    onChange={(e) => setEditableSql(e.target.value)}
                    className="flex-1 min-h-[160px] p-6 bg-slate-800/50 border border-white/5 rounded-2xl font-mono text-sm leading-relaxed text-indigo-200 focus:ring-0 outline-none scrollbar-none resize-none"
                    spellCheck={false}
                  />

                  <div className="mt-6 flex justify-end gap-3">
                    <button 
                      onClick={() => setEditableSql(autoSql)}
                      className="px-5 py-2.5 bg-white/5 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                    >
                      重新生成 SQL
                    </button>
                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/50 flex items-center gap-2 active:scale-95">
                      <PlayCircle className="w-4 h-4" />
                      运行结果预览
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex-1 min-h-0 flex flex-col">
                  {/* Internal Tabs for Config */}
                  <div className="flex items-center justify-between mb-6 shrink-0 border-b border-slate-50 pb-4">
                    <div className="flex gap-8">
                      <button 
                        onClick={() => setConfigTab('filters')}
                        className={cn(
                          "relative pb-2 text-sm font-black uppercase tracking-widest transition-all",
                          configTab === 'filters' ? "text-slate-900" : "text-slate-300 hover:text-slate-400"
                        )}
                      >
                        筛选条件设计
                        {configTab === 'filters' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full" />}
                      </button>
                      <button 
                        onClick={() => setConfigTab('columns')}
                        className={cn(
                          "relative pb-2 text-sm font-black uppercase tracking-widest transition-all",
                          configTab === 'columns' ? "text-slate-900" : "text-slate-300 hover:text-slate-400"
                        )}
                      >
                        已选字段摘要
                        {configTab === 'columns' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full" />}
                      </button>
                    </div>
                    {configTab === 'filters' && (
                      <button 
                        onClick={addFilter}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-100"
                      >
                        <Plus className="w-4 h-4" />
                        添加条件
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {configTab === 'filters' ? (
                      <div className="space-y-4">
                        {filters.length === 0 ? (
                          <div className="h-48 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-300">
                            <Filter className="w-10 h-10 mb-3 opacity-50" />
                            <p className="text-xs font-bold italic">暂无筛选条件，点击右上方添加</p>
                          </div>
                        ) : (
                          filters.map((filter) => {
                            const field = selectedFields.find(f => f.tableName === filter.tableName && f.fieldName === filter.fieldName) || (databaseSchema.find(t => t.table === filter.tableName)?.fields.find(f => f.name === filter.fieldName)) || { type: 'string' };
                            return (
                              <div key={filter.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-start group relative">
                                <button 
                                  onClick={() => removeFilter(filter.id)}
                                  className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm opacity-0 group-hover:opacity-100 z-10"
                                >
                                  <X className="w-4 h-4" />
                                </button>

                                <div className="flex-1 space-y-2">
                                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">数据源字段</label>
                                  <select 
                                    value={`${filter.tableName}.${filter.fieldName}`}
                                    onChange={(e) => {
                                      const [table, col] = e.target.value.split('.');
                                      updateFilter(filter.id, { tableName: table, fieldName: col });
                                    }}
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                                  >
                                    {databaseSchema.map(table => (
                                      <optgroup key={table.table} label={table.label}>
                                        {table.fields.map(f => (
                                          <option key={`${table.table}.${f.name}`} value={`${table.table}.${f.name}`}>
                                            {f.label}
                                          </option>
                                        ))}
                                      </optgroup>
                                    ))}
                                  </select>
                                </div>

                                <div className="w-32 space-y-2">
                                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">操作符</label>
                                  <select 
                                    value={filter.operator}
                                    onChange={(e) => updateFilter(filter.id, { operator: e.target.value })}
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-600 outline-none"
                                  >
                                    {getOperators((field as any).type).map(op => (
                                      <option key={op} value={op}>{op}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="flex-[2] space-y-2">
                                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">匹配值</label>
                                  <input 
                                    value={filter.value}
                                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                    placeholder="输入值..."
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                                  />
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    ) : (
                      <div>
                        {selectedFields.length === 0 ? (
                          <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 font-bold italic">
                            请从左侧选择报表字段
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                            {selectedFields.map((f, idx) => (
                              <div key={idx} className="flex flex-col gap-1 p-3 bg-slate-50 border border-slate-100 rounded-xl group relative">
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all">
                                  <button onClick={() => toggleField(f.tableName, { name: f.fieldName, label: f.label, type: f.type })} className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-300 rounded-lg">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase truncate max-w-[90%]">{f.tableName}.{f.fieldName}</span>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black text-slate-800">{f.label}</span>
                                  <span className={cn(
                                    "text-[7px] px-1 py-0.5 rounded-md font-black uppercase",
                                    f.type === 'string' ? "bg-blue-100 text-blue-600" :
                                    f.type === 'number' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                  )}>{f.type}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

             {/* Step Content: PREVIEW */}
             {activeStep === 'preview' && (
              <div className="flex flex-col gap-8 flex-1 min-h-0 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                 <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-2xl">
                      <Eye className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">报表可视预览</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time Visualization Preview</p>
                    </div>
                  </div>
                  
                  {chartType !== 'table' && (
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">图表外观</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className={cn("w-3 h-3 rounded-full", i === 1 ? 'bg-indigo-500' : i === 2 ? 'bg-emerald-500' : 'bg-amber-500')} />)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-h-0 bg-slate-50/30 rounded-3xl border border-slate-100 p-8 flex items-center justify-center relative">
                  {selectedFields.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <AlertCircle className="w-12 h-12 opacity-50" />
                      <p className="text-sm font-bold italic">请先在第一步选择报表所需字段</p>
                    </div>
                  ) : chartType === 'table' ? (
                    <div className="w-full h-full overflow-auto custom-scrollbar bg-white rounded-2xl border border-slate-100 shadow-inner">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 sticky top-0">
                            {selectedFields.map(f => (
                              <th key={`${f.tableName}.${f.fieldName}`} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                {f.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[1, 2, 3, 4, 5].map(i => (
                            <tr key={i} className="hover:bg-indigo-50/30 transition-colors border-b border-slate-50 last:border-0">
                               {selectedFields.map((f, j) => (
                                 <td key={j} className="px-6 py-4 text-xs font-bold text-slate-700">
                                   Sample {i}-{j}
                                 </td>
                               ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="w-full h-full max-h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                          <BarChart data={reportData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                            <RechartsTooltip 
                              contentStyle={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                padding: '12px 16px'
                              }}
                            />
                            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                          </BarChart>
                        ) : chartType === 'line' ? (
                          <ReChartLine data={reportData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 4, stroke: '#fff' }} />
                          </ReChartLine>
                        ) : (
                           <ReChartPie>
                            <Pie
                              data={reportData}
                              cx="50%"
                              cy="50%"
                              innerRadius={80}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {reportData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                          </ReChartPie>
                        )}
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      <Terminal className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Report</p>
                      <p className="text-xs font-bold text-white">报表结果已缓存，更新字段将自动重载预览</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800">导出数据 (CSV)</button>
                    <button className="px-4 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                       <Plus className="w-3.5 h-3.5" />
                       添加到看板
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
