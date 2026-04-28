import React, { useState } from 'react';
import { Search, Plus, Upload, Download, Settings, Box, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { MOCK_DEVICES, MOCK_USERS } from '../constants';
import { UserRole } from '../types';

interface DeviceRecord {
  id: string;
  customerId: string;
  storeId: string;
  categoryId: string;
  brandId: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  warrantyYears: number;
  imageUrl?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

const MOCK_DEVICE_RECORDS: DeviceRecord[] = [
  {
    id: 'DEV-2024001',
    customerId: 'u1',
    storeId: 's1',
    categoryId: 'd1',
    brandId: 'b1',
    model: 'HK500',
    serialNumber: 'SN-123456789',
    manufacturer: 'Hisense',
    purchaseDate: '2023-01-15',
    warrantyYears: 3,
    createdAt: '2023-01-15T10:00:00',
    createdBy: 'System Admin',
    updatedAt: '2023-01-15T10:00:00',
    updatedBy: 'System Admin',
  }
];

export const DeviceListView: React.FC = () => {
  const [records, setRecords] = useState<DeviceRecord[]>(MOCK_DEVICE_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DeviceRecord | null>(null);

  // Form State
  const [newCustomerId, setNewCustomerId] = useState('');
  const [newStoreId, setNewStoreId] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newBrandId, setNewBrandId] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newSerialNumber, setNewSerialNumber] = useState('');
  const [newManufacturer, setNewManufacturer] = useState('');
  const [newPurchaseDate, setNewPurchaseDate] = useState('');
  const [newWarrantyYears, setNewWarrantyYears] = useState<number>(1);

  const calculateRemainingDays = (purchaseDate: string, warrantyYears: number) => {
    if (!purchaseDate || !warrantyYears) return 0;
    const purchase = new Date(purchaseDate);
    const end = new Date(purchase);
    end.setFullYear(end.getFullYear() + warrantyYears);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setNewCustomerId('');
    setNewStoreId('');
    setNewCategoryId('');
    setNewBrandId('');
    setNewModel('');
    setNewSerialNumber('');
    setNewManufacturer('');
    setNewPurchaseDate('');
    setNewWarrantyYears(1);
    setIsAddDrawerOpen(true);
  };

  const handleEdit = (record: DeviceRecord) => {
    setEditingRecord(record);
    setNewCustomerId(record.customerId);
    setNewStoreId(record.storeId);
    setNewCategoryId(record.categoryId);
    setNewBrandId(record.brandId);
    setNewModel(record.model);
    setNewSerialNumber(record.serialNumber);
    setNewManufacturer(record.manufacturer);
    setNewPurchaseDate(record.purchaseDate);
    setNewWarrantyYears(record.warrantyYears);
    setIsAddDrawerOpen(true);
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    if (editingRecord) {
      const updatedRecords = records.map(r => r.id === editingRecord.id ? {
        ...r,
        customerId: newCustomerId,
        storeId: newStoreId,
        categoryId: newCategoryId,
        brandId: newBrandId,
        model: newModel,
        serialNumber: newSerialNumber,
        manufacturer: newManufacturer,
        purchaseDate: newPurchaseDate,
        warrantyYears: newWarrantyYears,
        updatedAt: now,
        updatedBy: 'System Admin',
      } : r);
      setRecords(updatedRecords);
    } else {
      const newRecord: DeviceRecord = {
        id: `DEV-${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        customerId: newCustomerId,
        storeId: newStoreId,
        categoryId: newCategoryId,
        brandId: newBrandId,
        model: newModel,
        serialNumber: newSerialNumber,
        manufacturer: newManufacturer,
        purchaseDate: newPurchaseDate,
        warrantyYears: newWarrantyYears,
        createdAt: now,
        createdBy: 'System Admin',
        updatedAt: now,
        updatedBy: 'System Admin',
      };
      setRecords([newRecord, ...records]);
    }
    setIsAddDrawerOpen(false);
    setEditingRecord(null);
  };

  const sortedRecords = [...records].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const filteredRecords = sortedRecords.filter(r => 
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">设备列表</h1>
          <p className="text-slate-500 text-sm">管理所有客户门店的设备资产记录</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> 导入
          </button>
          <button 
            onClick={handleAddNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> 新增
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="搜索设备编号或序列号..." 
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
                <th className="p-4">设备编号</th>
                <th className="p-4">客户/门店</th>
                <th className="p-4">设备分类</th>
                <th className="p-4">品牌/型号</th>
                <th className="p-4">序列号</th>
                <th className="p-4">设备生产商</th>
                <th className="p-4">采购日期</th>
                <th className="p-4">剩余售后</th>
                <th className="p-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRecords.map(record => {
                const customer = MOCK_USERS.find(u => u.id === record.customerId);
                const store = customer?.stores?.find(s => s.id === record.storeId);
                const category = MOCK_DEVICES.find(d => d.id === record.categoryId);
                const brand = category?.brands?.find(b => b.id === record.brandId);
                const remainingDays = calculateRemainingDays(record.purchaseDate, record.warrantyYears);

                return (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleEdit(record)}>
                    <td className="p-4 font-medium text-slate-900">{record.id}</td>
                    <td className="p-4">
                      <div className="text-slate-900">{customer?.name}</div>
                      <div className="text-xs text-slate-500">{store?.name}</div>
                    </td>
                    <td className="p-4 text-slate-600">{category?.name}</td>
                    <td className="p-4">
                      <div className="text-slate-900">{brand?.name}</div>
                      <div className="text-xs text-slate-500">{record.model}</div>
                    </td>
                    <td className="p-4 text-slate-600">{record.serialNumber}</td>
                    <td className="p-4 text-slate-600">{record.manufacturer}</td>
                    <td className="p-4 text-slate-600">{record.purchaseDate}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        remainingDays > 90 ? 'bg-green-100 text-green-700' :
                        remainingDays > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {remainingDays} 天
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-indigo-600 hover:underline text-sm font-medium">详情</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Drawer */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div 
             className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" 
             onClick={() => setIsAddDrawerOpen(false)} 
           />
           <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
               <h2 className="text-lg font-bold text-slate-900">{editingRecord ? '编辑设备' : '新增设备'}</h2>
               <button onClick={() => setIsAddDrawerOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
                 <X className="w-5 h-5" />
               </button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">设备编号</label>
                  <input type="text" disabled value={editingRecord ? editingRecord.id : "自动生成"} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">客户 <span className="text-red-500">*</span></label>
                  <select 
                    value={newCustomerId} 
                    onChange={(e) => { setNewCustomerId(e.target.value); setNewStoreId(''); }}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">选择客户</option>
                    {MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">门店 <span className="text-red-500">*</span></label>
                  <select 
                    value={newStoreId} 
                    onChange={(e) => setNewStoreId(e.target.value)}
                    disabled={!newCustomerId}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">选择门店</option>
                    {MOCK_USERS.find(u => u.id === newCustomerId)?.stores?.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">设备分类 <span className="text-red-500">*</span></label>
                  <select 
                    value={newCategoryId} 
                    onChange={(e) => { setNewCategoryId(e.target.value); setNewBrandId(''); setNewModel(''); }}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">选择设备分类</option>
                    {MOCK_DEVICES.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">设备品牌 <span className="text-red-500">*</span></label>
                  <select 
                    value={newBrandId} 
                    onChange={(e) => { setNewBrandId(e.target.value); setNewModel(''); }}
                    disabled={!newCategoryId}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">选择品牌</option>
                    {MOCK_DEVICES.find(d => d.id === newCategoryId)?.brands?.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">设备型号 <span className="text-red-500">*</span></label>
                  <select 
                    value={newModel} 
                    onChange={(e) => setNewModel(e.target.value)}
                    disabled={!newBrandId}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">选择型号</option>
                    {MOCK_DEVICES.find(d => d.id === newCategoryId)?.brands?.find(b => b.id === newBrandId)?.models.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">设备序列号 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={newSerialNumber}
                    onChange={(e) => setNewSerialNumber(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="输入设备序列号"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">设备生产商 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    placeholder="输入生产商名称"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">采购日期 <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      value={newPurchaseDate}
                      onChange={(e) => setNewPurchaseDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">保质年限 (年) <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      min="0"
                      value={newWarrantyYears}
                      onChange={(e) => setNewWarrantyYears(parseInt(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">剩余售后周期 (天)</label>
                  <input 
                    type="text" 
                    disabled 
                    value={calculateRemainingDays(newPurchaseDate, newWarrantyYears)} 
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">图片</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                    <ImageIcon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">点击或拖拽上传设备图片</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">创建人</label>
                    <input type="text" disabled value={editingRecord ? editingRecord.createdBy : "System Admin"} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">创建时间点</label>
                    <input type="text" disabled value={editingRecord ? new Date(editingRecord.createdAt).toLocaleString() : new Date().toLocaleString()} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">更新人</label>
                    <input type="text" disabled value={editingRecord ? editingRecord.updatedBy : "System Admin"} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">更新时间</label>
                    <input type="text" disabled value={editingRecord ? new Date(editingRecord.updatedAt).toLocaleString() : new Date().toLocaleString()} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
                  </div>
                </div>
             </div>
             <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
               <button onClick={() => setIsAddDrawerOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
               <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">保存</button>
             </div>
           </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg">导入设备记录</h3>
              <button onClick={() => setIsImportModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-xl p-8 text-center hover:bg-indigo-50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700 mb-1">点击或拖拽 xls 文件到此处上传</p>
                <p className="text-xs text-slate-500">支持 .xls, .xlsx 格式</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-700">没有模板？</p>
                  <p className="text-xs text-slate-500">下载模板文件，填写后上传</p>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded border border-indigo-100 shadow-sm">
                  <Download className="w-4 h-4" /> 下载模板.csv
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
