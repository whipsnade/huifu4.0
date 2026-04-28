import React from 'react';
import { User, UserRole } from '../types';
import { MoreHorizontal, ShieldCheck, Shield, User as UserIcon, Building2 } from 'lucide-react';
import { MOCK_USERS } from '../constants';

interface UserTableProps {
  role: UserRole;
  title: string;
}

export const UserTableView: React.FC<UserTableProps> = ({ role, title }) => {
  const users = MOCK_USERS.filter(u => u.role === role);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Shield className="w-3 h-3"/> 管理员</span>;
      case UserRole.ENGINEER: return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><ShieldCheck className="w-3 h-3"/> 工程师</span>;
      case UserRole.VENDOR: return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Building2 className="w-3 h-3"/> 供应商</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><UserIcon className="w-3 h-3"/> 客户</span>;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title} 管理</h1>
          <p className="text-slate-500 text-sm">管理访问权限、资料和绩效</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + 新增
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">姓名 / ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">联系方式</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">角色 & 详情</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{user.email}</p>
                    <p className="text-xs text-slate-400">上次活跃: {user.lastActive}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getRoleBadge(user.role)}
                      {user.company && <p className="text-xs text-slate-500 pl-1">{user.company}</p>}
                      {user.specialization && <p className="text-xs text-slate-500 pl-1">专长: {user.specialization}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};