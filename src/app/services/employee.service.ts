import { Injectable } from "@angular/core"
import { HttpClient, type HttpErrorResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from "../models/employee.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/EmployeesAPI`

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).pipe(catchError(this.handleError))
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError))
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError))
  }

  createEmployee(employee: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).pipe(catchError(this.handleError))
  }

  updateEmployee(id: number, employee: UpdateEmployeeRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee).pipe(catchError(this.handleError))
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError))
  }

  searchEmployees(searchTerm: string): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(`${this.apiUrl}/search?searchTerm=${encodeURIComponent(searchTerm)}`)
      .pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred!"
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = "Unable to connect to the server. Please check if the API is running."
      } else if (error.status === 404) {
        errorMessage = "The requested resource was not found."
      } else if (error.status === 500) {
        errorMessage = "Internal server error. Please try again later."
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
      }
    }
    console.error("API Error:", error)
    return throwError(() => errorMessage)
  }
}