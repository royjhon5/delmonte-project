import { ColumnDef } from '@tanstack/react-table'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { DepartmentData } from '../data/data'

export const DataColumns: ColumnDef<DepartmentData>[] = [
  {
    accessorKey: 'department_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department Name" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-45">{row.getValue('department_name')}</LongText>
    ),
    meta: { className: 'w-50' },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions
  },
]

