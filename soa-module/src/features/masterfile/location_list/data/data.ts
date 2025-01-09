import { z } from 'zod'

const locationSchema = z.object({
  id: z.number(),
  location_name: z.string(),
});

export type LocationData = z.infer<typeof locationSchema>
export const LocationListSchema = z.array(locationSchema);
