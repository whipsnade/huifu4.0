import React, { useState } from 'react';
import { Plus, X, MapPin, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ZoneRule {
  id: string;
  name: string;
  min: string;
  minOp: string;
  maxOp: string;
  max: string;
}

interface CusZoneConfigViewProps {
  initialData?: any;
  onSave?: (zones: ZoneRule[]) => void;
  onBack?: () => void;
  isReadOnly?: boolean;
}

const generatePreview = (rule: ZoneRule) => {
  const parts = [];
  if (rule.min) {
    parts.push(rule.min);
    if (rule.minOp) parts.push(rule.minOp);
  }
  parts.push('X');
  if (rule.max && rule.maxOp) {
    parts.push(rule.maxOp);
    parts.push(rule.max);
  }
  return parts.join(' ');
};

export const CusZoneConfigView: React.FC<CusZoneConfigViewProps> = ({ initialData, onSave, onBack, isReadOnly = false }) => {
  const [zones, setZones] = useState<ZoneRule[]>(initialData?.zones || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  
  const [zoneForm, setZoneForm] = useState({
    name: '',
    min: '',
    minOp: '<',
    maxOp: '<=',
    max: ''
  });

  const handleSaveZone = () => {
    if (!zoneForm.name.trim()) return;

    if (editingZoneId) {
      setZones(zones.map(z => z.id === editingZoneId ? { ...zoneForm, id: editingZoneId } : z));
    } else {
      setZones([...zones, { ...zoneForm, id: Date.now().toString() }]);
    }

    closeZoneForm();
  };

  const openAddZoneForm = () => {
    setEditingZoneId(null);
    setZoneForm({ name: '', min: '', minOp: '<', maxOp: '<=', max: '' });
    setIsFormOpen(true);
  };

  const openEditZoneForm = (zone: ZoneRule) => {
    setEditingZoneId(zone.id);
    setZoneForm({
      name: zone.name,
      min: zone.min,
      minOp: zone.minOp || '<',
      maxOp: zone.maxOp || '<=',
      max: zone.max
    });
    setIsFormOpen(true);
  };

  const closeZoneForm = () => {
    setIsFormOpen(false);
    setEditingZoneId(null);
  };

  const handleRemoveZone = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
  };

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {initialData?.customerName ? `${initialData.customerName} - ` : ''}Zone 设置设计
            </h1>
            <p className="text-sm text-slate-500">
              {initialData?.processName || '区域(Zone)距离配置规则'}
            </p>
          </div>
        </div>
        {!isReadOnly && (
          <button 
            onClick={() => onSave?.(zones)}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100"
          >
            保存配置
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between font-bold">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">配置规则列表</h3>
          {!isReadOnly && (
            <button 
              onClick={openAddZoneForm}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all text-sm font-bold"
            >
              <Plus size={16} />
              添加 Zone
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4 w-24">Zone</th>
                <th className="px-8 py-4">距离规则参考 (X = 距离)</th>
                <th className="px-8 py-4 w-32 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {zones.map((zone) => (
                  <motion.tr 
                    key={zone.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-slate-900 font-bold text-sm border border-slate-200 shadow-sm">
                        {zone.name}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/50">
                          <MapPin size={18} />
                        </div>
                        <span className="text-lg font-bold text-slate-700 tracking-tight">
                          {generatePreview(zone)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {!isReadOnly && (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => openEditZoneForm(zone)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleRemoveZone(zone.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {zones.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Zone Specified</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Dialog */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={closeZoneForm}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingZoneId ? '编辑 Zone' : '添加新 Zone'}
                  </h2>
                  <button onClick={closeZoneForm} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Zone 名称</label>
                    <input
                      required
                      type="text"
                      value={zoneForm.name}
                      onChange={e => setZoneForm({ ...zoneForm, name: e.target.value })}
                      placeholder="例如: 1"
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-700"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">距离规则配置</label>
                    <div className="flex items-center gap-3 bg-slate-50 p-6 rounded-3xl border border-slate-100 ring-1 ring-white">
                      <div className="flex-1 space-y-2">
                        <input 
                          type="number"
                          value={zoneForm.min}
                          onChange={(e) => setZoneForm({...zoneForm, min: e.target.value})}
                          placeholder="Min"
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                        />
                        <select 
                          value={zoneForm.minOp}
                          onChange={(e) => setZoneForm({...zoneForm, minOp: e.target.value})}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                        >
                          <option value=""></option>
                          <option value="<">&lt;</option>
                          <option value="<=">&lt;=</option>
                        </select>
                      </div>

                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-100 ring-4 ring-white">
                        X
                      </div>

                      <div className="flex-1 space-y-2">
                        <select 
                          value={zoneForm.maxOp}
                          onChange={(e) => setZoneForm({...zoneForm, maxOp: e.target.value})}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                        >
                          <option value=""></option>
                          <option value="<">&lt;</option>
                          <option value="<=">&lt;=</option>
                          <option value=">">&gt;</option>
                          <option value=">=">&gt;=</option>
                          <option value="=">=</option>
                        </select>
                        <input 
                          type="number"
                          value={zoneForm.max}
                          onChange={(e) => setZoneForm({...zoneForm, max: e.target.value})}
                          placeholder="Max"
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex-wrap">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">预览:</span>
                      <span className="text-sm font-black text-indigo-600 font-mono tracking-widest bg-white px-3 py-1 rounded-lg border border-indigo-100 transition-all">
                        {generatePreview(zoneForm)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={closeZoneForm}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors active:scale-95"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSaveZone}
                      className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
