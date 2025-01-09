import { IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useDepartment } from '../context/department-context'

export function PrimaryButton() {
  const { setOpen } = useDepartment()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Department</span> <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
