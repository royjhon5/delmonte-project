import { ColumnDef } from '@tanstack/react-table'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { GlobalData } from '../data/data'

export const DataColumns: ColumnDef<GlobalData>[] = [
  {
    accessorKey: 'activityname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity Name" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-45">{row.getValue('activityname')}</LongText>
    ),
    meta: { className: 'w-50' },
    enableHiding: false,
  },
  {
    accessorKey: 'gl_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GL Code" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-45">{row.getValue('gl_code')}</LongText>
    ),
    meta: { className: 'w-50' },
    enableHiding: false,
  },
  {
    accessorKey: 'costcenter',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost Center" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-45">{row.getValue('costcenter')}</LongText>
    ),
    meta: { className: 'w-50' },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions
  },
]

