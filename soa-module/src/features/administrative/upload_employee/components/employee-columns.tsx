import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import LongText from '@/components/long-text'
import { EmployeeData } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const employeColumns: ColumnDef<EmployeeData>[] = [
  {
    accessorKey: 'ChapaID_Old',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chapa ID" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.getValue('ChapaID_Old')}</LongText>
    ),
    meta: { className: 'w-45' },
    enableHiding: false,
  },
  {
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      const { FName, LName } = row.original
      const fullName = `${FName} ${LName}`
      return <LongText className="max-w-36">{fullName}</LongText>
    },
    meta: { className: 'w-45' },
  },
  {
    accessorKey: 'EmployeeStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee Status" />
    ),
    cell: ({ row }) => {
      const empStatus = (row.getValue('EmployeeStatus') as string).toUpperCase();
      return <div>{empStatus === "ACTIVE" ? 
      <Badge variant='outline' className={cn('bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300')}>
      Active
      </Badge> : 
      <Badge variant='outline' className={cn('capitalize bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10')}>
      In-Active
      </Badge>
      }</div>;
    },
  },
  {
    accessorKey: 'IsPH',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Pack House Employee" />
    ),
    cell: ({ row }) => {
      const isPH = row.getValue('IsPH');
      return <div>{isPH === 1 ? 
      <Badge variant='outline' className={cn('capitalize bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200')}>
      Yes
      </Badge> : 
      <Badge variant='outline' className={cn('capitalize bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10')}>
      No
      </Badge>
      }</div>;
    },
    enableSorting: false,
  },
  {
    id: 'global',
    header: '',
    filterFn: (row, columnId, value) => {
      const chapaId = row.getValue('ChapaID_Old') as string
      const fullName = `${row.original.FName} ${row.original.ChapaID_Old}`
      return (
        chapaId.toLowerCase().includes(value.toLowerCase()) ||
        fullName.toLowerCase().includes(value.toLowerCase())
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: DataTableRowActions
  },
]

