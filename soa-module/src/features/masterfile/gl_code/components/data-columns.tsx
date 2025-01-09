import { ColumnDef } from '@tanstack/react-table'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { GlobalData } from '../data/data'

export const DataColumns: ColumnDef<GlobalData>[] = [
  {
    accessorKey: 'costcenter',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost Center Name" />
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

