'use client'

import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EmployeeData } from '../data/schema'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import http from '@/api/http'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: EmployeeData
}

interface EmpData {
    EmpID: number;
    IsPH: number;
}

export function EmployeeConfirmationDialog({ open, onOpenChange, currentRow }: Props) {
  const queryClient = useQueryClient();
  const handleConfirm = async (): Promise<void> => {
    const EmpDataTo: EmpData = {
      EmpID: currentRow.EmpID,
      IsPH: 1,
    }; 
    try {
      await saveNewScannerData.mutateAsync(EmpDataTo);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
    }
  };
  
  const saveNewScannerData: UseMutationResult<void, AxiosError, EmpData> = useMutation({
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
            Are you sure you want to update the status of{' '}
            <span className='font-bold'>{currentRow.FName} {currentRow.LName}</span>?
            <br />
            This action will permanently change his/her status. This cannot be undone.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Update'
      destructive
    />
  )
}
