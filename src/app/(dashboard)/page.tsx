'use client';

import React from 'react';
import { Users, Globe, Flame, Phone, UserCheck, Trophy, DollarSign } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function DashboardPage() {
  const stats = [
    { label: 'Leads encontrados', value: '1.284', icon: Users, colorClass: 'text-accent' },
    { label: 'Sem website', value: '723', icon: Globe, colorClass: 'text-hot' },
    { label: 'Oportunidades HOT', value: '184', icon: Flame, colorClass: 'text-hot' },
    { label: 'Contatos realizados', value: '342', icon: Phone, colorClass: 'text-accent-blue' },
    { label: 'Interessados', value: '67', icon: UserCheck, colorClass: 'text-warm' },
    { label: 'Clientes ganhos', value: '18', icon: Trophy, colorClass: 'text-success' },
    { label: 'Valor potencial', value: 'R$ 87.500', icon: DollarSign, colorClass: 'text-accent' },
  ];

  const areaData = [
    { name: 'Jan', leads: 400 },
    { name: 'Fev', leads: 600 },
    { name: 'Mar', leads: 850 },
    { name: 'Abr', leads: 950 },
    { name: 'Mai', leads: 1100 },
    { name: 'Jun', leads: 1284 },
  ];

  const barData = [
    { name: 'Barbearias', value: 45 },
    { name: 'Restaurantes', value: 38 },
    { name: 'Clínicas', value: 32 },
    { name: 'Academias', value: 28 },
    { name: 'Salões', value: 25 },
    { name: 'Oficinas', value: 16 },
  ];

  const funnelData = [
    { stage: 'Leads', value: 1284, width: '100%', bg: 'bg-[#004d33]' },
    { stage: 'Contatados', value: 342, width: '70%', bg: 'bg-[#006b47]' },
    { stage: 'Interessados', value: 67, width: '45%', bg: 'bg-[#008a5b]' },
    { stage: 'Reuniões', value: 34, width: '30%', bg: 'bg-[#00a86f]' },
    { stage: 'Propostas', value: 22, width: '20%', bg: 'bg-[#00c783]' },
    { stage: 'Ganhos', value: 18, width: '12%', bg: 'bg-[#00d68f]' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#0a0a0f] min-h-screen text-[#f0f0f5]">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Visão geral do seu desempenho e leads.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#12121a] border border-[#2a2a3e] p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-[#2a2a3e] bg-opacity-30 ${stat.colorClass}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#12121a] border border-[#2a2a3e] p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-6">Leads por Período</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d68f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d68f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" vertical={false} />
                <XAxis dataKey="name" stroke="#8888a0" tick={{fill: '#8888a0'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#8888a0" tick={{fill: '#8888a0'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12121a', borderColor: '#2a2a3e', color: '#f0f0f5' }}
                  itemStyle={{ color: '#00d68f' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#00d68f" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#12121a] border border-[#2a2a3e] p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-6">Oportunidades por Nicho</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" horizontal={false} />
                <XAxis type="number" stroke="#8888a0" tick={{fill: '#8888a0'}} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#8888a0" tick={{fill: '#8888a0'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12121a', borderColor: '#2a2a3e', color: '#f0f0f5' }}
                  itemStyle={{ color: '#00d68f' }}
                  cursor={{ fill: '#2a2a3e', opacity: 0.4 }}
                />
                <Bar dataKey="value" fill="#00d68f" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#12121a] border border-[#2a2a3e] p-6 rounded-xl lg:col-span-2">
          <h2 className="text-lg font-semibold mb-6">Funil de Conversão</h2>
          <div className="space-y-4">
            {funnelData.map((item, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className="w-32 font-medium text-gray-400">{item.stage}</div>
                <div className="flex-1">
                  <div 
                    className={`h-10 ${item.bg} rounded-r-md flex items-center px-4 font-bold transition-all duration-500`}
                    style={{ width: item.width }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
