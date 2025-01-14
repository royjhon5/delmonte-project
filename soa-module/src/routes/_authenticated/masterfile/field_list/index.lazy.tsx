import FieldList from '@/features/masterfile/field_list'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/masterfile/field_list/',
)({
  component: FieldList,
})

