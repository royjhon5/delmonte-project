import GlCodeList from '@/features/masterfile/gl_code'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/masterfile/gl_code/')(
  {
    component: GlCodeList,
  },
)

