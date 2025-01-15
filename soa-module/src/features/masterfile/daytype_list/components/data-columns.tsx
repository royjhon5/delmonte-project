import { ColumnDef } from '@tanstack/react-table'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { GlobalData } from '../data/data'

export const DataColumns: ColumnDef<GlobalData>[] = [
  {
    accessorKey: 'dt_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Day Type" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-45">{row.getValue('dt_name')}</LongText>
    ),
    meta: { className: 'w-50' },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions
  },
]

