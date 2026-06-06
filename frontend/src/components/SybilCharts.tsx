"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const riskData = [
  { name: '0-25 (Human)', count: 85400 },
  { name: '26-50 (Suspicious)', count: 25102 },
  { name: '51-75 (High Risk)', count: 10980 },
  { name: '76-100 (Sybil)', count: 3110 },
];

const COLORS = ['#6A8D73', '#fcd34d', '#f97316', '#ef4444'];

export function RiskDistributionChart() {
  return (
    <div className="h-64 w-full" style={{ minHeight: "256px" }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <BarChart
          data={riskData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8E5" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666666' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666666' }} />
          <Tooltip 
            cursor={{ fill: '#F7F6F3' }}
            contentStyle={{ borderRadius: '12px', border: '1px solid #E8E8E5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="count" fill="#111111" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const behaviorData = [
  { name: 'Same Funding', value: 45 },
  { name: 'Sync Timing', value: 25 },
  { name: 'Identical Contracts', value: 20 },
  { name: 'Direct Links', value: 10 },
];

export function SybilBehaviorPieChart() {
  return (
    <div className="h-64 w-full" style={{ minHeight: "256px" }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <PieChart>
          <Pie
            data={behaviorData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {behaviorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #E8E8E5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
