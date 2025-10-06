import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Imports
import { MatDialogModule, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EmployeeService } from '../../../services/employee.service';
import { EmployeeWithDepartment, EmployeeInput } from '../../../models/employee.model';
import { Department } from '../../../models/department.model';

@Component({
    standalone: true,
    selector: 'app-employee-form',
    templateUrl: './employee-form.component.html',
    styleUrls: ['./employee-form.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatButtonModule
    ]
})
export class EmployeeFormComponent implements OnInit {
    employeeForm: FormGroup;
    isEditMode = false;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        private dialogRef: MatDialogRef<EmployeeFormComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: { employee?: EmployeeWithDepartment, departments: Department[] }
    ) {
        this.employeeForm = this.createForm();
        this.isEditMode = !!data.employee;
    }

    ngOnInit(): void {
        if (this.isEditMode && this.data.employee) {
            this.populateForm(this.data.employee);
        }
    }

    createForm(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],
            salary: ['', [Validators.required, Validators.min(0)]],
            departmentId: ['', [Validators.required]]
        });
    }

    populateForm(employee: EmployeeWithDepartment): void {
        this.employeeForm.patchValue({
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            salary: employee.salary,
            departmentId: this.getDepartmentIdFromEmployee(employee)
        });
    }

    getDepartmentIdFromEmployee(employee: EmployeeWithDepartment): number {
        const dept = this.data.departments.find(d => d.name === employee.departmentName);
        return dept ? dept.departmentId : 0;
    }

    onSubmit(): void {
        if (this.employeeForm.valid) {
            this.isLoading = true;
            const employeeData: EmployeeInput = this.employeeForm.value;

            const operation = this.isEditMode
                ? this.employeeService.updateEmployee(this.data.employee!.employeeId, employeeData)
                : this.employeeService.createEmployee(employeeData);

            operation.subscribe({
                next: (result) => {
                    this.snackBar.open(
                        `Employee ${this.isEditMode ? 'updated' : 'created'} successfully`,
                        'Close',
                        { duration: 3000 }
                    );
                    this.dialogRef.close(true);
                    this.isLoading = false;
                },
                error: (error) => {
                    this.snackBar.open(
                        `Error ${this.isEditMode ? 'updating' : 'creating'} employee`,
                        'Close',
                        { duration: 3000 }
                    );
                    this.isLoading = false;
                }
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    // Form field getters for easy access in template
    get name() { return this.employeeForm.get('name'); }
    get email() { return this.employeeForm.get('email'); }
    get phone() { return this.employeeForm.get('phone'); }
    get salary() { return this.employeeForm.get('salary'); }
    get departmentId() { return this.employeeForm.get('departmentId'); }
}