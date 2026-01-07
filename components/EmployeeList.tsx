import React from 'react';
import { Employee, EmployeeStatus } from '../types';
import { User, Briefcase, Calendar } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onSelect: (employee: Employee) => void;
  selectedId?: string;
}

const statusColors: Record<EmployeeStatus, string> = {
  [EmployeeStatus.ACTIVE]: 'bg-green-100 text-green-800',
  [EmployeeStatus.PROBATION]: 'bg-yellow-100 text-yellow-800',
  [EmployeeStatus.RESIGNED]: 'bg-red-100 text-red-800',
  [EmployeeStatus.ON_LEAVE]: 'bg-blue-100 text-blue-800',
};

export const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onSelect, selectedId }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {employees.map((emp) => (
        <div
          key={emp.id}
          onClick={() => onSelect(emp)}
          className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
            selectedId === emp.id
              ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
              : 'bg-white border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center space-x-4">
            <img
              src={emp.avatarUrl}
              alt={emp.firstName}
              className="w-12 h-12 rounded-full object-cover bg-gray-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {emp.firstName} {emp.lastName}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[emp.status]}`}>
                  {emp.status}
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Briefcase size={12} className="mr-1" />
                <span className="truncate mr-2">{emp.position}</span>
                <span className="text-gray-300">|</span>
                <span className="truncate ml-2">{emp.department}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
