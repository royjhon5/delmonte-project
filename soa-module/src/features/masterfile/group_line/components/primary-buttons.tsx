import { IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useMainContext } from '../context/context-provider'

export function PrimaryButton() {
  const { setOpen } = useMainContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Group Line</span> <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
