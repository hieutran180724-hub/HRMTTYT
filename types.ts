
export type Gender = 'Nam' | 'Nữ';

export type EmploymentType = 'Biên chế sự nghiệp' | 'HĐ trong chỉ tiêu' | 'Hỗ trợ phục vụ' | 'Khoán';

export type EmployeeStatus = 'Đang công tác' | 'Nghỉ việc' | 'Chuyển công tác' | 'Nghỉ hưu' | 'Tạm hoãn HĐ';

export interface Employee {
  id: string;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: Gender;
  departmentId: string;
  positionId: string;
  phoneNumber: string;
  email?: string;
  ethnicity?: string;
  religion?: string;
  isPartyMember: boolean;
  
  // Tab 2: Documents & Address
  idCardNumber: string;
  idCardIssueDate: string; // YYYY-MM-DD
  idCardIssuePlace?: string;
  placeOfBirth?: string;
  hometown?: string;
  permanentAddress?: string;
  currentAddress?: string;

  // Tab 3: Work & Position
  employmentType: EmploymentType;
  recruitmentDate: string; // YYYY-MM-DD
  rankCode?: string;
  rankAppointmentDate?: string; // YYYY-MM-DD
  
  // Tab 4: Qualifications
  qualificationByRank?: string;
  currentSpecialization?: string;
  highestSpecialization?: string;
  
  stateManagement?: {
    seniorSpecialist?: boolean;
    specialist?: boolean;
  };
  
  politicalTheory?: {
    advanced?: boolean;
    intermediate?: boolean;
    primary?: boolean;
  };

  foreignLanguage?: {
    english?: string; // B, B1, C...
    chinese?: string;
    german?: string;
    collegeOrHigher?: boolean;
    certificate?: boolean;
  };

  informatics?: {
    universityOrCollege?: boolean;
    certificate?: boolean;
  };

  otherCertificates?: {
    hospitalManagement?: boolean;
    nursingManagement?: boolean;
    nationalDefense?: string; // DT3, DT4...
  };

  // Lifecycle
  status: EmployeeStatus;
  workHistory?: { date: string; event: string }[];
  decisions?: { name: string; fileUrl: string }[];
}


export interface Department {
    id: string;
    name: string;
}

export interface Position {
    id: string;
    name: string;
}