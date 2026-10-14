import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

const expenseCategoryData = [
  { name: 'Salaries', value: 65, color: '#4f46e5' },
  { name: 'Maintenance', value: 15, color: '#10b981' },
  { name: 'Utilities', value: 10, color: '#f59e0b' },
  { name: 'Supplies', value: 10, color: '#ef4444' },
];

const ExpensePieChart: React.FC = () => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={expenseCategoryData}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
        label
      >
        {expenseCategoryData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

export default ExpensePieChart;
