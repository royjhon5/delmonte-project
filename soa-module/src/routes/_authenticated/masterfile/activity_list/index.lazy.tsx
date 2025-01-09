import ActivityList from '@/features/masterfile/activity_list'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/masterfile/activity_list/',
)({
  component: ActivityList,
})
