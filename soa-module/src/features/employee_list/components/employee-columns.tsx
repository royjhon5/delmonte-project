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
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
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
    accessorKey: 'chapa_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chapa ID" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.getValue('chapa_id')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
    enableHiding: false,
  },
  {
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      const { firstname, lastname } = row.original
      const fullName = `${firstname} ${lastname}`
      return <LongText className="max-w-36">{fullName}</LongText>
    },
    meta: { className: 'w-45' },
  },
  {
    accessorKey: 'default_activity_idlink',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Default Activity" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue('default_activity_idlink')}</div>
    ),
  },
  {
    accessorKey: 'assigned_location_idlink',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned Location" />
    ),
    cell: ({ row }) => <div>{row.getValue('assigned_location_idlink')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'assigned_department_idlink',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned Department" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn('capitalize')}>
            {row.getValue('assigned_department_idlink')}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'assigned_group_idlink',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned Group" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-x-2 items-center">
          <span className="capitalize text-sm">{row.getValue('assigned_group_idlink')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  // Global filter column
  {
    id: 'global',
    header: 'Global Filter',
    filterFn: (row, columnId, value) => {
      const chapaId = row.getValue('chapa_id') as string
      const fullName = `${row.original.firstname} ${row.original.lastname}`
      return (
        chapaId.toLowerCase().includes(value.toLowerCase()) ||
        fullName.toLowerCase().includes(value.toLowerCase())
      )
    },
    enableSorting: false,
    enableHiding: true, // Optional: Hide this column from UI
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]

