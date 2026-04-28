import { useState, useEffect } from 'react';

type Listener = () => void;

class Store {
  categories: string[];
  listeners: Set<Listener> = new Set();
  
  constructor(initialCats: string[]) {
    this.categories = initialCats;
  }
  
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  setCategories(cats: string[]) {
    this.categories = cats;
    this.listeners.forEach(l => l());
  }
}

export const deviceCategoryStore = new Store([
  'POS 系统', 'KDS', '打印机', '笔记本电脑',
  '平板电脑', '扫码枪', '钱箱', '电子秤', '排队机', 
  '自助点餐机', '路由器', '交换机', '监控摄像头', '服务器'
]);

export function useSharedDeviceCategories() {
  const [categories, setCategories] = useState(deviceCategoryStore.categories);
  
  useEffect(() => {
     return deviceCategoryStore.subscribe(() => {
        setCategories(deviceCategoryStore.categories);
     });
  }, []);
  
  return { 
    categories, 
    setCategories: (cats: string[]) => deviceCategoryStore.setCategories(cats) 
  };
}
