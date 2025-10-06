import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular material modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department.model';
import { DepartmentFormComponent } from '../department-form/department-form.component';
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component"

@Component({
    selector: 'app-department-list',
    standalone: true,
    templateUrl: './department-list.component.html',
    styleUrls: ['./department-list.component.scss'],
    imports: [
        CommonModule,
        FormsModule,

        // Material Modules
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        DepartmentFormComponent,
        ConfirmDialogComponent
    ]
})
export class DepartmentListComponent implements OnInit {
    displayedColumns: string[] = ['departmentId', 'name', 'location', 'actions'];
    dataSource = new MatTableDataSource<Department>();
    departments: Department[] = [];
    searchDepartmentId: number | null = null;
    searchName: string = '';
    isLoading = false;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private departmentService: DepartmentService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadDepartments();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadDepartments(): void {
        this.isLoading = true;
        this.departmentService.getAllDepartments().subscribe({
            next: (departments) => {
                this.departments = departments;
                this.dataSource.data = departments;
                this.isLoading = false;
            },
            error: (error) => {
                this.snackBar.open('Error loading departments', 'Close', { duration: 3000 });
                this.isLoading = false;
            }
        });
    }

    searchDepartments(): void {
        if (this.searchDepartmentId) {
            this.departmentService.getDepartmentById(this.searchDepartmentId).subscribe({
                next: (department) => {
                    this.dataSource.data = [department];
                },
                error: (error) => {
                    this.snackBar.open('Department not found', 'Close', { duration: 3000 });
                    this.dataSource.data = [];
                }
            });
        } else if (this.searchName) {
            this.departmentService.searchDepartmentsByName(this.searchName).subscribe({
                next: (departments) => {
                    this.dataSource.data = departments;
                },
                error: (error) => {
                    this.snackBar.open('Error searching departments', 'Close', { duration: 3000 });
                }
            });
        } else {
            this.dataSource.data = this.departments;
        }
    }

    clearSearch(): void {
        this.searchDepartmentId = null;
        this.searchName = '';
        this.dataSource.data = this.departments;
    }

    openDepartmentForm(department?: Department): void {
        const dialogRef = this.dialog.open(DepartmentFormComponent, {
            width: '500px',
            data: { department }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadDepartments();
            }
        });
    }

    // deleteDepartment(department: Department): void {
    //     if (confirm(`Are you sure you want to delete ${department.name}?`)) {
    //         this.departmentService.deleteDepartment(department.departmentId).subscribe({
    //             next: () => {
    //                 this.snackBar.open('Department deleted successfully', 'Close', { duration: 3000 });
    //                 this.loadDepartments();
    //             },
    //             error: (error) => {
    //                 this.snackBar.open('Error deleting department', 'Close', { duration: 3000 });
    //             }
    //         });
    //     }
    // }

    deleteDepartment(department: Department): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: "400px",
            data: {
                title: "Delete Department",
                message: `Are you sure you want to delete ${department.name}?`,
            },
        })

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.departmentService.deleteDepartment(department.departmentId).subscribe({
                    next: () => {
                        this.snackBar.open("Department deleted successfully", "Close", { duration: 3000 })
                        this.loadDepartments()
                    },
                    error: (error: any) => {
                        console.error("Error deleting department:", error)
                        this.snackBar.open("Error deleting department", "Close", { duration: 3000 })
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