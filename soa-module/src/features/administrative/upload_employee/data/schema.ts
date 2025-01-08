import { z } from 'zod'

const employeeSchema = z.object({
  EmpID: z.number(),
  ChapaID_Old: z.string(),
  FName: z.string(),
  LName: z.string(),
  MName: z.string(),
  ExtName: z.string(),
  EmployeeStatus: z.string(),
  IsPH: z.number(),
});

export type EmployeeData = z.infer<typeof employeeSchema>
export const employeeListSchema = z.array(employeeSchema);
