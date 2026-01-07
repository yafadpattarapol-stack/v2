import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Employee, Department } from '../types';

interface DepartmentChartProps {
  employees: Employee[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const DepartmentChart: React.FC<DepartmentChartProps> = ({ employees }) => {
  const data = React.useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(Department).forEach(d => counts[d] = 0);
    
    employees.forEach(e => {
      if (counts[e.department] !== undefined) {
        counts[e.department]++;
      }
    });

    return Object.keys(counts)
      .filter(key => counts[key] > 0)
      .map(key => ({
        name: key,
        value: counts[key]
      }));
  }, [employees]);

  return (
    <div className="h-64 w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-700 mb-2">สัดส่วนพนักงานตามแผนก</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [value, 'คน']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
