import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Save, Server, Shield, User, Send } from 'lucide-react';
import { motion } from 'motion/react';

export const EmailSMTPConfigView: React.FC = () => {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('587');
  const [security, setSecurity] = useState('STARTTLS');
  const [authEnabled, setAuthEnabled] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    // Save logic here
    console.log('Saving SMTP config:', { host, port, security, authEnabled, username, password, fromEmail, displayName });
    alert('SMTP配置已保存');
  };

  const handleTestMail = () => {
    // Test mail logic here
    console.log('Sending test mail...');
    alert('测试邮件已发送至您的邮箱');
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">发送邮箱SMTP设置</h1>
        <p className="text-sm text-slate-500">配置系统邮件服务，用于发送通知和告警邮件。</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-10">
          
          {/* Server Connection Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Server size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">服务器连接</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-10">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">SMTP 服务器地址 (Host)</label>
                <input 
                  type="text" 
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="例如：smtp.example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">端口 (Port)</label>
                <input 
                  type="text" 
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="587"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">安全加密 (Security)</label>
                <div className="relative">
                  <select 
                    value={security}
                    onChange={(e) => setSecurity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="STARTTLS">STARTTLS</option>
                    <option value="SSL">SSL</option>
                    <option value="TLS">TLS</option>
                    <option value="None">None</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Authentication Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Shield size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">身份验证</h2>
            </div>
            
            <div className="pl-10 space-y-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={authEnabled}
                    onChange={() => setAuthEnabled(!authEnabled)}
                  />
                  <div className={`block w-12 h-6 rounded-full transition-colors ${authEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${authEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">启用 SMTP 身份验证</span>
              </label>

              <motion.div 
                initial={false}
                animate={{ 
                  height: authEnabled ? 'auto' : 0, 
                  opacity: authEnabled ? 1 : 0,
                  overflow: 'hidden'
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">用户名 (Username)</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="输入邮箱用户名"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">密码 (Password)</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="输入邮箱密码或授权码"
                      className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Sender Info Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <User size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">发件人信息</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-10">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">发件人邮箱 (From Email)</label>
                <input 
                  type="email" 
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="例如：no-reply@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">显示名称 (Display Name)</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="例如：IT服务台"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </section>

        </div>

        {/* Actions Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            onClick={handleTestMail}
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center gap-2"
          >
            <Send size={16} />
            发送测试邮件
          </button>
          
          <button 
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};
