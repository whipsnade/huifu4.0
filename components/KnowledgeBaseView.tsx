import React, { useState } from 'react';
import { Search, Book, Sparkles, ArrowRight } from 'lucide-react';
import { MOCK_KNOWLEDGE_BASE } from '../constants';
import { searchKnowledgeBase } from '../services/geminiService';

export const KnowledgeBaseView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setAiAnswer(null);

    // Simulate sending context of top articles
    const context = JSON.stringify(MOCK_KNOWLEDGE_BASE);
    const answer = await searchKnowledgeBase(searchQuery, context);
    
    setAiAnswer(answer);
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">SmartFix 知识库</h1>
        <p className="text-slate-500">搜索指南、安全协议和故障排除步骤。</p>
        
        <div className="mt-8 relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="如何更换液压机上的密封件？"
            className="w-full pl-5 pr-12 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {aiAnswer && (
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-indigo-900">AI 摘要</h3>
          </div>
          <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 px-2">最近文章</h2>
        <div className="grid gap-4">
          {MOCK_KNOWLEDGE_BASE.filter(k => k.title.toLowerCase().includes(searchQuery.toLowerCase())).map(article => (
            <div key={article.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded font-medium">{article.category}</span>
                    <span className="text-slate-400 text-xs">更新于 {article.lastUpdated}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">{article.content}</p>
                </div>
                <Book className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                阅读文章 <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};