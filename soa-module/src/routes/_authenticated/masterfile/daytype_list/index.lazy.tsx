import DayTypeList from '@/features/masterfile/daytype_list'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/masterfile/daytype_list/',
)({
  component: DayTypeList,
})
