import { z } from 'zod'

const globalSchema = z.object({
  id: z.number(),
  activity_id_link: z.number(),
  glcode_id_link: z.number(),
  costcenter_id_link: z.number(),
  activityname: z.string(),
  gl_code: z.string(),
  costcenter: z.string(),
});

export type GlobalData = z.infer<typeof globalSchema>
export const globalListSchema = z.array(globalSchema);
