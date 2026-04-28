import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Check, Plus, Trash2, Edit2, X } from 'lucide-react';

interface SubMetric {
  id: string;
  name: string;
}

interface MetricCategory {
  id: string;
  name: string;
  subMetrics: SubMetric[];
}

interface LevelThresholds {
  id: string;
  level: string;
  values: Record<string, number | string>;
}

const INITIAL_CATEGORIES: MetricCategory[] = [
  {
    id: 'orders',
    name: '接单量',
    subMetrics: [
      { id: 'daily', name: '每日' },
      { id: 'weekly', name: '每周' },
      { id: 'monthly', name: '每月' },
    ]
  },
  {
    id: 'good_reviews',
    name: '好评工单量',
    subMetrics: [
      { id: 'daily', name: '每日' },
      { id: 'weekly', name: '每周' },
      { id: 'monthly', name: '每月' },
    ]
  },
  {
    id: 'study_hours',
    name: '学习时长(H)',
    subMetrics: [
      { id: 'daily', name: '每日' },
      { id: 'weekly', name: '每周' },
      { id: 'monthly', name: '每月' },
    ]
  }
];

const INITIAL_LEVELS: LevelThresholds[] = [
  {
    id: 'l1',
    level: 'Expert',
    values: {
      'orders_daily': 4, 'orders_weekly': 20, 'orders_monthly': 88,
      'good_reviews_daily': 4, 'good_reviews_weekly': 16, 'good_reviews_monthly': 70.4,
      'study_hours_daily': 2, 'study_hours_weekly': 10, 'study_hours_monthly': 44
    }
  },
  {
    id: 'l2',
    level: 'Senior',
    values: {
      'orders_daily': 3, 'orders_weekly': 15, 'orders_monthly': 66,
      'good_reviews_daily': 3, 'good_reviews_weekly': 12, 'good_reviews_monthly': 52.8,
      'study_hours_daily': 1.5, 'study_hours_weekly': 7.5, 'study_hours_monthly': 33
    }
  },
  {
    id: 'l3',
    level: 'Mid',
    values: {
      'orders_daily': 2, 'orders_weekly': 10, 'orders_monthly': 44,
      'good_reviews_daily': 2, 'good_reviews_weekly': 8, 'good_reviews_monthly': 35.2,
      'study_hours_daily': 1, 'study_hours_weekly': 5, 'study_hours_monthly': 22
    }
  },
  {
    id: 'l4',
    level: 'Junior',
    values: {
      'orders_daily': 1, 'orders_weekly': 5, 'orders_monthly': 22,
      'good_reviews_daily': 1, 'good_reviews_weekly': 4, 'good_reviews_monthly': 17.6,
      'study_hours_daily': 0.5, 'study_hours_weekly': 2.5, 'study_hours_monthly': 11
    }
  }
];

export const ENGPromoteConfigView: React.FC = () => {
  const [categories, setCategories] = useState<MetricCategory[]>(INITIAL_CATEGORIES);
  const [levels, setLevels] = useState<LevelThresholds[]>(INITIAL_LEVELS);
  const [isSaved, setIsSaved] = useState(false);

  // For adding new category
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleValueChange = (levelId: string, categoryId: string, subMetricId: string, value: string) => {
    const key = `${categoryId}_${subMetricId}`;
    setLevels(levels.map(level => {
      if (level.id === levelId) {
        return {
          ...level,
          values: {
            ...level.values,
            [key]: value === '' ? '' : Number(value)
          }
        };
      }
      return level;
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: MetricCategory = {
      id: `cat_${Date.now()}`,
      name: newCategoryName.trim(),
      subMetrics: [
        { id: 'daily', name: '每日' },
        { id: 'weekly', name: '每周' },
        { id: 'monthly', name: '每月' },
      ]
    };

    setCategories([...categories, newCategory]);
    
    // Initialize values for new category
    setLevels(levels.map(level => {
      const newValues = { ...level.values };
      newCategory.subMetrics.forEach(sub => {
        newValues[`${newCategory.id}_${sub.id}`] = 0;
      });
      return { ...level, values: newValues };
    }));

    setNewCategoryName('');
    setIsAddingCategory(false);
    setIsSaved(false);
  };

  const handleRemoveCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId));
    setIsSaved(false);
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">工程师升级配置</h1>
          <p className="text-sm text-slate-500">配置不同级别工程师的升级考核阈值</p>
        </div>
        <div className="flex items-center gap-3">
          {isAddingCategory ? (
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="新指标名称 (如: 准时率)"
                className="px-3 py-1.5 text-sm border-none focus:ring-0 w-48"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                  if (e.key === 'Escape') setIsAddingCategory(false);
                }}
              />
              <button
                onClick={() => setIsAddingCategory(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X size={16} />
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors"
              >
                添加
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCategory(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              新增考核指标
            </button>
          )}
          
          <button
            onClick={handleSave}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              isSaved 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaved ? (
              <>
                <Check size={16} />
                已保存
              </>
            ) : (
              <>
                <Save size={16} />
                保存配置
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            {/* First Header Row: Categories */}
            <tr>
              <th className="p-4 border-b border-r border-slate-200 bg-slate-50/80 w-32 sticky left-0 z-10" rowSpan={2}>
                <div className="font-bold text-slate-700">工程师级别</div>
              </th>
              {categories.map((category) => (
                <th 
                  key={category.id} 
                  colSpan={category.subMetrics.length}
                  className="p-3 border-b border-r border-slate-200 bg-slate-50/80 text-center relative group"
                >
                  <div className="font-bold text-slate-700 flex items-center justify-center gap-2">
                    {category.name}
                    {category.id !== 'orders' && category.id !== 'good_reviews' && category.id !== 'study_hours' && (
                      <button
                        onClick={() => handleRemoveCategory(category.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                        title="移除此指标"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
            {/* Second Header Row: Sub-metrics */}
            <tr>
              {categories.map((category) => (
                category.subMetrics.map((sub) => (
                  <th 
                    key={`${category.id}_${sub.id}`}
                    className="p-3 border-b border-r border-slate-200 bg-slate-50/50 text-center text-xs font-semibold text-slate-500 w-24"
                  >
                    {sub.name}
                  </th>
                ))
              ))}
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => (
              <tr key={level.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-4 border-b border-r border-slate-100 bg-white group-hover:bg-blue-50/30 sticky left-0 z-10 font-bold text-slate-900">
                  {level.level}
                </td>
                {categories.map((category) => (
                  category.subMetrics.map((sub) => {
                    const key = `${category.id}_${sub.id}`;
                    return (
                      <td 
                        key={key}
                        className="p-2 border-b border-r border-slate-100 text-center"
                      >
                        <input
                          type="number"
                          value={level.values[key] !== undefined ? level.values[key] : ''}
                          onChange={(e) => handleValueChange(level.id, category.id, sub.id, e.target.value)}
                          className="w-full px-2 py-1.5 text-center bg-transparent border border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-md text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          step="any"
                        />
                      </td>
                    );
                  })
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
