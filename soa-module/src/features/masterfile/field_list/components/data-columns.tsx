import { ColumnDef } from '@tanstack/react-table'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { GlobalData } from '../data/data'

export const DataColumns: ColumnDef<GlobalData>[] = [
  {
    accessorKey: 'field_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Field name" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-45">{row.getValue('field_name')}</LongText>
    ),
    meta: { className: 'w-50' },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions
  },
]

