export interface Employee {
    employeeId: number;
    name: string;
    email: string;
    phone: string;
    salary: number;
    departmentId: number;
    departmentName?: string;
    location?: string;
}

export interface EmployeeWithDepartment {
    employeeId: number;
    name: string;
    email: string;
    phone: string;
    salary: number;
    departmentName: string;
    location: string;
}

export interface EmployeeInput {
    name: string;
    email: string;
    phone: string;
    salary: number;
    departmentId: number;
}