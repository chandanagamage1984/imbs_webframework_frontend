import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Employee, EmployeeWithDepartment, EmployeeInput } from '../models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private apiUrl = `${environment.apiUrl}/employees`;

    constructor(private http: HttpClient) { }

    getAllEmployees(): Observable<EmployeeWithDepartment[]> {
        return this.http.get<EmployeeWithDepartment[]>(this.apiUrl);
    }

    getEmployeeById(id: number): Observable<EmployeeWithDepartment> {
        return this.http.get<EmployeeWithDepartment>(`${this.apiUrl}/${id}`);
    }

    searchEmployeesByDepartment(departmentId: number): Observable<EmployeeWithDepartment[]> {
        return this.http.get<EmployeeWithDepartment[]>(`${this.apiUrl}`, {
            params: new HttpParams().set('departmentId', departmentId.toString())
        });
    }

    createEmployee(employee: EmployeeInput): Observable<EmployeeWithDepartment> {
        return this.http.post<EmployeeWithDepartment>(this.apiUrl, employee);
    }

    updateEmployee(id: number, employee: EmployeeInput): Observable<EmployeeWithDepartment> {
        return this.http.put<EmployeeWithDepartment>(`${this.apiUrl}/${id}`, employee);
    }

    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}