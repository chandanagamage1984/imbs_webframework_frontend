import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { ActivatedRoute, Router } from "@angular/router"

import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from "../../models/employee.model"
import { EmployeeService } from "../../services/employee.service"

@Component({
  selector: "app-employee-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: `./employee-form.component.html`,
  styleUrls: ["./employee-form.component.scss"],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup
  isEditMode = false
  employeeId: number | null = null
  loading = false

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.employeeForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      position: ["", [Validators.required]],
      department: ["", [Validators.required]],
      salary: ["", [Validators.required, Validators.min(0)]],
    })
  }

  ngOnInit(): void {
    console.log('EmployeeFormComponent initialized');

    this.route.params.subscribe((params) => {
      console.log('Route params:', params);

      if (params["id"]) {
        this.isEditMode = true
        this.employeeId = +params["id"]
        console.log('Edit mode - Employee ID:', this.employeeId);
        this.loadEmployee()
      } else {
        console.log('Add mode - Form ready');
        this.isEditMode = false
        this.employeeId = null
      }
    })
  }

  loadEmployee(): void {
    if (this.employeeId) {
      console.log('Loading employee with ID:', this.employeeId);
      this.loading = true

      this.employeeService.getEmployee(this.employeeId).subscribe({
        next: (employee: Employee) => {
          console.log('Employee loaded:', employee);
          this.employeeForm.patchValue(employee)
          this.loading = false
        },
        error: (error: any) => {
          console.error("Error loading employee:", error)
          this.snackBar.open("Error loading employee", "Close", { duration: 3000 })
          this.loading = false
        },
      })
    }
  }

  onSubmit(): void {
    console.log('Form submitted');
    console.log('Form valid:', this.employeeForm.valid);
    console.log('Form value:', this.employeeForm.value);

    if (this.employeeForm.valid) {
      this.loading = true
      const formValue = this.employeeForm.value
      const salary = Number(formValue.salary)

      if (this.isEditMode && this.employeeId) {
        const updateRequest: UpdateEmployeeRequest = {
          id: this.employeeId,
          name: formValue.name,
          position: formValue.position,
          department: formValue.department,
          salary: salary
        }

        console.log('Updating employee with data:', updateRequest);

        this.employeeService.updateEmployee(this.employeeId, updateRequest).subscribe({
          next: (response) => {
            console.log('Employee updated successfully:', response);
            this.snackBar.open("Employee updated successfully", "Close", { duration: 3000 })
            this.loading = false
            this.router.navigate(["/employees"])
          },
          error: (error: any) => {
            console.error("Error updating employee:", error)
            this.snackBar.open(`Error updating employee: ${error}`, "Close", { duration: 5000 })
            this.loading = false
          },
        })
      } else {
        const createRequest: CreateEmployeeRequest = {
          name: formValue.name,
          position: formValue.position,
          department: formValue.department,
          salary: salary
        }

        console.log('Creating new employee with data:', createRequest);

        this.employeeService.createEmployee(createRequest).subscribe({
          next: (response) => {
            console.log('Employee created successfully:', response);
            this.snackBar.open("Employee created successfully", "Close", { duration: 3000 })
            this.loading = false
            this.router.navigate(["/employees"])
          },
          error: (error: any) => {
            console.error("Error creating employee:", error)
            this.snackBar.open(`Error creating employee: ${error}`, "Close", { duration: 5000 })
            this.loading = false
          },
        })
      }
    } else {
      console.log('Form is invalid, marking all fields as touched');
      this.markFormGroupTouched(this.employeeForm)
    }
  }

  onCancel(): void {
    this.router.navigate(["/employees"])
  }

  getErrorMessage(fieldName: string): string {
    const field = this.employeeForm.get(fieldName)
    if (field?.hasError("required")) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    }
    if (field?.hasError("minlength")) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 2 characters`
    }
    if (field?.hasError("min")) {
      return "Salary must be greater than 0"
    }
    return ""
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field)
      control?.markAsTouched({ onlySelf: true })
    })
  }
}