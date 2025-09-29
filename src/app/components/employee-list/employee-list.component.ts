import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatCardModule } from "@angular/material/card"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatTooltipModule } from "@angular/material/tooltip"
import { Router } from "@angular/router"

import type { Employee } from "../../models/employee.model"
import { EmployeeService } from "../../services/employee.service"
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component"

@Component({
  selector: "app-employee-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = []
  filteredEmployees: Employee[] = []
  searchTerm = ""
  loading = false
  displayedColumns: string[] = ["id", "name", "position", "department", "salary", "actions"]

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadEmployees()
  }

  loadEmployees(): void {
    this.loading = true
    this.employeeService.getAllEmployees().subscribe({
      next: (employees: Employee[]) => {
        console.log('Loaded employees:', employees)
        this.employees = employees
        this.filteredEmployees = employees
        this.loading = false
      },
      error: (error: any) => {
        console.error("Error loading employees:", error)
        this.snackBar.open("Error loading employees", "Close", { duration: 3000 })
        this.loading = false
      },
    })
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = this.employees
      return
    }

    const term = this.searchTerm.toLowerCase()
    this.filteredEmployees = this.employees.filter(
      (employee) =>
        employee.id.toString().includes(term) ||
        employee.name.toLowerCase().includes(term) ||
        employee.position.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term),
    )
  }

  editEmployee(id: number): void {
    console.log('Edit employee clicked, ID:', id)
    // Navigate to employee form with the ID parameter
    this.router.navigate(['/employee-form', id]).then(success => {
      console.log('Navigation success:', success)
    }).catch(err => {
      console.error('Navigation error:', err)
    })
  }

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Delete Employee",
        message: `Are you sure you want to delete ${employee.name}?`,
      },
    })

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.employeeService.deleteEmployee(employee.id).subscribe({
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

  addEmployee(): void {
    console.log('Add employee clicked')
    // Navigate to employee form without ID parameter (for adding new employee)
    this.router.navigate(['/employee-form']).then(success => {
      console.log('Add navigation success:', success)
    }).catch(err => {
      console.error('Add navigation error:', err)
    })
  }
}