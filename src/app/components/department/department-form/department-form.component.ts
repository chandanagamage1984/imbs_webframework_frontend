import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular material modules
import { MatDialogModule, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department.model';

@Component({
    selector: 'app-department-form',
    standalone: true,
    templateUrl: './department-form.component.html',
    styleUrls: ['./department-form.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,

        // Material Modules
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ]
})
export class DepartmentFormComponent implements OnInit {
    departmentForm: FormGroup;
    isEditMode = false;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private departmentService: DepartmentService,
        private dialogRef: MatDialogRef<DepartmentFormComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: { department?: Department }
    ) {
        this.departmentForm = this.createForm();
        this.isEditMode = !!data.department;
    }

    ngOnInit(): void {
        if (this.isEditMode && this.data.department) {
            this.populateForm(this.data.department);
        }
    }

    createForm(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            location: ['', [Validators.required]]
        });
    }

    populateForm(department: Department): void {
        this.departmentForm.patchValue({
            name: department.name,
            location: department.location
        });
    }

    onSubmit(): void {
        if (this.departmentForm.valid) {
            this.isLoading = true;
            const departmentData: Department = this.departmentForm.value;

            const operation = this.isEditMode
                ? this.departmentService.updateDepartment(this.data.department!.departmentId, departmentData)
                : this.departmentService.createDepartment(departmentData);

            operation.subscribe({
                next: (result) => {
                    this.snackBar.open(
                        `Department ${this.isEditMode ? 'updated' : 'created'} successfully`,
                        'Close',
                        { duration: 3000 }
                    );
                    this.dialogRef.close(true);
                    this.isLoading = false;
                },
                error: (error) => {
                    this.snackBar.open(
                        `Error ${this.isEditMode ? 'updating' : 'creating'} department`,
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

    get name() { return this.departmentForm.get('name'); }
    get location() { return this.departmentForm.get('location'); }
}