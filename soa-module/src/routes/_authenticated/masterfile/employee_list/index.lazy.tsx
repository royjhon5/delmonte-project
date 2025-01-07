import { createLazyFileRoute } from '@tanstack/react-router'
import EmployeeList from '@/features/employee_list'

export const Route = createLazyFileRoute(
  '/_authenticated/masterfile/employee_list/',
)({
  component: EmployeeList,
})

