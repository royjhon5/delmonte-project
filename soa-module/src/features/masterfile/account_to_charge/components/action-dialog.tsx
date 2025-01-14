'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { GlobalData } from '../data/data'
import { useMemo } from 'react'
import { customQuery } from '@/hooks/custom-hooks'
import { Combobox } from '@/components/combo-box'

const formSchema = z
  .object({
    costcenter: z.string().min(1, { message: 'Cost Center details is required.' }),
    gl_code: z.string().min(1, { message: 'Department details is required.' }),
    isEdit: z.boolean(),
  })
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: GlobalData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow

  const { data: ccData, isLoading: isLoadingCostCenter } = customQuery('/get-costcenter', {}, true) || { data: undefined, isLoading: false };
  /* eslint-disable */
  const costcenterData = useMemo(() => {
    if (Array.isArray(ccData)) {
      return ccData.map((location: any) => ({
        value: location.id, 
        label: location.costcenter,
      }))
    }
    return []
  }, [ccData])
  const selectedCostCenterValue = (valueSelectedCostCenter: string) => {
    console.log("Selected value:", valueSelectedCostCenter)
  }

  const { data: glCode, isLoading: isLoadingGlCode } = customQuery('/get-glcode', {}, true) || { data: undefined, isLoading: false };
  /* eslint-disable */
  const glcodeData = useMemo(() => {
    if (Array.isArray(glCode)) {
      return glCode.map((location: any) => ({
        value: location.id, 
        label: location.gl_code,
      }))
    }
    return []
  }, [glCode])
  const selectedGlCodeValue = (selectedData: string) => {
    console.log("Selected value:", selectedData)
  }


  const { data: activity, isLoading: isLoadingActivity } = customQuery('/get-activity', {}, true) || { data: undefined, isLoading: false };
  /* eslint-disable */
  const activityData = useMemo(() => {
    if (Array.isArray(activity)) {
      return activity.map((location: any) => ({
        value: location.id, 
        label: location.activityname,
      }))
    }
    return []
  }, [glCode])
  const selectedActivityValue = (selectedData: string) => {
    console.log("Selected value:", selectedData)
  }


  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          costcenter: '',
          gl_code: '',
          isEdit,
        },
  })

  const onSubmit = (values: UserForm) => {
    form.reset()
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
    onOpenChange(false)
  }


  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit' : 'Add New'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the location details here. ' : 'Create new location details here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
               <FormField
                  control={form.control}
                  name='costcenter'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                      <FormLabel className='col-span-2 text-left'>
                        Cost Center
                      </FormLabel>
                      <FormControl>
                      <Combobox data={costcenterData} placeholder='Click to select' onSelect={selectedCostCenterValue}
                          isLoading={isLoadingCostCenter} {...field}  />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='gl_code'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                      <FormLabel className='col-span-2 text-left'>
                        GL Code
                      </FormLabel>
                      <FormControl>
                      <Combobox data={glcodeData} placeholder='Click to select' onSelect={selectedGlCodeValue}
                          isLoading={isLoadingGlCode} {...field}  />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name='gl_code'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                      <FormLabel className='col-span-2 text-left'>
                        Activity Name
                      </FormLabel>
                      <FormControl>
                      <Combobox data={activityData} placeholder='Click to select' onSelect={selectedActivityValue}
                          isLoading={isLoadingActivity} {...field}  />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />  
            </form>
          </Form>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            {isEdit ? 'Update changes. ' : 'Save Data. '}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
