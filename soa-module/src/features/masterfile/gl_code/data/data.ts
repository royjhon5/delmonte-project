import { z } from 'zod'

const globalSchema = z.object({
  id: z.number(),
  costcenter: z.string(),
});

export type GlobalData = z.infer<typeof globalSchema>
export const globalListSchema = z.array(globalSchema);
