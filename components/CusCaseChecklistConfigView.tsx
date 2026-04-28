import React, { useState } from 'react';
import { ClipboardList, Plus, Save, ChevronRight, Settings2, Trash2 } from 'lucide-react';

interface ChecklistItem {
  id: string;
  task: string;
  isRequired: boolean;
  type: 'photo' | 'checkbox' | 'input';
}

interface ChecklistGroup {
  id: string;
  caseType: string;
  items: ChecklistItem[];
}

export const CusCaseChecklistConfigView: React.FC = () => {
  const [groups, setGroups] = useState<ChecklistGroup[]>([
    {
      id: '1',
      caseType: '上门维修 (POSEquipment)',
      items: [
        { id: 'i1', task: '签到位置核对', isRequired: true, type: 'checkbox' },
        { id: 'i2', task: '设备故障现象拍照', isRequired: true, type: 'photo' },
        { id: 'i3', task: '填写维修完成情况', isRequired: true, type: 'input' },
        { id: 'i4', task: '离店环境清理确认', isRequired: false, type: 'checkbox' },
      ]
    },
    {
      id: '2',
      caseType: '巡检服务 (Annual Maintenance)',
      items: [
        { id: 'i5', task: '巡检表格上传', isRequired: true, type: 'photo' },
        { id: 'i6', task: 'POS机清洁拍照', isRequired: true, type: 'photo' },
      ]
    }
  ]);

  const [activeGroupId, setActiveGroupId] = useState<string>('1');
  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];

  const handleAddTask = () => {
    const newTask: ChecklistItem = {
      id: Date.now().toString(),
      task: '新任务项',
      isRequired: true,
      type: 'checkbox'
    };
    setGroups(groups.map(g => g.id === activeGroupId ? {...g, items: [...g.items, newTask]} : g));
  };

  return (
    <div className="flex h-full bg-slate-50 min-h-screen">
      {/* Sidebar: Case Types */}
      <div className="w-80 border-r border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            工单类型
          </h2>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setActiveGroupId(group.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                activeGroupId === group.id 
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span>{group.caseType}</span>
              {activeGroupId === group.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Tasks for selected type */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">任务清单配置</h1>
              <p className="text-slate-500 text-sm mt-1">为 <span className="text-indigo-600 font-bold">{activeGroup.caseType}</span> 设置必填项及验收任务</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-shadow shadow-md">
              <Save className="w-4 h-4" />
              保存清单
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">任务明细 ({activeGroup.items.length})</span>
               <button 
                 onClick={handleAddTask}
                 className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-100"
               >
                 <Plus className="w-3 h-3" /> 添加项
               </button>
            </div>

            <div className="divide-y divide-slate-100">
               {activeGroup.items.map((item, idx) => (
                 <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400">
                       {idx + 1}
                    </div>
                    <div className="flex-1">
                       <input 
                         type="text" 
                         value={item.task}
                         onChange={(e) => {
                           const newGroups = groups.map(g => g.id === activeGroupId ? {
                             ...g,
                             items: g.items.map(i => i.id === item.id ? {...i, task: e.target.value} : i)
                           } : g);
                           setGroups(newGroups);
                         }}
                         className="w-full bg-transparent border-none focus:ring-0 font-medium text-slate-900 p-0 text-sm"
                       />
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">类型:</span>
                          <select 
                            value={item.type}
                            onChange={(e) => {
                               const newGroups = groups.map(g => g.id === activeGroupId ? {
                                 ...g,
                                 items: g.items.map(i => i.id === item.id ? {...i, type: e.target.value as any} : i)
                               } : g);
                               setGroups(newGroups);
                            }}
                            className="bg-slate-50 border-transparent rounded-lg text-xs font-bold text-slate-600 focus:ring-0"
                          >
                             <option value="checkbox">打钩确认</option>
                             <option value="photo">拍照/录屏</option>
                             <option value="input">填写数据</option>
                          </select>
                       </div>
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={item.isRequired}
                            onChange={(e) => {
                               const newGroups = groups.map(g => g.id === activeGroupId ? {
                                 ...g,
                                 items: g.items.map(i => i.id === item.id ? {...i, isRequired: e.target.checked} : i)
                               } : g);
                               setGroups(newGroups);
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-xs font-bold text-slate-500">必填</span>
                       </label>
                       <button className="p-2 text-slate-300 hover:text-red-500 rounded-lg group-hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-600">
             <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-600" />
                高级设置
             </h3>
             <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                   <div>
                      <p className="text-sm font-bold text-slate-700">自动带入历史记录</p>
                      <p className="text-xs text-slate-400">开启后，同门店同类型任务将预选上次的设置</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-10 h-5 bg-slate-200 rounded-full transition-all appearance-none cursor-pointer checked:bg-indigo-600 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 before:transition-all" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                   <div>
                      <p className="text-sm font-bold text-slate-700">允许工程师跳过可选任务</p>
                      <p className="text-xs text-slate-400">选中的任务在工程师APP端将以'可选'标签展示</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-10 h-5 bg-slate-200 rounded-full transition-all appearance-none cursor-pointer checked:bg-indigo-600 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 before:transition-all" />
                </label>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
