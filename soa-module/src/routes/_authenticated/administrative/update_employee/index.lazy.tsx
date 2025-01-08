import EmployeeMasterFile from '@/features/administrative/upload_employee'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/administrative/update_employee/',
)({
  component: EmployeeMasterFile,
})

