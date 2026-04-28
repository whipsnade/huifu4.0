import React, { useState } from 'react';
import { Plus, X, Copy, AlertTriangle, Edit2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PenaltyItem {
  id: string;
  name: string;
  description: string;
}

interface PenaltyCategory {
  id: string;
  categoryName: string;
  items: PenaltyItem[];
}

const INITIAL_DATA: PenaltyCategory[] = [
  {
    id: '1',
    categoryName: '时效与响应类 (触发即扣分/罚款)',
    items: [
      { id: 'p1_1', name: '接单超时', description: '系统派单后，未在规定时间内（如30分钟或1小时）点击接单或联系客户。' },
      { id: 'p1_2', name: '上门迟到', description: '未按照与客户预约的时间段上门，且未提前沟通解释。' },
      { id: 'p1_3', name: '虚假签到', description: '人未到达客户现场，却通过定位软件进行虚假签到（GPS作弊）。' },
      { id: 'p1_4', name: '响应不及时', description: '上门检测出故障后，未在规定时间内（如15分钟）向平台或客户反馈维修方案。' },
      { id: 'p1_5', name: '完工录入延迟', description: '维修结束后，未在当天或规定时间内上传完工照片和结单。' },
    ]
  },
  {
    id: '2',
    categoryName: '技术与作业规范类 (触发即返工/赔偿)',
    items: [
      { id: 'p2_1', name: '误判故障', description: '未进行专业检测，凭经验盲目判断，导致换件后故障依旧（如未测电压直接换主板）。' },
      { id: 'p2_2', name: '过度维修', description: '小病大修（如只需清洗滤网却谎称需加氟/换压缩机），或更换无需更换的配件。' },
      { id: 'p2_3', name: '二次返修', description: '同一故障点在保修期内（如90天）再次损坏，需免费上门重修的。' },
      { id: 'p2_4', name: '违规操作', description: '维修带电设备时未断电，或未佩戴防静电手环维修精密主板，造成安全隐患。' },
      { id: 'p2_5', name: '工具遗漏', description: '维修结束后将螺丝刀、万用表等工具遗留在客户家中或机器内部。' },
      { id: 'p2_6', name: '旧件未回收', description: '按规定需回收旧配件（如压缩机、电机）以核销保修，却未带回或未拍照上传。' },
      { id: 'p2_7', name: '未试机', description: '维修完成后未进行试运行（如修空调未测出风口温度、修洗衣机未走一遍脱水程序）就离场。' },
    ]
  },
  {
    id: '3',
    categoryName: '收费与诚信类 (触发即重罚/封号)',
    items: [
      { id: 'p3_1', name: '私自收费', description: '不通过平台/公司系统收款，私下收取客户现金或转账，逃避监管。' },
      { id: 'p3_2', name: '乱收费/坐地起价', description: '实际收费高于公示价格表，或在检测后临时增加未告知的费用。' },
      { id: 'p3_3', name: '配件虚报', description: '使用副厂件/拆机件冒充原厂全新件，并按原厂件价格收费。' },
      { id: 'p3_4', name: '虚构服务', description: '未上门或仅上门未维修，却伪造维修记录骗取上门费或配件费。' },
    ]
  },
  {
    id: '4',
    categoryName: '态度与形象类 (触发即投诉/差评)',
    items: [
      { id: 'p4_1', name: '仪容不整', description: '上门未穿工装、未佩戴工牌，或衣衫不整、未穿鞋套进入客户家。' },
      { id: 'p4_2', name: '服务态度恶劣', description: '与客户发生争执、辱骂客户，或表现出不耐烦、冷漠的态度。' },
      { id: 'p4_3', name: '破坏环境卫生', description: '维修过程中弄脏地板/墙面未清理，或维修垃圾（包装盒、旧零件）未带走。' },
      { id: 'p4_4', name: '泄露隐私', description: '随意翻看客户私人物品，或泄露客户的家庭住址、电话等个人信息。' },
    ]
  }
];

export const CusEngPenaltyConfigView: React.FC = () => {
  const [categories, setCategories] = useState<PenaltyCategory[]>(INITIAL_DATA);
  
  // Copy Modal State
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [categoryToCopy, setCategoryToCopy] = useState<PenaltyCategory | null>(null);
  const [copyCategoryName, setCopyCategoryName] = useState('');

  // Edit Card State
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ categoryName: '' });

  // Add Item State
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', description: '' });

  const handleCopyCategory = () => {
    if (!categoryToCopy || !copyCategoryName.trim()) return;

    const newCategory: PenaltyCategory = {
      id: Date.now().toString(),
      categoryName: copyCategoryName.trim(),
      items: categoryToCopy.items.map(i => ({ ...i, id: Date.now().toString() + Math.random() }))
    };

    setCategories([...categories, newCategory]);
    setIsCopyModalOpen(false);
    setCategoryToCopy(null);
    setCopyCategoryName('');
  };

  const handleRemoveItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        return { ...c, items: c.items.filter(i => i.id !== itemId) };
      }
      return c;
    }));
  };

  const handleAddItem = (categoryId: string) => {
    if (!newItem.name.trim()) return;

    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        return { 
          ...c, 
          items: [...c.items, { 
            id: Date.now().toString(), 
            name: newItem.name.trim(), 
            description: newItem.description.trim() 
          }] 
        };
      }
      return c;
    }));

    setNewItem({ name: '', description: '' });
    setActiveCardId(null);
  };

  const handleSaveCardInfo = (categoryId: string) => {
    if (!editForm.categoryName.trim()) {
      setEditingCardId(null);
      return;
    }

    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        return { 
          ...c, 
          categoryName: editForm.categoryName.trim()
        };
      }
      return c;
    }));
    setEditingCardId(null);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">工程师奖惩规则</h1>
          <p className="text-sm text-slate-500">管理工程师的各类违规奖惩项及描述</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnimatePresence>
          {categories.map((category) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={category.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full"
            >
              {/* Card Header (Category Name) */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                    <div className="flex-1">
                      {editingCardId === category.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editForm.categoryName}
                            onChange={(e) => setEditForm({ categoryName: e.target.value })}
                            className="flex-1 px-3 py-1.5 text-sm font-bold text-slate-900 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCardInfo(category.id);
                              if (e.key === 'Escape') setEditingCardId(null);
                            }}
                          />
                          <button 
                            onClick={() => setEditingCardId(null)}
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                          >
                            取消
                          </button>
                          <button 
                            onClick={() => handleSaveCardInfo(category.id)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                          >
                            保存
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{category.categoryName}</h3>
                          <button 
                            onClick={() => {
                              setEditingCardId(category.id);
                              setEditForm({ categoryName: category.categoryName });
                            }}
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                            title="编辑罚分类型"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setCategoryToCopy(category);
                      setCopyCategoryName(`${category.categoryName} (副本)`);
                      setIsCopyModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm shrink-0"
                    title="复制此配置"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              
              {/* Penalty Items List */}
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  罚分项
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                    {category.items.length}
                  </span>
                </h4>
                
                <div className="flex flex-wrap gap-2.5 mb-4">
                  <AnimatePresence>
                    {category.items.map((item) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={item.id}
                        className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-sm font-medium text-red-800 cursor-default"
                      >
                        <span>{item.name}</span>
                        <Info size={14} className="text-red-400" />
                        <button 
                          onClick={() => handleRemoveItem(category.id, item.id)}
                          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-200 hover:text-red-900 text-red-400 transition-colors ml-1"
                          title="移除"
                        >
                          <X size={12} />
                        </button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl pointer-events-none">
                          <div className="font-bold mb-1 text-red-300">{item.name}</div>
                          <div className="leading-relaxed text-slate-300">{item.description}</div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add Item Inline Form */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  {activeCardId === category.id ? (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div>
                        <input 
                          type="text"
                          value={newItem.name}
                          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                          placeholder="罚分项名称 (如: 接单超时)"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          autoFocus
                        />
                      </div>
                      <div>
                        <textarea 
                          value={newItem.description}
                          onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                          placeholder="罚分项描述提示信息..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[60px]"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setActiveCardId(null)}
                          className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
                        >
                          取消
                        </button>
                        <button 
                          onClick={() => handleAddItem(category.id)}
                          disabled={!newItem.name.trim() || !newItem.description.trim()}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          添加
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setActiveCardId(category.id);
                        setNewItem({ name: '', description: '' });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-slate-300 text-sm font-medium text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <Plus size={16} />
                      添加罚分项
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Copy Config Modal */}
      <AnimatePresence>
        {isCopyModalOpen && categoryToCopy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">复制罚分配置</h3>
                <button 
                  onClick={() => setIsCopyModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                  <p className="text-sm text-blue-800">
                    您正在复制 <strong>{categoryToCopy.categoryName}</strong> 的配置，包含 {categoryToCopy.items.length} 个罚分项。
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">新罚分类型名称</label>
                  <input 
                    type="text" 
                    value={copyCategoryName}
                    onChange={(e) => setCopyCategoryName(e.target.value)}
                    placeholder="输入新罚分类型名称"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCopyCategory();
                    }}
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsCopyModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleCopyCategory}
                  disabled={!copyCategoryName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  确认复制
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
