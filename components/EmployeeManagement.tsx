
import React, { useState, useMemo, ChangeEvent } from 'react';
import { Employee, Department, Position } from '../types';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent, Tabs, TabList, TabTrigger, TabContent, Checkbox, Textarea, Label } from './ui';
import { PlusCircle, Search, Edit, Trash2, User, FileText, Briefcase, GraduationCap } from 'lucide-react';
import { DEPARTMENTS } from '../data';


interface EmployeeListProps {
    employees: Employee[];
    departments: Department[];
    positions: Position[];
    onAddNew: () => void;
    onEdit: (employee: Employee) => void;
    onDelete: (employeeId: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, departments, positions, onAddNew, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('');

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const nameMatch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase());
            const departmentMatch = departmentFilter ? emp.departmentId === departmentFilter : true;
            const positionMatch = positionFilter ? emp.positionId === positionFilter : true;
            return nameMatch && departmentMatch && positionMatch;
        });
    }, [employees, searchTerm, departmentFilter, positionFilter]);

    const getDepartmentName = (id: string) => departments.find(d => d.id === id)?.name || 'N/A';
    const getPositionName = (id: string) => positions.find(p => p.id === id)?.name || 'N/A';

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="text-2xl">Danh sách nhân sự</CardTitle>
                    <Button onClick={onAddNew} className="flex items-center gap-2">
                        <PlusCircle size={18} />
                        Thêm mới
                    </Button>
                </div>
                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                            placeholder="Tìm kiếm theo tên..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                        <option value="">Tất cả phòng ban</option>
                        {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
                    </Select>
                    <Select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
                        <option value="">Tất cả chức vụ</option>
                        {positions.map(pos => <option key={pos.id} value={pos.id}>{pos.name}</option>)}
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-x-auto">
                <div className="overflow-y-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Họ và tên</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Giới tính</th>
                            <th scope="col" className="px-6 py-3 hidden lg:table-cell">Năm sinh</th>
                            <th scope="col" className="px-6 py-3">Phòng ban</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Chức vụ</th>
                            <th scope="col" className="px-6 py-3 hidden lg:table-cell">Số điện thoại</th>
                            <th scope="col" className="px-6 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                  {emp.fullName}
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">{emp.gender}</td>
                                <td className="px-6 py-4 hidden lg:table-cell">{new Date(emp.dateOfBirth).getFullYear()}</td>
                                <td className="px-6 py-4">{getDepartmentName(emp.departmentId)}</td>
                                <td className="px-6 py-4 hidden md:table-cell">{getPositionName(emp.positionId)}</td>
                                <td className="px-6 py-4 hidden lg:table-cell">{emp.phoneNumber}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onEdit(emp)} className="p-1 text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                                        <button onClick={() => onDelete(emp.id)} className="p-1 text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </CardContent>
        </Card>
    );
};

