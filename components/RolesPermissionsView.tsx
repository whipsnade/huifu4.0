import React from 'react';

export const RolesPermissionsView: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">角色与权限</h1>
          <p className="text-slate-500 text-sm mt-1">管理系统角色及其对应的权限设置</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
        角色与权限功能开发中...
      </div>
    </div>
  );
};
