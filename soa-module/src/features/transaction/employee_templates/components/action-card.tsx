'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { GlobalData } from '../data/data'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Combobox } from '@/components/combo-box'
import { useMemo } from 'react'
import { customQuery } from '@/hooks/custom-hooks'
import { Button } from '@/components/ui/button'
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z
  .object({
    groupline_name	: z.string().min(1, { message: 'Field details is required.' }),
    isEdit: z.boolean(),
  })
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: GlobalData
}

export function FormActionCard({ currentRow }: Props) {
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          groupline_name: '',
          isEdit,
        },
  });

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
  }, [activity])
  const selectedActivityValue = (selectedData: string) => {
    console.log("Selected value:", selectedData)
  }

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
  }


  return (
        <Card>
            <CardHeader className='p-2 mb-2'>
                <p>Template</p>
            </CardHeader>
            <CardContent className='p-2'>
                <Form {...form}>
                <form
                id='user-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 p-0.5'
                >
                {/* templates name */}
               <FormField
                control={form.control}
                name='groupline_name'
                    render={({ field }) => (
                        <FormItem className='space-y-1'>
                        <FormLabel>Templates Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder='Enter a template name' />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {/* activity name */}
                <FormField
                  control={form.control}
                  name='groupline_name'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel className="block mb-1">Activity Name</FormLabel>
                      <FormControl>
                      <Combobox data={activityData} placeholder='Click to select' onSelect={selectedActivityValue}
                          isLoading={isLoadingActivity} {...field}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* department name */}
                <FormField
                  control={form.control}
                  name='groupline_name'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel className="block mb-1">Department</FormLabel>
                      <FormControl>
                      <Combobox data={activityData} placeholder='Click to select' onSelect={selectedActivityValue}
                          isLoading={isLoadingActivity} {...field}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Group name */}
                <FormField
                  control={form.control}
                  name='groupline_name'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel className="block mb-1">Group Name</FormLabel>
                      <FormControl>
                      <Combobox data={activityData} placeholder='Click to select' onSelect={selectedActivityValue}
                          isLoading={isLoadingActivity} {...field}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Shifting name */}
                <FormField
                  control={form.control}
                  name='groupline_name'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel className="block mb-1">Shifting</FormLabel>
                      <FormControl>
                      <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Select a role'
                          className='col-span-4'
                          items={[
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </form>
            </Form>
            </CardContent>
            <CardFooter className='p-2 flex justify-end'>
               <Button>
                Save
               </Button>
            </CardFooter>
        </Card>
  ) 
}