interface EmployeeFormProps {
    employee: Employee | null;
    departments: Department[];
    positions: Position[];
    onSave: (employee: Employee) => void;
    onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, departments, positions, onSave, onCancel }) => {
    const emptyEmployee: Employee = {
        id: '',
        fullName: '',
        dateOfBirth: '',
        gender: 'Nam',
        departmentId: departments[0]?.id || '',
        positionId: positions[0]?.id || '',
        phoneNumber: '',
        isPartyMember: false,
        idCardNumber: '',
        idCardIssueDate: '',
        employmentType: 'HĐ trong chỉ tiêu',
        recruitmentDate: '',
        status: 'Đang công tác',
    };
    const [formData, setFormData] = useState<Employee>(employee || emptyEmployee);
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({...prev, [name]: checked}));
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
    };
    
    const handleNestedChange = (e: ChangeEvent<HTMLInputElement>, category: string, field: string) => {
        const { checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...(prev as any)[category],
                [field]: checked,
            },
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{employee ? 'Cập nhật hồ sơ nhân sự' : 'Thêm mới hồ sơ nhân sự'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="personal">
              <TabList>
                <TabTrigger value="personal"><User className="mr-2 h-4 w-4"/> Thông tin cá nhân</TabTrigger>
                <TabTrigger value="documents"><FileText className="mr-2 h-4 w-4"/> Giấy tờ & Địa chỉ</TabTrigger>
                <TabTrigger value="work"><Briefcase className="mr-2 h-4 w-4"/> Công tác & Ngạch</TabTrigger>
                <TabTrigger value="qualifications"><GraduationCap className="mr-2 h-4 w-4"/> Trình độ & Bằng cấp</TabTrigger>
              </TabList>

              <TabContent value="personal" className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleChange} required />
                <Input label="Ngày tháng năm sinh" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required/>
                <div>
                  <Label>Giới tính</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center"><input type="radio" name="gender" value="Nam" checked={formData.gender === 'Nam'} onChange={handleChange} className="mr-2"/> Nam</label>
                    <label className="flex items-center"><input type="radio" name="gender" value="Nữ" checked={formData.gender === 'Nữ'} onChange={handleChange} className="mr-2"/> Nữ</label>
                  </div>
                </div>
                <Input label="Số điện thoại" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required/>
                <Input label="Email cá nhân" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                <Input label="Dân tộc" name="ethnicity" value={formData.ethnicity || ''} onChange={handleChange} />
                <Input label="Tôn giáo" name="religion" value={formData.religion || ''} onChange={handleChange} />
                <Checkbox label="Đảng viên" name="isPartyMember" checked={formData.isPartyMember} onChange={handleChange} />
              </TabContent>

              <TabContent value="documents" className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Số CCCD" name="idCardNumber" value={formData.idCardNumber} onChange={handleChange} required/>
                <Input label="Ngày cấp" name="idCardIssueDate" type="date" value={formData.idCardIssueDate} onChange={handleChange} required/>
                <Input label="Nơi cấp" name="idCardIssuePlace" value={formData.idCardIssuePlace || ''} onChange={handleChange} />
                <Textarea label="Nơi sinh" name="placeOfBirth" value={formData.placeOfBirth || ''} onChange={handleChange} className="md:col-span-2"/>
                <Textarea label="Quê quán" name="hometown" value={formData.hometown || ''} onChange={handleChange} className="md:col-span-2"/>
                <Textarea label="Hộ khẩu thường trú" name="permanentAddress" value={formData.permanentAddress || ''} onChange={handleChange} className="md:col-span-2"/>
                <Textarea label="Chỗ ở hiện nay" name="currentAddress" value={formData.currentAddress || ''} onChange={handleChange} className="md:col-span-2"/>
              </TabContent>

              <TabContent value="work" className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select label="Phòng ban công tác" name="departmentId" value={formData.departmentId} onChange={handleChange} required>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Select>
                <Select label="Chức danh/Chức vụ" name="positionId" value={formData.positionId} onChange={handleChange} required>
                    {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </Select>
                <Select label="Hình thức tuyển dụng" name="employmentType" value={formData.employmentType} onChange={handleChange} required>
                    <option>Biên chế sự nghiệp</option>
                    <option>HĐ trong chỉ tiêu</option>
                    <option>Hỗ trợ phục vụ</option>
                    <option>Khoán</option>
                </Select>
                 <Input label="Thời gian tuyển dụng" name="recruitmentDate" type="date" value={formData.recruitmentDate} onChange={handleChange} required/>
                 <Input label="Ngạch" name="rankCode" value={formData.rankCode || ''} onChange={handleChange} placeholder="V.08.01.02" />
                 <Input label="Thời gian bổ nhiệm ngạch" name="rankAppointmentDate" type="date" value={formData.rankAppointmentDate || ''} onChange={handleChange} />
              </TabContent>

               <TabContent value="qualifications" className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Trình độ theo ngạch" name="qualificationByRank" value={formData.qualificationByRank || ''} onChange={handleChange} />
                    <Input label="Chuyên ngành ngạch hiện giữ" name="currentSpecialization" value={formData.currentSpecialization || ''} onChange={handleChange} />
                    <Input label="Chuyên ngành cao nhất" name="highestSpecialization" value={formData.highestSpecialization || ''} onChange={handleChange} />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-medium mb-2">Quản lý nhà nước</h4>
                            <Checkbox label="Chuyên viên chính" name="seniorSpecialist" checked={formData.stateManagement?.seniorSpecialist || false} onChange={e => handleNestedChange(e, 'stateManagement', 'seniorSpecialist')}/>
                            <Checkbox label="Chuyên viên" name="specialist" checked={formData.stateManagement?.specialist || false} onChange={e => handleNestedChange(e, 'stateManagement', 'specialist')}/>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Chính trị</h4>
                             <Checkbox label="Cao cấp" name="advanced" checked={formData.politicalTheory?.advanced || false} onChange={e => handleNestedChange(e, 'politicalTheory', 'advanced')}/>
                             <Checkbox label="Trung cấp" name="intermediate" checked={formData.politicalTheory?.intermediate || false} onChange={e => handleNestedChange(e, 'politicalTheory', 'intermediate')}/>
                             <Checkbox label="Sơ cấp" name="primary" checked={formData.politicalTheory?.primary || false} onChange={e => handleNestedChange(e, 'politicalTheory', 'primary')}/>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Tin học</h4>
                             <Checkbox label="Đại học/CĐ" name="universityOrCollege" checked={formData.informatics?.universityOrCollege || false} onChange={e => handleNestedChange(e, 'informatics', 'universityOrCollege')}/>
                             <Checkbox label="Chứng chỉ" name="certificate" checked={formData.informatics?.certificate || false} onChange={e => handleNestedChange(e, 'informatics', 'certificate')}/>
                        </div>
                   </div>
               </TabContent>
            </Tabs>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
              <Button type="submit">Lưu</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
};

interface EmployeeManagementProps {
    employees: Employee[];
    departments: Department[];
    positions: Position[];
    onSave: (employee: Employee) => void;
    onCancel: () => void;
    onAddNew: () => void;
    onEdit: (employee: Employee) => void;
    onDelete: (employeeId: string) => void;
    initialView: 'list' | 'form';
    employeeToEdit: Employee | null;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, departments, positions, onSave, onCancel, onAddNew, onEdit, onDelete, initialView, employeeToEdit }) => {
    
    if (initialView === 'form' || employeeToEdit) {
        return <EmployeeForm employee={employeeToEdit} departments={departments} positions={positions} onSave={onSave} onCancel={onCancel} />
    }
    
    return <EmployeeList employees={employees} departments={departments} positions={positions} onAddNew={onAddNew} onEdit={onEdit} onDelete={onDelete} />
}

export default EmployeeManagement;