import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('cashier'),
  z.literal('manager'),
])

const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

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

export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema);
export const employeeListSchema = z.array(employeeSchema);
