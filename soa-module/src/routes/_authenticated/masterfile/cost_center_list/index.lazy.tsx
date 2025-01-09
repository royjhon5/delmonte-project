import CostCenterList from '@/features/masterfile/cost_center_list'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/masterfile/cost_center_list/',
)({
  component: CostCenterList,
})

