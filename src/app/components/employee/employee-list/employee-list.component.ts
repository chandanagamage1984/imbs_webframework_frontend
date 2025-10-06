import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EmployeeService } from '../../../services/employee.service';
import { DepartmentService } from '../../../services/department.service';
import { EmployeeWithDepartment } from '../../../models/employee.model';
import { Department } from '../../../models/department.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component"

@Component({
    standalone: true,
    selector: 'app-employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        EmployeeFormComponent,
        ConfirmDialogComponent
    ]
})
export class EmployeeListComponent implements OnInit {
    displayedColumns: string[] = ['employeeId', 'name', 'email', 'phone', 'salary', 'departmentName', 'location', 'actions'];
    dataSource = new MatTableDataSource<EmployeeWithDepartment>();
    employees: EmployeeWithDepartment[] = [];
    departments: Department[] = [];
    searchEmployeeId: number | null = null;
    searchDepartmentId: number | null = null;
    isLoading = false;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadEmployees();
        this.loadDepartments();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadEmployees(): void {
        this.isLoading = true;
        this.employeeService.getAllEmployees().subscribe({
            next: (employees) => {
                this.employees = employees;
                this.dataSource.data = employees;
                this.isLoading = false;
            },
            error: (error) => {
                this.snackBar.open('Error loading employees', 'Close', { duration: 3000 });
                this.isLoading = false;
            }
        });
    }

    loadDepartments(): void {
        this.departmentService.getAllDepartments().subscribe({
            next: (departments) => {
                this.departments = departments;
            },
            error: (error) => {
                this.snackBar.open('Error loading departments', 'Close', { duration: 3000 });
            }
        });
    }

    searchEmployees(): void {
        if (this.searchEmployeeId) {
            this.employeeService.getEmployeeById(this.searchEmployeeId).subscribe({
                next: (employee) => {
                    this.dataSource.data = [employee];
                },
                error: (error) => {
                    this.snackBar.open('Employee not found', 'Close', { duration: 3000 });
                    this.dataSource.data = [];
                }
            });
        } else if (this.searchDepartmentId) {
            this.employeeService.searchEmployeesByDepartment(this.searchDepartmentId).subscribe({
                next: (employees) => {
                    this.dataSource.data = employees;
                },
                error: (error) => {
                    this.snackBar.open('Error searching employees', 'Close', { duration: 3000 });
                }
            });
        } else {
            this.dataSource.data = this.employees;
        }
    }

    clearSearch(): void {
        this.searchEmployeeId = null;
        this.searchDepartmentId = null;
        this.dataSource.data = this.employees;
    }

    openEmployeeForm(employee?: EmployeeWithDepartment): void {
        const dialogRef = this.dialog.open(EmployeeFormComponent, {
            width: '600px',
            data: { employee, departments: this.departments }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadEmployees();
            }
        });
    }

    // deleteEmployee(employee: EmployeeWithDepartment): void {
    //     if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
    //         this.employeeService.deleteEmployee(employee.employeeId).subscribe({
    //             next: () => {
    //                 this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
    //                 this.loadEmployees();
    //             },
    //             error: (error) => {
    //                 this.snackBar.open('Error deleting employee', 'Close', { duration: 3000 });
    //             }
    //         });
    //     }
    // }

    deleteEmployee(employee: EmployeeWithDepartment): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: "400px",
            data: {
                title: "Delete Employee",
                message: `Are you sure you want to delete ${employee.name}?`,
            },
        })

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.employeeService.deleteEmployee(employee.employeeId).subscribe({
                    next: () => {
                        this.snackBar.open("Employee deleted successfully", "Close", { duration: 3000 })
                        this.loadEmployees()
                    },
                    error: (error: any) => {
                        console.error("Error deleting employee:", error)
                        this.snackBar.open("Error deleting employee", "Close", { duration: 3000 })
                    },
                })
            }
        })
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}