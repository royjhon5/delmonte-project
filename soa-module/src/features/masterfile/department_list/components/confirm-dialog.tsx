'use client'

import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import http from '@/api/http'
import { DepartmentData } from '../data/data'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: DepartmentData
}

interface EmpData {
    id: number;
    department_name: string;
}

export function ConfirmationDialog({ open, onOpenChange, currentRow }: Props) {
  const queryClient = useQueryClient();

  const handleConfirm = async (): Promise<void> => {
    const EmpDataTo: EmpData = {
      id: 1,
      department_name: "wew",
    }; 
    try {
      await confirmSave.mutateAsync(EmpDataTo);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
    }
  };
  
  const confirmSave: UseMutationResult<void, AxiosError, EmpData> = useMutation({
    mutationFn: (EmpDataTo: EmpData) => http.post('/save-employeemasterfile', EmpDataTo),
    onSuccess: () => {      
        toast({
            title: 'The following employee has been update:',
            description: (
              <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                <code className='text-white'>
                  {JSON.stringify(currentRow, null, 2)}
                </code>
              </pre>
            ),
          })
          onOpenChange(false);
          queryClient.invalidateQueries({ queryKey: ['/get-employeemasterfile'] });
    },
    onError: (error: AxiosError) => {
        toast({
          title: 'Error',
          description: error.message,
        });
      }
  });

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      title={
        <span className='text-warning'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-confirm'
            size={18}
          />{' '}
          Update Employee
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to update {' '}
            <span className='font-bold'>{currentRow.department_name}</span>?
            <br />
          </p>
        </div>
      }
      confirmText='Update'
      destructive
    />
  )
}
