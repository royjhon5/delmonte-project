import LocationList from '@/features/masterfile/location_list'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/masterfile/location_list/',
)({
  component: LocationList,
})

