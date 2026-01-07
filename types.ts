export enum Department {
  IT = 'IT',
  HR = 'HR',
  SALES = 'Sales',
  MARKETING = 'Marketing',
  OPERATIONS = 'Operations'
}

export enum EmployeeStatus {
  ACTIVE = 'Active',
  PROBATION = 'Probation',
  RESIGNED = 'Resigned',
  ON_LEAVE = 'On Leave'
}

export interface HistoryRecord {
  id: string;
  date: string;
  type: 'Promotion' | 'Transfer' | 'Performance Review' | 'Incident' | 'Award';
  title: string;
  description: string;
  aiEnhanced?: boolean;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: Department;
  status: EmployeeStatus;
  startDate: string;
  avatarUrl: string;
  bio: string;
  history: HistoryRecord[];
}
