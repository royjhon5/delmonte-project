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
import { Input } from '@/components/ui/input'
import { DepartmentData } from '../data/data'
import { customQuery } from '@/hooks/custom-hooks'
import { useMemo } from 'react'
import { Combobox } from '@/components/combo-box'

const formSchema = z
  .object({
    location_name: z.string().min(1, { message: 'Location details is required.' }),
    department_name: z.string().min(1, { message: 'Department details is required.' }),
    isEdit: z.boolean(),
  })
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: DepartmentData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const { data, isLoading } = customQuery('/get-location', {}, true) || { data: undefined, isLoading: false };
  /* eslint-disable */
  const locationData = useMemo(() => {
    if (Array.isArray(data)) {
      return data.map((location: any) => ({
        value: location.id, 
        label: location.location_name,
      }))
    }
    return []
  }, [data])
  const handleSelect = (selectedValue: string) => {
    console.log("Selected value:", selectedValue)
  }
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          location_name: '',
          department_name: '',
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
            {isEdit ? 'Update the employee here. ' : 'Create new employee here. '}
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
                name='location_name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-left'>
                      Location Name
                    </FormLabel>
                    <FormControl>
                    <Combobox data={locationData} placeholder='Click to select' onSelect={handleSelect}
                        isLoading={isLoading} {...field}  />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='department_name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-left'>
                      Department Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
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
