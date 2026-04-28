import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Briefcase, 
  Tag, 
  UserPlus, 
  X, 
  Save,
  Trash2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AssigneeGroup, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

interface CusCaseAssigneeConfigViewProps {
  groups: AssigneeGroup[];
  onSave: (group: Omit<AssigneeGroup, 'id' | 'createdAt'>, id?: string) => void;
  onDelete?: (id: string) => void;
}

export default function CusCaseAssigneeConfigView({ 
  groups, 
  onSave,
  onDelete 
}: CusCaseAssigneeConfigViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AssigneeGroup | null>(null);
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [type, setType] = useState<'Service Desk' | 'Supplier'>('Service Desk');
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState('');
  const [searchResults, setSearchResults] = useState<typeof MOCK_USERS>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const engineers = MOCK_USERS.filter(u => u.role === UserRole.ENGINEER);

  const openNew = () => {
    setEditingGroup(null);
    setCustomerName('');
    setGroupName('');
    setType('Service Desk');
    setMembers([]);
    setIsEditing(true);
  };

  const openEdit = (group: AssigneeGroup) => {
    setEditingGroup(group);
    setCustomerName(group.customerName);
    setGroupName(group.groupName);
    setType(group.type);
    setMembers(group.members);
    setIsEditing(true);
  };

  const handleSearchChange = (val: string) => {
    setNewMember(val);
    if (val.trim()) {
      const filtered = engineers.filter(eng => 
        eng.name.toLowerCase().includes(val.toLowerCase()) ||
        eng.name.includes(val)
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.trim()) {
      // If there are search results, and the input exactly matches one or we want to pick the first one
      const exactMatch = searchResults.find(r => r.name.toLowerCase() === newMember.trim().toLowerCase());
      const memberToAdd = exactMatch ? exactMatch.name : (searchResults.length > 0 ? searchResults[0].name : newMember.trim());
      
      if (!members.includes(memberToAdd)) {
        setMembers([...members, memberToAdd]);
      }
      setNewMember('');
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const selectMemberFromList = (name: string) => {
    if (!members.includes(name)) {
      setMembers([...members, name]);
    }
    setNewMember('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const removeMember = (name: string) => {
    setMembers(members.filter(m => m !== name));
  };

  const handleSave = () => {
    onSave({
      customerName,
      groupName,
      type,
      members
    }, editingGroup?.id);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden font-sans relative">
      <header className="px-8 py-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">派单组配置</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">管理各客户的工单负责人分组及成员权限</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索组名或客户..." 
              className="pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
            />
          </div>
          <button 
            onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            新建派单组
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {/* Create New Placeholder Card */}
          <div 
            onClick={openNew}
            className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[260px] group cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:scale-110 transition-all border border-slate-100">
              <UserPlus className="w-7 h-7 text-slate-400 group-hover:text-indigo-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 tracking-tight">添加新派单组</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">配置新的响应团队或外部供应商</p>
          </div>

          {groups.map((group) => (
            <div 
              key={group.id}
              onClick={() => openEdit(group)}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all group relative overflow-hidden cursor-pointer flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  group.type === 'Service Desk' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight truncate">{group.groupName}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.customerName}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      group.type === 'Service Desk' ? "text-indigo-500" : "text-emerald-500"
                    )}>{group.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Team Members ({group.members.length})</label>
                  <div className="flex flex-wrap gap-1.5">
                    {group.members.slice(0, 3).map((m, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] font-medium rounded-lg border border-slate-100">
                        {m}
                      </span>
                    ))}
                    {group.members.length > 3 && (
                      <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[11px] font-bold rounded-lg border border-slate-100">
                        +{group.members.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{group.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                  <span>管理详情</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal / Slide-over */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setIsEditing(false)}
          />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <header className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {editingGroup ? '编辑派单组' : '新建派单组'}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">请填写组别信息与成员权限</p>
              </div>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">客户名称</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text"
                      placeholder="例如: YUM"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-12 pl-12 pr-6 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">派单组名称</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text"
                      placeholder="例如: 华东区二线支持组"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full h-12 pl-12 pr-6 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">组别类型</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setType('Service Desk')}
                      className={cn(
                        "h-12 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2",
                        type === 'Service Desk' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300"
                      )}
                    >
                      <Users className="w-4 h-4" />
                      服务台 (Internal)
                    </button>
                    <button 
                      onClick={() => setType('Supplier')}
                      className={cn(
                        "h-12 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2",
                        type === 'Supplier' ? "border-emerald-600 bg-emerald-50 text-emerald-600" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300"
                      )}
                    >
                      <Briefcase className="w-4 h-4" />
                      供应商 (External)
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">组员名单 ({members.length})</label>
                  </div>
                  
                  <div className="relative">
                    <form onSubmit={handleAddMember} className="relative z-10">
                      <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input 
                        type="text"
                        placeholder="输入名字查找并按回车添加工程师..."
                        value={newMember}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => {
                          if (newMember.trim()) setShowSearchResults(true);
                        }}
                        className="w-full h-12 pl-12 pr-6 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                      />
                    </form>

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[110] max-h-60 overflow-y-auto overflow-x-hidden">
                        {searchResults.map((eng) => (
                          <div 
                            key={eng.id}
                            onClick={() => selectMemberFromList(eng.name)}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                {eng.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-700">{eng.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{eng.specialization || '工程师'}</p>
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {showSearchResults && searchResults.length === 0 && newMember.trim() && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[110] p-4 text-center">
                        <p className="text-sm text-slate-400">未找到匹配的工程师</p>
                      </div>
                    )}

                    {/* Click outside to close */}
                    {showSearchResults && (
                      <div 
                        className="fixed inset-0 z-[105]" 
                        onClick={() => setShowSearchResults(false)}
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {members.map((m) => (
                      <div key={m} className="flex items-center gap-2 bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2 rounded-full border border-slate-200 group">
                        <span>{m}</span>
                        <X 
                          className="w-3.5 h-3.5 text-slate-400 hover:text-red-500 cursor-pointer" 
                          onClick={() => removeMember(m)}
                        />
                      </div>
                    ))}
                    {members.length === 0 && (
                      <p className="text-xs text-slate-400 italic py-4">提示: 至少添加一名组成员以确保任务可指派</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <footer className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                取消
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSave}
                  disabled={!customerName || !groupName}
                  className="flex items-center gap-2 px-10 py-3 bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  保存配置
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

