import AccountToChargeList from '@/features/masterfile/account_to_charge'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/masterfile/account_to_charge/',
)({
  component: AccountToChargeList,
})

