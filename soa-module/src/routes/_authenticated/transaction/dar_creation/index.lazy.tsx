import DarCreation from '@/features/transaction/dar_creation'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/transaction/dar_creation/',
)({
  component: DarCreation,
})

