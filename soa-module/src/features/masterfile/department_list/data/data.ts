import { z } from 'zod'

const departmentSchema = z.object({
  id: z.number(),
  department_name: z.string(),
});

export type DepartmentData = z.infer<typeof departmentSchema>
export const departmentListSchema = z.array(departmentSchema);
