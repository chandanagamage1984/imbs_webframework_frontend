# Employee Management System - Frontend

## Overview
This is an Angular 17 frontend application for the Employee Management System. It provides a modern, responsive interface for managing employee data with full CRUD operations.

## Features
- **Employee List**: View all employees in a data table with search functionality
- **Add Employee**: Create new employee records with form validation
- **Edit Employee**: Update existing employee information
- **Delete Employee**: Remove employees with confirmation dialog
- **Search**: Filter employees by name, position, or department
- **Responsive Design**: Works on desktop and mobile devices
- **Material Design**: Uses Angular Material for consistent UI components

## Technology Stack
- Angular 17 (Standalone Components)
- Angular Material
- TypeScript
- RxJS
- SCSS

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

## Installation
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `ng serve`
4. Open your browser to `http://localhost:4200`

## Project Structure
\`\`\`
frontend/src/
├── app/
│   ├── components/
│   │   ├── employee-list/
│   │   ├── employee-form/
│   │   └── confirm-dialog/
│   ├── models/
│   │   └── employee.model.ts
│   ├── services/
│   │   └── employee.service.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.scss
\`\`\`

## Configuration
Update the API URL in `src/environments/environment.ts`:
\`\`\`typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000/api'
};
\`\`\`

## Available Scripts
- `ng serve` - Start development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng lint` - Run linting

## Components

### Employee List Component
- Displays employees in a Material table
- Includes search functionality
- Provides edit and delete actions
- Shows loading states and error messages

### Employee Form Component
- Handles both create and edit operations
- Reactive forms with validation
- Material form fields with error messages
- Loading states during submission

### Confirm Dialog Component
- Reusable confirmation dialog
- Used for delete confirmations
- Material dialog implementation

## Services

### Employee Service
- Handles all HTTP communication with the backend API
- Implements error handling and loading states
- Provides methods for all CRUD operations
- Includes search functionality

## Routing
- `/employees` - Employee list page
- `/employees/add` - Add new employee
- `/employees/edit/:id` - Edit existing employee

## Styling
- Uses Angular Material theme (Indigo-Pink)
- Custom SCSS for additional styling
- Responsive design principles
- Consistent spacing and typography

## API Integration
The frontend communicates with the ASP.NET Core Web API backend:
- Base URL: `https://localhost:7000/api`
- All endpoints use JSON for data exchange
- Includes proper error handling for network issues
- CORS is configured on the backend to allow frontend requests
