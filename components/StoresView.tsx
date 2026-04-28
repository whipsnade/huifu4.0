import React, { useState, useMemo } from 'react';
import { 
  Home, Search, Plus, MoreVertical, Edit2, Trash2, Copy, 
  MapPin, Phone, User as UserIcon, Building2, Shield, X, Check, XCircle,
  ChevronDown, ChevronRight, Map, Clock, Globe, Upload, Download
} from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { UserRole, CustomerLevel, CustomerRegion } from '../types';

interface Store {
  id: string;
  storeNumber: string;
  storeType?: '个人门店' | '企业门店';
  customerId: string;
  customerName: string;
  storeName: string;
  brand?: string;
  market?: string;
  storeLevel: CustomerLevel;
  status: '正常营业' | '闭店';
  city: string;
  district: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  hasMapLocation?: boolean;
  timezone: string;
  businessHours: string;
}

const cityTreeData = [
  { city: '北京', districts: ['朝阳区', '海淀区', '西城区', '东城区', '丰台区'] },
  { city: '上海', districts: ['浦东新区', '黄浦区', '静安区', '徐汇区', '长宁区'] },
  { city: '广州', districts: ['天河区', '越秀区', '海珠区', '白云区', '番禺区'] },
  { city: '深圳', districts: ['南山区', '福田区', '宝安区', '龙岗区', '罗湖区'] }
];

const CITY_TIMEZONES: Record<string, string> = {
  '北京': 'UTC+8',
  '上海': 'UTC+8',
  '广州': 'UTC+8',
  '深圳': 'UTC+8'
};

