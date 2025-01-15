import { z } from 'zod'

const globalSchema = z.object({
  id: z.number(),
  dt_name	: z.string(),
});

export type GlobalData = z.infer<typeof globalSchema>
export const globalListSchema = z.array(globalSchema);
