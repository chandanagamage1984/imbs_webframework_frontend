import { Component, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    // Material Modules:
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Employee's Management System";
  @ViewChild('sidenav') sidenav!: MatSidenav;
  navItems = [
    { path: '/employees', icon: 'people', label: 'Employees' },
    { path: '/departments', icon: 'business', label: 'Departments' },
  ];
}
