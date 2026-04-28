import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { ViewState } from '../types';
import { cn } from '../lib/utils';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
  noPadding?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children, noPadding = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <Sidebar 
            activeView={currentView} 
            onViewChange={onChangeView} 
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      <main className="flex-1 overflow-auto h-screen relative">
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-6 left-6 z-40 p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600 hover:text-indigo-600 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className={cn(noPadding ? "p-0 h-full" : "p-8 min-h-full flex flex-col")}>
          {children}
        </div>
      </main>
    </div>
  );
};
