import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Feb', revenue: 52000, expenses: 34000 },
  { month: 'Mar', revenue: 48000, expenses: 31000 },
  { month: 'Apr', revenue: 61000, expenses: 38000 },
  { month: 'May', revenue: 55000, expenses: 35000 },
  { month: 'Jun', revenue: 67000, expenses: 42000 },
];

const RevenueChart: React.FC = () => (
  <ResponsiveContainer width="100%" height={250}>
    <AreaChart data={revenueData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="#c7d2fe" />
      <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#fecaca" />
    </AreaChart>
  </ResponsiveContainer>
);

export default RevenueChart;
