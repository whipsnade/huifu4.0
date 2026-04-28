import React, { useState } from 'react';
import { Plus, X, Copy, Wrench, Edit2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Skill {
  id: string;
  name: string;
  description: string;
}

interface IndustrySkillConfig {
  id: string;
  industryName: string;
  coreScenarios: string;
  skills: Skill[];
}

const INITIAL_DATA: IndustrySkillConfig[] = [
  {
    id: '1',
    industryName: '家电维修行业 (30项技能)',
    coreScenarios: '入户服务、强电操作、大型机械（空调/洗衣机/冰箱）、厨卫电器。',
    skills: [
      { id: 's1', name: '电路原理分析', description: '能看懂复杂的家电电路原理图，追踪电流走向。' },
      { id: 's2', name: '万用表精准使用', description: '熟练测量电压、电流、电阻，判断元器件好坏。' },
      { id: 's3', name: '强电安全操作', description: '严格遵守高压电操作规范，确保自身和用户安全。' },
      { id: 's4', name: '制冷系统维修', description: '掌握空调/冰箱的加氟（冷媒）、抽真空、检漏技术。' },
      { id: 's5', name: '焊接技术（气焊/电焊）', description: '能进行铜管焊接、钣金修复等金属加工操作。' },
      { id: 's6', name: '电机检测与维修', description: '判断洗衣机、风扇等电机线圈是否烧毁或轴承磨损。' },
      { id: 's7', name: '变频技术理解', description: '理解变频板的工作原理，能维修或更换变频模块。' },
      { id: 's8', name: '电脑板元件级维修', description: '能识别并更换电路板上的电容、继电器、保险丝等。' },
      { id: 's9', name: '机械结构拆装', description: '熟练掌握各种品牌家电的卡扣、螺丝布局，无损拆装。' },
      { id: 's10', name: '水路与气路检修', description: '针对洗衣机（进水/排水）和燃气灶/热水器（气管/阀门）的检修。' },
      { id: 's11', name: '传感器故障判断', description: '快速判断温度传感器、水位传感器等是否失灵。' },
      { id: 's12', name: '通用配件替代', description: '在原厂配件缺货时，能找到参数匹配的通用件进行代换。' },
    ]
  },
  {
    id: '2',
    industryName: 'IT硬件维修行业 (30项技能)',
    coreScenarios: '台式机/笔记本/手机/平板、精密电子、数据敏感、芯片级维修。',
    skills: [
      { id: 's13', name: '芯片级焊接（BGA/贴片）', description: '熟练使用风枪和烙铁，进行CPU、显卡等精密焊接。' },
      { id: 's14', name: '显微镜操作', description: '在显微镜下进行精细的电路板走线修复和微小元件更换。' },
      { id: 's15', name: '点位图与图纸阅读', description: '熟练使用维修软件（如鑫智造、修机匠）查看板层线路图。' },
      { id: 's16', name: '示波器使用', description: '检测信号波形，诊断不开机、掉电、复位信号异常等复杂故障。' },
      { id: 's17', name: '数据恢复技术', description: '掌握硬盘坏道修复、分区表重建、RAID阵列恢复技术。' },
      { id: 's18', name: '操作系统部署', description: '精通Windows、macOS、Linux系统的安装、驱动适配及优化。' },
      { id: 's19', name: '病毒与恶意软件查杀', description: '能识别并清除顽固病毒、勒索软件，修复系统漏洞。' },
      { id: 's20', name: '屏幕压排技术', description: '针对手机/笔记本屏幕，进行偏光片撕除和排线压接。' },
      { id: 's21', name: '电池校准与更换', description: '处理电池鼓包、掉电快问题，并进行系统校准。' },
      { id: 's22', name: '网络故障排查', description: '解决路由器配置、IP冲突、DNS错误及网线制作测试。' },
      { id: 's23', name: '外设接口维修', description: '修复USB、HDMI、Type-C等接口松动或接触不良。' },
      { id: 's24', name: 'BIOS/固件刷写', description: '能备份、修改及刷写主板BIOS，解决锁机或兼容性问题。' },
    ]
  }
];

export const SkillConfigeView: React.FC = () => {
  const [configs, setConfigs] = useState<IndustrySkillConfig[]>(INITIAL_DATA);
  
  // Copy Modal State
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [configToCopy, setConfigToCopy] = useState<IndustrySkillConfig | null>(null);
  const [copyIndustryName, setCopyIndustryName] = useState('');

  // Edit Card State
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ industryName: '', coreScenarios: '' });

  // Add Skill State
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });

  const handleCopyConfig = () => {
    if (!configToCopy || !copyIndustryName.trim()) return;

    const newConfig: IndustrySkillConfig = {
      id: Date.now().toString(),
      industryName: copyIndustryName.trim(),
      coreScenarios: configToCopy.coreScenarios,
      skills: configToCopy.skills.map(s => ({ ...s, id: Date.now().toString() + Math.random() }))
    };

    setConfigs([...configs, newConfig]);
    setIsCopyModalOpen(false);
    setConfigToCopy(null);
    setCopyIndustryName('');
  };

  const handleRemoveSkill = (configId: string, skillId: string) => {
    setConfigs(configs.map(c => {
      if (c.id === configId) {
        return { ...c, skills: c.skills.filter(s => s.id !== skillId) };
      }
      return c;
    }));
  };

  const handleAddSkill = (configId: string) => {
    if (!newSkill.name.trim()) return;

    setConfigs(configs.map(c => {
      if (c.id === configId) {
        return { 
          ...c, 
          skills: [...c.skills, { 
            id: Date.now().toString(), 
            name: newSkill.name.trim(), 
            description: newSkill.description.trim() 
          }] 
        };
      }
      return c;
    }));

    setNewSkill({ name: '', description: '' });
    setActiveCardId(null);
  };

  const handleSaveCardInfo = (configId: string) => {
    if (!editForm.industryName.trim()) {
      setEditingCardId(null);
      return;
    }

    setConfigs(configs.map(c => {
      if (c.id === configId) {
        return { 
          ...c, 
          industryName: editForm.industryName.trim(),
          coreScenarios: editForm.coreScenarios.trim()
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">服务技能配置</h1>
          <p className="text-sm text-slate-500">管理各行业的核心场景与专业服务技能</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnimatePresence>
          {configs.map((config) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={config.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full"
            >
              {/* Card Header (Industry Name & Core Scenarios) */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-1">
                      <Wrench size={20} />
                    </div>
                    <div className="flex-1">
                      {editingCardId === config.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">行业名称</label>
                            <input
                              type="text"
                              value={editForm.industryName}
                              onChange={(e) => setEditForm({...editForm, industryName: e.target.value})}
                              className="w-full px-3 py-1.5 text-sm font-bold text-slate-900 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              autoFocus
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">核心场景</label>
                            <textarea
                              value={editForm.coreScenarios}
                              onChange={(e) => setEditForm({...editForm, coreScenarios: e.target.value})}
                              className="w-full px-3 py-1.5 text-sm text-slate-700 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[60px]"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingCardId(null)}
                              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                            >
                              取消
                            </button>
                            <button 
                              onClick={() => handleSaveCardInfo(config.id)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                            >
                              保存
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{config.industryName}</h3>
                            <button 
                              onClick={() => {
                                setEditingCardId(config.id);
                                setEditForm({ industryName: config.industryName, coreScenarios: config.coreScenarios });
                              }}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              title="编辑行业信息"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-semibold text-slate-700 shrink-0">核心场景:</span>
                            <p className="text-sm text-slate-600 leading-relaxed">{config.coreScenarios}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setConfigToCopy(config);
                      setCopyIndustryName(`${config.industryName} (副本)`);
                      setIsCopyModalOpen(true);
                    }}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm shrink-0"
                    title="复制此配置"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              
              {/* Skills List */}
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  服务技能
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                    {config.skills.length}
                  </span>
                </h4>
                
                <div className="flex flex-wrap gap-2.5 mb-4">
                  <AnimatePresence>
                    {config.skills.map((skill) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={skill.id}
                        className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-100 text-sm font-medium text-purple-800 cursor-default"
                      >
                        <span>{skill.name}</span>
                        <Info size={14} className="text-purple-400" />
                        <button 
                          onClick={() => handleRemoveSkill(config.id, skill.id)}
                          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-purple-200 hover:text-purple-900 text-purple-400 transition-colors ml-1"
                          title="移除"
                        >
                          <X size={12} />
                        </button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl pointer-events-none">
                          <div className="font-bold mb-1 text-purple-300">{skill.name}</div>
                          <div className="leading-relaxed text-slate-300">{skill.description}</div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add Skill Inline Form */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  {activeCardId === config.id ? (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div>
                        <input 
                          type="text"
                          value={newSkill.name}
                          onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                          placeholder="技能名称 (如: 电路原理分析)"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          autoFocus
                        />
                      </div>
                      <div>
                        <textarea 
                          value={newSkill.description}
                          onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                          placeholder="技能描述提示信息..."
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
                          onClick={() => handleAddSkill(config.id)}
                          disabled={!newSkill.name.trim() || !newSkill.description.trim()}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          添加
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setActiveCardId(config.id);
                        setNewSkill({ name: '', description: '' });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-slate-300 text-sm font-medium text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <Plus size={16} />
                      添加新技能
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
        {isCopyModalOpen && configToCopy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">复制技能配置</h3>
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
                    您正在复制 <strong>{configToCopy.industryName}</strong> 的配置，包含 {configToCopy.skills.length} 项技能。
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">新行业名称</label>
                  <input 
                    type="text" 
                    value={copyIndustryName}
                    onChange={(e) => setCopyIndustryName(e.target.value)}
                    placeholder="输入新行业名称"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCopyConfig();
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
                  onClick={handleCopyConfig}
                  disabled={!copyIndustryName.trim()}
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
