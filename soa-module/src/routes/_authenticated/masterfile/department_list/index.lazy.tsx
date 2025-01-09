import DepartmentList from '@/features/masterfile/department_list'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/masterfile/department_list/',
)({
  component: DepartmentList,
})

