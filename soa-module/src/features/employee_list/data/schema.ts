import { z } from 'zod'

const employeeSchema = z.object({
  id: z.number(),
  chapa_id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  middlename: z.string(),
  extname: z.string(),
  assigned_location_idlink: z.number(),
  assigned_department_idlink: z.number(),
  assigned_group_idlink: z.number(),
  default_activity_idlink: z.number(),
});

export type EmployeeData = z.infer<typeof employeeSchema>
export const employeeListSchema = z.array(employeeSchema);
