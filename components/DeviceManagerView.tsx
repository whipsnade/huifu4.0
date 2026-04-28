import React, { useState } from 'react';
import { MOCK_DEVICES } from '../constants';
import { DeviceCategory, DeviceFault, Solution, Complexity } from '../types';
import { ChevronRight, Settings, Plus, Trash2, Edit2, AlertTriangle, Lightbulb, X } from 'lucide-react';

export const DeviceManagerView: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceCategory | null>(null);
  const [selectedBrandModel, setSelectedBrandModel] = useState<{brandId: string, model: string} | null>(null);
  const [selectedFault, setSelectedFault] = useState<DeviceFault | null>(null);

  // Modal States
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddBrandModelOpen, setIsAddBrandModelOpen] = useState(false);
  const [isAddFaultOpen, setIsAddFaultOpen] = useState(false);
  const [isAddSolutionOpen, setIsAddSolutionOpen] = useState(false);

  // Form States
  const [categoryName, setCategoryName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [modelName, setModelName] = useState('');
  const [faultName, setFaultName] = useState('');
  const [solutionComplexity, setSolutionComplexity] = useState<Complexity>(Complexity.MEDIUM);
  const [solutionPrice, setSolutionPrice] = useState('');
  const [solutionTime, setSolutionTime] = useState('');

  const handleDeviceSelect = (device: DeviceCategory) => {
    setSelectedDevice(device);
    setSelectedBrandModel(null);
    setSelectedFault(null);
  };

  const handleBrandModelSelect = (brandId: string, model: string) => {
    setSelectedBrandModel({ brandId, model });
    setSelectedFault(null);
  };

  const Modal = ({ isOpen, onClose, title, children, onSubmit }: any) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-slate-100">
            <h3 className="font-bold text-lg">{title}</h3>
            <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
          </div>
          <div className="p-4 space-y-4">
            {children}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs text-slate-500 mb-1">创建人</label>
                <input type="text" disabled value="System Admin" className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">创建时间点</label>
                <input type="text" disabled value={new Date().toLocaleString()} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">更新人</label>
                <input type="text" disabled value="System Admin" className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">更新时间</label>
                <input type="text" disabled value={new Date().toLocaleString()} className="w-full border border-slate-200 rounded p-2 text-sm bg-slate-50 text-slate-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
              <button onClick={() => { onSubmit(); onClose(); }} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">保存</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
       <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">设备配置</h1>
          <p className="text-slate-500 text-sm">定义设备分类、故障及标准解决方案</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex overflow-hidden">
        {/* Level 1: Devices */}
        <div className="w-1/5 border-r border-slate-200 overflow-y-auto bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-slate-100 font-semibold text-xs text-slate-500 uppercase tracking-wider flex justify-between items-center">
            <span>设备分类</span>
            <button onClick={() => setIsAddCategoryOpen(true)} className="text-indigo-600 hover:bg-indigo-50 p-1 rounded"><Plus className="w-4 h-4"/></button>
          </div>
          <div className="p-2 space-y-1">
            {MOCK_DEVICES.map(device => (
              <button
                key={device.id}
                onClick={() => handleDeviceSelect(device)}
                className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                  selectedDevice?.id === device.id 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                  : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-md flex items-center justify-center ${selectedDevice?.id === device.id ? 'bg-indigo-100' : 'bg-slate-200'}`}>
                      <Settings className="w-4 h-4" />
                   </div>
                   {device.name}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Level 2: Brands & Models */}
        <div className="w-1/5 border-r border-slate-200 overflow-y-auto bg-white">
          <div className="p-4 border-b border-slate-200 font-semibold text-xs text-slate-500 uppercase tracking-wider flex justify-between items-center">
            <span>设备品牌与型号</span>
            <button 
              onClick={() => setIsAddBrandModelOpen(true)} 
              disabled={!selectedDevice}
              className={`p-1 rounded ${selectedDevice ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-300 cursor-not-allowed'}`}
            >
              <Plus className="w-4 h-4"/>
            </button>
          </div>
          <div className="p-4 space-y-4">
            {selectedDevice ? (
              selectedDevice.brands?.map(brand => (
                <div key={brand.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50">
                  <div className="font-semibold text-slate-800 text-sm mb-2 flex justify-between items-center">
                    {brand.name}
                    <div className="flex gap-1">
                      <button className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-3 h-3"/></button>
                      <button className="text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3"/></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {brand.models.map(model => {
                      const isSelected = selectedBrandModel?.brandId === brand.id && selectedBrandModel?.model === model;
                      return (
                        <button 
                          key={model} 
                          onClick={() => handleBrandModelSelect(brand.id, model)}
                          className={`px-2 py-1 border rounded text-xs transition-colors ${
                            isSelected 
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
                          }`}
                        >
                          {model}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )) || <div className="text-center text-slate-400 text-sm">暂无品牌信息</div>
            ) : (
              <div className="text-center text-slate-400 text-sm mt-10">请先选择设备分类</div>
            )}
          </div>
        </div>

        {/* Level 3: Faults */}
        <div className="w-1/5 border-r border-slate-200 overflow-y-auto bg-white">
          <div className="p-4 border-b border-slate-200 font-semibold text-xs text-slate-500 uppercase tracking-wider flex justify-between items-center">
            <span>已知故障</span>
            <button 
              onClick={() => setIsAddFaultOpen(true)} 
              disabled={!selectedBrandModel}
              className={`p-1 rounded ${selectedBrandModel ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-300 cursor-not-allowed'}`}
            >
              <Plus className="w-4 h-4"/>
            </button>
          </div>
          <div className="p-2 space-y-1">
            {selectedBrandModel ? (
              selectedDevice?.faults.map(fault => (
                <button
                  key={fault.id}
                  onClick={() => setSelectedFault(fault)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                    selectedFault?.id === fault.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                   <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-3 h-3 ${selectedFault?.id === fault.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                      {fault.name}
                   </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-sm mt-6">请先选择设备品牌与型号</div>
            )}
          </div>
        </div>

        {/* Level 4: Solutions (Detail View) */}
        <div className="flex-1 overflow-y-auto bg-white p-6">
          {selectedFault ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                   <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                     <Lightbulb className="w-5 h-5 text-amber-500" />
                     {selectedFault.name}
                   </h2>
                   <p className="text-sm text-slate-500">针对此特定故障的解决方案和定价。</p>
                </div>
                <button 
                  onClick={() => setIsAddSolutionOpen(true)}
                  className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> 添加解决方案
                </button>
              </div>

              <div className="space-y-4">
                {selectedFault.commonSolutions.map(solution => (
                  <div key={solution.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800">{solution.description}</h3>
                      <div className="flex gap-2">
                        <button className="p-1 text-slate-400 hover:text-indigo-600"><Edit2 className="w-3 h-3"/></button>
                        <button className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3"/></button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-3">
                       <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">复杂度</p>
                          <p className={`text-sm font-medium ${
                            solution.complexity === Complexity.HIGH ? 'text-red-600' : 
                            solution.complexity === Complexity.MEDIUM ? 'text-amber-600' : 'text-green-600'
                          }`}>{solution.complexity}</p>
                       </div>
                       <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">基础价格</p>
                          <p className="text-sm font-medium text-slate-900">¥{solution.basePrice.toFixed(2)}</p>
                       </div>
                       <div className="bg-slate-50 p-2 rounded border border-slate-100">
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">预估时间</p>
                          <p className="text-sm font-medium text-slate-900">{solution.estimatedTimeMin} 分钟</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <Settings className="w-12 h-12 mb-4 opacity-20" />
               <p>请先选择已知故障</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isAddCategoryOpen} onClose={() => setIsAddCategoryOpen(false)} title="新增设备分类" onSubmit={() => {}}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">设备分类 <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={categoryName} 
            onChange={(e) => setCategoryName(e.target.value)} 
            placeholder="输入设备分类名称" 
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
          />
          <p className="text-xs text-slate-500 mt-1">设备分类名称不可重复</p>
        </div>
      </Modal>

      <Modal isOpen={isAddBrandModelOpen} onClose={() => setIsAddBrandModelOpen(false)} title="新增设备品牌与型号" onSubmit={() => {}}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">设备分类</label>
          <input type="text" disabled value={selectedDevice?.name || ''} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500 mb-3" />
          
          <label className="block text-sm font-medium text-slate-700 mb-1">设备品牌 <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={brandName} 
            onChange={(e) => setBrandName(e.target.value)} 
            placeholder="输入品牌名称" 
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3" 
          />
          
          <label className="block text-sm font-medium text-slate-700 mb-1">设备型号 <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={modelName} 
            onChange={(e) => setModelName(e.target.value)} 
            placeholder="输入型号名称" 
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>
      </Modal>

      <Modal isOpen={isAddFaultOpen} onClose={() => setIsAddFaultOpen(false)} title="新增已知故障" onSubmit={() => {}}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">设备分类</label>
          <input type="text" disabled value={selectedDevice?.name || ''} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500 mb-3" />
          
          <label className="block text-sm font-medium text-slate-700 mb-1">设备品牌与型号</label>
          <input type="text" disabled value={`${selectedDevice?.brands?.find(b => b.id === selectedBrandModel?.brandId)?.name || ''} - ${selectedBrandModel?.model || ''}`} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500 mb-3" />
          
          <label className="block text-sm font-medium text-slate-700 mb-1">故障分类 <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={faultName} 
            onChange={(e) => setFaultName(e.target.value)} 
            maxLength={30}
            placeholder="输入故障分类名称 (最多30个字符)" 
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>
      </Modal>

      <Modal isOpen={isAddSolutionOpen} onClose={() => setIsAddSolutionOpen(false)} title="添加解决方案" onSubmit={() => {}}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">设备分类</label>
            <input type="text" disabled value={selectedDevice?.name || ''} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">设备品牌与型号</label>
            <input type="text" disabled value={`${selectedDevice?.brands?.find(b => b.id === selectedBrandModel?.brandId)?.name || ''} - ${selectedBrandModel?.model || ''}`} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">故障分类</label>
            <input type="text" disabled value={selectedFault?.name || ''} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">复杂度 <span className="text-red-500">*</span></label>
            <select 
              value={solutionComplexity} 
              onChange={(e) => setSolutionComplexity(e.target.value as Complexity)}
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={Complexity.LOW}>Low</option>
              <option value={Complexity.MEDIUM}>Medium</option>
              <option value={Complexity.HIGH}>High</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">同一个已知故障的记录，配置的复杂度不可以重复</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">基础价格 (CNY) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                step="0.01"
                value={solutionPrice} 
                onChange={(e) => setSolutionPrice(e.target.value)} 
                placeholder="0.00" 
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">预估时间 (mins) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                value={solutionTime} 
                onChange={(e) => setSolutionTime(e.target.value)} 
                placeholder="例如: 60" 
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