export const StoresView: React.FC<{ regions?: CustomerRegion[] }> = ({ regions = [] }) => {
  // Generate mock stores from customers
  const initialStores: Store[] = useMemo(() => {
    const stores: Store[] = [];
    MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER).forEach(customer => {
      if (customer.stores) {
        customer.stores.forEach(s => {
          stores.push({
            id: s.id,
            storeNumber: s.storeNumber || `ST-${Math.floor(Math.random() * 10000)}`,
            storeType: customer.isIndividualStoreCustomer ? '个人门店' : '企业门店',
            customerId: customer.id,
            customerName: customer.company || customer.name,
            storeName: s.name,
            storeLevel: customer.customerLevel || CustomerLevel.STANDARD,
            status: '正常营业',
            city: customer.isIndividualStoreCustomer ? '北京' : '未知城市',
            district: customer.isIndividualStoreCustomer ? '朝阳区' : '',
            address: s.address || '',
            contactPerson: customer.isIndividualStoreCustomer ? '王老板' : '店长',
            contactPhone: s.phone || '',
            hasMapLocation: customer.isIndividualStoreCustomer ? true : false,
            timezone: customer.isIndividualStoreCustomer ? 'UTC+8' : 'UTC+8',
            businessHours: '09:00:00 ~ 20:00:00'
          });
        });
      }
    });
    
    return stores;
  }, []);

  const [stores, setStores] = useState<Store[]>(initialStores);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'ADD' | 'EDIT'>('ADD');
  
  const [isCityPopoverOpen, setIsCityPopoverOpen] = useState(false);
  const [expandedCities, setExpandedCities] = useState<string[]>(['北京']);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const toggleCityNode = (city: string) => {
    setExpandedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };
  
  const initialFormState = {
    id: '',
    storeNumber: '',
    storeType: '企业门店' as '个人门店' | '企业门店',
    customerId: '',
    storeName: '',
    brand: '',
    market: '',
    status: '正常营业' as '正常营业' | '闭店',
    city: '',
    district: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
    hasMapLocation: false,
    timezone: '',
    businessHours: '09:00:00 ~ 20:00:00'
  };
  const [formData, setFormData] = useState(initialFormState);

  const customers = useMemo(() => MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER), []);

  const filteredStores = stores.filter(s => 
    s.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClick = () => {
    setFormData(initialFormState);
    setViewMode('ADD');
    setIsDrawerOpen(true);
  };

  const handleEditClick = (store: Store) => {
    setFormData({
      id: store.id,
      storeNumber: store.storeNumber,
      storeType: store.storeType || '企业门店',
      customerId: store.customerId,
      storeName: store.storeName,
      brand: store.brand || '',
      market: store.market || '',
      status: store.status,
      city: store.city,
      district: store.district,
      address: store.address,
      contactPerson: store.contactPerson,
      contactPhone: store.contactPhone,
      hasMapLocation: store.hasMapLocation || false,
      timezone: store.timezone || 'UTC+8',
      businessHours: store.businessHours || '09:00:00 ~ 20:00:00'
    });
    setViewMode('EDIT');
    setIsDrawerOpen(true);
  };

  const handleCopyClick = (store: Store) => {
    setFormData({
      id: '',
      storeNumber: '',
      storeType: store.storeType || '企业门店',
      customerId: store.customerId,
      storeName: store.storeName + ' (副本)',
      brand: store.brand || '',
      market: store.market || '',
      status: store.status,
      city: store.city,
      district: store.district,
      address: store.address,
      contactPerson: store.contactPerson,
      contactPhone: store.contactPhone,
      hasMapLocation: false,
      timezone: store.timezone || 'UTC+8',
      businessHours: store.businessHours || '09:00:00 ~ 20:00:00'
    });
    setViewMode('ADD');
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('确定要删除此门店吗？')) {
      setStores(stores.filter(s => s.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.storeName || (formData.storeType === '企业门店' && !formData.customerId)) {
      alert('请填写必填项');
      return;
    }

    const newStore: Store = {
      id: viewMode === 'ADD' ? Date.now().toString() : formData.id,
      storeNumber: formData.storeNumber || `ST-${Math.floor(Math.random() * 10000)}`,
      storeType: formData.storeType,
      customerId: formData.customerId,
      customerName: '',
      storeName: formData.storeName,
      brand: formData.brand,
      market: formData.market,
      storeLevel: CustomerLevel.STANDARD,
      status: formData.status,
      city: formData.city,
      district: formData.district,
      address: formData.address,
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      hasMapLocation: formData.hasMapLocation,
      timezone: formData.timezone,
      businessHours: formData.businessHours
    };

    if (formData.storeType === '个人门店') {
      // Find existing customer with the same phone number
      const existingCustomer = MOCK_USERS.find(u => 
        u.role === UserRole.CUSTOMER && 
        u.isIndividualStoreCustomer && 
        u.adminPhone === formData.contactPhone
      );

      if (existingCustomer) {
        // Check if the store is already under this customer (for EDIT mode)
        const isExistingStore = existingCustomer.stores?.some(s => s.id === formData.id);
        
        // If it's a new store or moving to this customer, check the limit
        if (!isExistingStore) {
          const currentStoreCount = existingCustomer.stores?.length || 0;
          if (currentStoreCount >= 5) {
            alert('SORRY,同一个联系电话最多只能创建5个门店！');
            return;
          }
        }

        newStore.customerId = existingCustomer.id;
        newStore.customerName = existingCustomer.name;
        newStore.storeLevel = existingCustomer.customerLevel || CustomerLevel.STANDARD;

        // Update existing customer's stores
        if (viewMode === 'ADD') {
          existingCustomer.stores = [...(existingCustomer.stores || []), {
            id: newStore.id,
            storeNumber: newStore.storeNumber,
            name: newStore.storeName,
            address: newStore.address,
            phone: newStore.contactPhone
          }];
          existingCustomer.storeCount = (existingCustomer.storeCount || 0) + 1;
        } else {
          // Edit mode: update the store in the customer's array
          if (existingCustomer.stores) {
            const storeIndex = existingCustomer.stores.findIndex(s => s.id === newStore.id);
            if (storeIndex >= 0) {
              existingCustomer.stores[storeIndex] = {
                id: newStore.id,
                storeNumber: newStore.storeNumber,
                name: newStore.storeName,
                address: newStore.address,
                phone: newStore.contactPhone
              };
            } else {
              // If the phone changed and it moved to this customer
              existingCustomer.stores.push({
                id: newStore.id,
                storeNumber: newStore.storeNumber,
                name: newStore.storeName,
                address: newStore.address,
                phone: newStore.contactPhone
              });
              existingCustomer.storeCount = (existingCustomer.storeCount || 0) + 1;
            }
          }
        }
      } else {
        // No existing customer with this phone, create a new one
        if (viewMode === 'ADD' || (viewMode === 'EDIT' && formData.customerId)) {
          const newCustomerId = viewMode === 'ADD' ? `CUST-${Date.now()}` : formData.customerId;
          newStore.customerId = newCustomerId;
          newStore.customerName = formData.storeName;
          newStore.storeLevel = CustomerLevel.STANDARD;

          if (viewMode === 'ADD') {
            // Add to MOCK_USERS
            MOCK_USERS.push({
              id: newCustomerId,
              name: formData.storeName,
              company: formData.storeName,
              email: '',
              role: UserRole.CUSTOMER,
              status: 'Active',
              lastActive: '刚刚',
              joinDate: new Date().toISOString().split('T')[0],
              storeCount: 1,
              recentOrderCount: 0,
              totalSpending: 0,
              address: formData.address,
              adminPhone: formData.contactPhone,
              customerLevel: CustomerLevel.STANDARD,
              discountRate: 0,
              enterpriseType: '个人企业',
              isIndividualStoreCustomer: true,
              stores: [{
                id: newStore.id,
                storeNumber: newStore.storeNumber,
                name: newStore.storeName,
                address: newStore.address,
                phone: newStore.contactPhone
              }]
            });
          } else {
             // For EDIT mode where phone changed to a new unique phone
             const custToUpdate = MOCK_USERS.find(u => u.id === formData.customerId);
             if (custToUpdate) {
               custToUpdate.adminPhone = formData.contactPhone;
               custToUpdate.name = formData.storeName;
               custToUpdate.company = formData.storeName;
               if (custToUpdate.stores) {
                 const storeIndex = custToUpdate.stores.findIndex(s => s.id === newStore.id);
                 if (storeIndex >= 0) {
                   custToUpdate.stores[storeIndex] = {
                     id: newStore.id,
                     storeNumber: newStore.storeNumber,
                     name: newStore.storeName,
                     address: newStore.address,
                     phone: newStore.contactPhone
                   };
                 }
               }
             }
          }
        }
      }
    } else {
      const customer = customers.find(c => c.id === formData.customerId);
      if (!customer) return;
      newStore.customerName = customer.company || customer.name;
      newStore.storeLevel = customer.customerLevel || CustomerLevel.STANDARD;
    }

    if (viewMode === 'ADD') {
      setStores([newStore, ...stores]);
    } else {
      setStores(stores.map(s => s.id === newStore.id ? newStore : s));
    }
    setIsDrawerOpen(false);
  };

  // Derived store level for the form based on selected customer
  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const derivedStoreLevel = selectedCustomer?.customerLevel || '-';
  const availableBrands = selectedCustomer?.brands || [];
  
  // Get available markets for this customer from regions
  const availableMarkets = useMemo(() => {
    if (!formData.customerId || !regions.length) return [];
    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) return [];
    const customerRegion = regions.find(r => r.customerName === (customer.company || customer.name));
    return customerRegion?.markets || [];
  }, [formData.customerId, regions, customers]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">门店管理</h1>
          <p className="text-slate-500 text-sm mt-1">管理所有客户的门店信息</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4" /> 批量导入
          </button>
          <button 
            onClick={handleAddClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> 新增门店
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="border-b border-slate-100 bg-white z-10">
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="搜索门店名称或客户..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">门店编号</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">门店类型</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">所属客户</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">门店名称</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">门店等级</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">门店状态</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">所在城市/区域</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[200px]">门店地址</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">联系人</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">联系电话</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStores.map(store => (
                <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{store.storeNumber}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${store.storeType === '个人门店' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                      {store.storeType || '企业门店'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{store.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{store.storeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium border border-indigo-100">
                      {store.storeLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${
                      store.status === '正常营业' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {store.status === '正常营业' ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {store.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{store.city}{store.district ? `/${store.district}` : ''}</td>
                  <td className="px-6 py-4 text-slate-600 truncate max-w-[250px]" title={store.address}>
                    <div className="flex items-center gap-1">
                      {store.hasMapLocation && <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                      <span className="truncate">{store.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{store.contactPerson}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{store.contactPhone}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleCopyClick(store)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="复制">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEditClick(store)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="编辑">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(store.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStores.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
                    没有找到符合条件的门店
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{viewMode === 'ADD' ? '新增门店' : '编辑门店'}</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">门店编号</label>
                <input 
                  type="text" 
                  value={formData.storeNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="留空则自动生成"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">门店类型 <span className="text-red-500">*</span></label>
                <select 
                  value={formData.storeType}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeType: e.target.value as '个人门店' | '企业门店', customerId: e.target.value === '个人门店' ? '' : prev.customerId }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="企业门店">企业门店</option>
                  <option value="个人门店">个人门店</option>
                </select>
              </div>

              {formData.storeType === '企业门店' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">所属客户 <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.customerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">请选择客户</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.company || c.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">门店名称 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.storeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="输入门店名称"
                />
              </div>

              {formData.storeType === '企业门店' && availableBrands.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">品牌</label>
                  <select 
                    value={formData.brand || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">请选择品牌</option>
                    {availableBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.storeType === '企业门店' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">门店等级</label>
                  <input 
                    type="text" 
                    value={derivedStoreLevel}
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg outline-none"
                    placeholder="选择客户后自动继承"
                  />
                  <p className="text-xs text-slate-400 mt-1">继承自所属客户的等级</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">门店状态 <span className="text-red-500">*</span></label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as '正常营业' | '闭店' }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="正常营业">正常营业</option>
                  <option value="闭店">闭店</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">所属市场</label>
                <select 
                  value={formData.market}
                  onChange={(e) => setFormData(prev => ({ ...prev, market: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">请选择市场</option>
                  {availableMarkets.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">所在城市/地区</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsCityPopoverOpen(!isCityPopoverOpen)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white flex items-center justify-between hover:border-indigo-500 transition-colors"
                  >
                    <span className={formData.city ? "text-slate-900" : "text-slate-400"}>
                      {formData.city ? `${formData.city}/${formData.district}` : "请选择城市/地区"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {isCityPopoverOpen && (
                    <div className="absolute z-50 mt-1 w-full border border-slate-200 rounded-lg shadow-xl bg-white p-3 space-y-2 max-h-64 overflow-y-auto ring-1 ring-black ring-opacity-5">
                      {cityTreeData.map(item => (
                        <div key={item.city} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <button 
                              type="button"
                              onClick={() => toggleCityNode(item.city)}
                              className="p-0.5 hover:bg-slate-100 rounded"
                            >
                              {expandedCities.includes(item.city) ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                            </button>
                            <span className="text-sm font-medium text-slate-700">{item.city}</span>
                          </div>
                          {expandedCities.includes(item.city) && (
                            <div className="ml-6 space-y-1">
                              {item.districts.map(d => (
                                <label key={d} className="flex items-center gap-2 cursor-pointer py-1 px-2 hover:bg-slate-50 rounded-md transition-colors">
                                  <input 
                                    type="radio" 
                                    name="store_location" 
                                    className="text-indigo-600 focus:ring-indigo-500" 
                                    checked={formData.city === item.city && formData.district === d}
                                    onChange={() => {
                                      setFormData(prev => ({ 
                                        ...prev, 
                                        city: item.city, 
                                        district: d,
                                        timezone: CITY_TIMEZONES[item.city] || prev.timezone
                                      }));
                                      setIsCityPopoverOpen(false);
                                    }}
                                  />
                                  <span className="text-sm text-slate-600">{d}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" /> 时区
                  </label>
                  <input 
                    type="text" 
                    value={formData.timezone}
                    onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="如 UTC+8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" /> 营业时间
                  </label>
                  <div className="flex items-center gap-1">
                    <input 
                      type="time" 
                      step="1"
                      value={formData.businessHours.split(' ~ ')[0] || '09:00:00'}
                      onChange={(e) => {
                         const start = e.target.value + (e.target.value.length === 5 ? ':00' : '');
                         const end = formData.businessHours.split(' ~ ')[1] || '20:00:00';
                         setFormData(prev => ({ ...prev, businessHours: `${start} ~ ${end}` }));
                      }}
                      className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                    <span className="text-slate-400">~</span>
                    <input 
                      type="time"
                      step="1"
                      value={formData.businessHours.split(' ~ ')[1] || '20:00:00'}
                      onChange={(e) => {
                         const start = formData.businessHours.split(' ~ ')[0] || '09:00:00';
                         const end = e.target.value + (e.target.value.length === 5 ? ':00' : '');
                         setFormData(prev => ({ ...prev, businessHours: `${start} ~ ${end}` }));
                      }}
                      className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">门店地址</label>
                <div className="relative">
                  {formData.hasMapLocation && (
                    <button 
                      onClick={() => setIsMapOpen(true)}
                      className="absolute left-3 top-3 text-indigo-600 hover:text-indigo-700 transition-colors"
                      title="在地图上查看"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  )}
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className={`w-full ${formData.hasMapLocation ? 'pl-9' : 'px-3'} pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24`}
                    placeholder="输入详细地址"
                  />
                  <button 
                    onClick={() => setIsMapOpen(true)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="在地图上标记"
                  >
                    <Map className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">联系人</label>
                  <input 
                    type="text" 
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="输入联系人姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">联系电话</label>
                  <input 
                    type="text" 
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="输入联系电话"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMapOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                标记门店位置
              </h3>
              <button onClick={() => setIsMapOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 bg-slate-50 relative h-[400px] flex items-center justify-center">
              {/* Mock Map Area */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
              <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply"></div>
              
              <div className="relative z-10 bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg text-center max-w-sm border border-white/50">
                <MapPin className="w-12 h-12 text-indigo-600 mx-auto mb-3 animate-bounce" />
                <h4 className="font-bold text-slate-900 mb-1">点击地图标记位置</h4>
                <p className="text-sm text-slate-600 mb-4">
                  当前地址: {formData.address || '未填写'}
                </p>
                <button 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, hasMapLocation: true }));
                    setIsMapOpen(false);
                  }}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  确认标记此位置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsImportModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">批量导入门店</h2>
              <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                  <Download className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-indigo-900 text-sm">下载导入模板</h3>
                  <p className="text-xs text-indigo-700 mt-1 mb-3">
                    请按照模板要求填写门店信息，包含客户映射信息。
                  </p>
                  <button className="text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm">
                    下载门店模板 (.csv)
                  </button>
                </div>
              </div>

              <div className="space-y-3 px-1">
                <h3 className="text-sm font-bold text-slate-900">模板必填项</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <ul className="list-disc list-inside space-y-1">
                    <li><span className="font-bold text-slate-900">所属客户ID</span>: 用于关联已有客户</li>
                    <li><span className="font-bold text-slate-900">门店名称</span>: 唯一识别名称</li>
                    <li><span className="font-bold text-slate-900">联系电话</span>: 用于服务分派通知</li>
                    <li><span className="font-bold text-slate-900">详细地址</span>: 包含城市和区域信息</li>
                  </ul>
                </div>
              </div>

              <div 
                className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 transition-all cursor-pointer group"
                onClick={() => document.getElementById('store-import-file')?.click()}
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-sm font-bold text-slate-900">将门店数据文件拖拽至此处</p>
                <p className="text-xs text-slate-500 mt-1">支持 Excel 或 CSV 格式</p>
                <input id="store-import-file" type="file" className="hidden" accept=".csv, .xlsx" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600">取消</button>
              <button 
                onClick={() => {
                  alert('门店数据处理中...');
                  setIsImportModalOpen(false);
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold"
              >
                开始处理
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
