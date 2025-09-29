export interface Employee {
  id: number
  name: string
  position: string
  department: string
  salary: number
}

export interface CreateEmployeeRequest {
  name: string
  position: string
  department: string
  salary: number
}

export interface UpdateEmployeeRequest {
  id: number
  name: string
  position: string
  department: string
  salary: number
}
