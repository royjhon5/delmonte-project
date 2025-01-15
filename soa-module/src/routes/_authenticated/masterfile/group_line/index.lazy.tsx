import GroupLineList from '@/features/masterfile/group_line'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/masterfile/group_line/',
)({
  component: GroupLineList,
})

