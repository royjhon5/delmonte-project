import EmployeeTemplates from '@/features/transaction/employee_templates'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/transaction/employee_templates/',
)({
  component: EmployeeTemplates,
})

