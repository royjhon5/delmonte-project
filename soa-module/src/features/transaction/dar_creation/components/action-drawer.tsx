import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { GlobalData } from '../data/data'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: GlobalData
}

const formSchema = z.object({
  groupline_name: z.string().min(1, 'Please select a status.'),
})
type GlobaForm = z.infer<typeof formSchema>

export function ActionDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const form = useForm<GlobaForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      groupline_name: '',
    },
  })

  const onSubmit = (data: GlobaForm) => {
    // do something with the form data
    onOpenChange(false)
    form.reset()
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new employee by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-1 flex-1'
          >
            <FormField
              control={form.control}
              name='groupline_name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Chapa ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a chapa' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-2'>
            <FormField
              control={form.control}
              name='groupline_name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a first name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='groupline_name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Middle name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a middle name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            

            <div className='grid grid-cols-2 gap-2'>
            <FormField
              control={form.control}
              name='groupline_name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a last name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='groupline_name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Ext. name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a ext. name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='tasks-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
