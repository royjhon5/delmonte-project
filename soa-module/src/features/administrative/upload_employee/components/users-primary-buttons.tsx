import { IconFileExport } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export function UsersPrimaryButtons() {
  const exportData = async () => {
    window.open("http://localhost:8000/api/export-packhouse-employee")        
  };
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={exportData}>
        <span>Export Data</span> <IconFileExport size={18} />
      </Button>
    </div>
  )
}
