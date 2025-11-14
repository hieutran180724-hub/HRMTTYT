
import React, { useState, useCallback, useMemo } from 'react';
import { Employee } from './types';
import { initialEmployees, DEPARTMENTS, POSITIONS } from './data';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import { Sidebar, SidebarItem } from './components/ui';
import { LayoutDashboard, Users, Hospital } from 'lucide-react';

type View = 'dashboard' | 'employees';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveEmployee = useCallback((employee: Employee) => {
    setEmployees(prev => {
      const existing = prev.find(e => e.id === employee.id);
      if (existing) {
        return prev.map(e => e.id === employee.id ? employee : e);
      } else {
        return [...prev, { ...employee, id: `EMP${Date.now()}` }];
      }
    });
    setIsFormOpen(false);
    setSelectedEmployee(null);
  }, []);
  
  const handleAddNew = useCallback(() => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback((employeeId: string) => {
     if(window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái nhân viên này thành "Nghỉ việc"?')) {
       setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, status: 'Nghỉ việc' } : e));
     }
  }, []);


  const departments = useMemo(() => DEPARTMENTS, []);
  const positions = useMemo(() => POSITIONS, []);

  const mainContent = () => {
    if (isFormOpen || selectedEmployee) {
       return (
        <EmployeeManagement
          employees={employees}
          departments={departments}
          positions={positions}
          onSave={handleSaveEmployee}
          onCancel={() => { setIsFormOpen(false); setSelectedEmployee(null); }}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          initialView="form"
          employeeToEdit={selectedEmployee}
        />
       )
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard employees={employees} />;
      case 'employees':
        return (
          <EmployeeManagement
            employees={employees}
            departments={departments}
            positions={positions}
            onSave={handleSaveEmployee}
            onCancel={() => setIsFormOpen(false)}
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
            initialView="list"
            employeeToEdit={null}
          />
        );
      default:
        return <Dashboard employees={employees} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar>
        <div className="flex items-center justify-center p-4 border-b border-gray-700">
          <Hospital className="w-8 h-8 text-white" />
          <h1 className="ml-3 text-xl font-semibold text-white">HRM TTYT</h1>
        </div>
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          text="Bảng điều khiển" 
          active={currentView === 'dashboard' && !isFormOpen} 
          onClick={() => { setCurrentView('dashboard'); setIsFormOpen(false); setSelectedEmployee(null); }} 
        />
        <SidebarItem 
          icon={<Users size={20} />} 
          text="Quản lý nhân sự" 
          active={currentView === 'employees' || isFormOpen}
          onClick={() => { setCurrentView('employees'); setIsFormOpen(false); setSelectedEmployee(null); }} 
        />
      </Sidebar>
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
        {mainContent()}
      </main>
    </div>
  );
};

export default App;
