import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
// import { callTypes, userTypes } from '../data/data'
import { EmployeeData } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const employeColumns: ColumnDef<EmployeeData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: { className: 'w-45' },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      const empStatus = row.getValue('EmployeeStatus');
      return <div>{empStatus === "ACTIVE" ? 
      <Badge variant='outline' className={cn('capitalize bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300')}>
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
    cell: ({ row }) => {
      const isPH = row.getValue('IsPH'); 
      return isPH === 1 ? null : <DataTableRowActions row={row} />;
    },
  },
]

