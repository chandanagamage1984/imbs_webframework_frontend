import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employee-form', component: EmployeeFormComponent },
  { path: 'employee-form/:id', component: EmployeeFormComponent },
  { path: '**', redirectTo: '/employees' }
];