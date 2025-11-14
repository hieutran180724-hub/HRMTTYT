
import React, { useMemo } from 'react';
import { Employee } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector, FunnelChart } from 'recharts';
import { Users, UserPlus, UserMinus, UserCheck, AlertTriangle } from 'lucide-react';
import { DEPARTMENTS } from '../data';

interface DashboardProps {
  employees: Employee[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57'];

const DepartmentPieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
        </PieChart>
    </ResponsiveContainer>
);

const QualificationBarChart: React.FC<{ data: any[] }> = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Số lượng" />
        </BarChart>
    </ResponsiveContainer>
);

const AgeBarChart: React.FC<{ data: any[] }> = ({ data }) => (
     <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#00C49F" name="Số lượng"/>
        </BarChart>
    </ResponsiveContainer>
);


const Dashboard: React.FC<DashboardProps> = ({ employees }) => {
    
    const dashboardData = useMemo(() => {
        const total = employees.length;
        const active = employees.filter(e => e.status === 'Đang công tác').length;
        const permanent = employees.filter(e => e.employmentType === 'Biên chế sự nghiệp').length;
        const contract = total - permanent;

        const departmentData = DEPARTMENTS.map(dep => ({
            name: dep.name,
            value: employees.filter(e => e.departmentId === dep.id).length
        })).filter(d => d.value > 0);

        const qualificationMap: { [key: string]: number } = { 'CKII': 0, 'CKI': 0, 'ĐH': 0, 'CĐ': 0, 'TC': 0, 'Khác': 0 };
        employees.forEach(e => {
            const hq = e.highestSpecialization || '';
            if (hq.includes('CKII')) qualificationMap['CKII']++;
            else if (hq.includes('CKI')) qualificationMap['CKI']++;
            else if (hq.includes('ĐH') || hq.includes('Cử nhân')) qualificationMap['ĐH']++;
            else if (hq.includes('CĐ')) qualificationMap['CĐ']++;
            else if (hq.includes('TC')) qualificationMap['TC']++;
            else qualificationMap['Khác']++;
        });
        const qualificationData = Object.entries(qualificationMap).map(([name, count]) => ({ name, count }));

        const getAge = (dob: string) => new Date().getFullYear() - new Date(dob).getFullYear();
        const ageMap: { [key: string]: number } = { '< 30': 0, '30-40': 0, '41-50': 0, '51-60': 0, '> 60': 0 };
        employees.forEach(e => {
            const age = getAge(e.dateOfBirth);
            if (age < 30) ageMap['< 30']++;
            else if (age <= 40) ageMap['30-40']++;
            else if (age <= 50) ageMap['41-50']++;
            else if (age <= 60) ageMap['51-60']++;
            else ageMap['> 60']++;
        });
        const ageData = Object.entries(ageMap).map(([name, count]) => ({ name, count }));

        const nearRetirement = employees.filter(e => {
            const age = getAge(e.dateOfBirth);
            const retirementAge = e.gender === 'Nam' ? 62 : 60;
            return age >= retirementAge - 0.5 && age < retirementAge;
        });

        return { total, active, permanent, contract, departmentData, qualificationData, ageData, nearRetirement };
    }, [employees]);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Bảng điều khiển</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số nhân sự</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.total}</div>
            <p className="text-xs text-muted-foreground">Tổng số cán bộ, công chức, viên chức</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang công tác</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.active}</div>
            <p className="text-xs text-muted-foreground">Số nhân sự đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biên chế</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.permanent}</div>
            <p className="text-xs text-muted-foreground">Số nhân sự trong biên chế</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hợp đồng</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.contract}</div>
            <p className="text-xs text-muted-foreground">Số nhân sự hợp đồng các loại</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cơ cấu nhân sự theo Phòng/Khoa</CardTitle>
          </CardHeader>
          <CardContent>
             <DepartmentPieChart data={dashboardData.departmentData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cơ cấu trình độ chuyên môn</CardTitle>
          </CardHeader>
          <CardContent>
            <QualificationBarChart data={dashboardData.qualificationData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cơ cấu độ tuổi</CardTitle>
          </CardHeader>
          <CardContent>
             <AgeBarChart data={dashboardData.ageData} />
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <CardTitle>Cảnh báo & Nhắc nhở</CardTitle>
          </CardHeader>
          <CardContent>
             <h3 className="font-semibold text-md mb-2">Nhân sự sắp đến tuổi nghỉ hưu (6 tháng tới)</h3>
             {dashboardData.nearRetirement.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    {dashboardData.nearRetirement.map(e => <li key={e.id}>{e.fullName}</li>)}
                </ul>
             ) : (
                <p className="text-sm text-gray-500">Không có nhân sự nào sắp nghỉ hưu.</p>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
