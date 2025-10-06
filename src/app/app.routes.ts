import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee/employee-form/employee-form.component';
import { DepartmentListComponent } from './components/department/department-list/department-list.component';
import { DepartmentFormComponent } from './components/department/department-form/department-form.component';

export const routes: Routes = [
  { path: '', component: EmployeeListComponent, pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employee-form', component: EmployeeFormComponent },
  { path: 'employee-form/:id', component: EmployeeFormComponent },
  { path: 'departments', component: DepartmentListComponent },
  { path: 'department-form', component: DepartmentFormComponent },
  { path: 'department-form/:id', component: DepartmentFormComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];