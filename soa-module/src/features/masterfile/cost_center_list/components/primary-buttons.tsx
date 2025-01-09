import { IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useLocation } from '../context/context-provider'

export function PrimaryButton() {
  const { setOpen } = useLocation()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Location</span> <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
