/* eslint-disable */

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import http from '../api/http';

interface CustomQueryResult {
  data?: any;
}

const customQuery = (
  urlEndPoint: string | false = false,
  paramsVar: Record<string, any> = {},
  enabled: boolean = true
): CustomQueryResult | undefined => {
  if (urlEndPoint) {
    const queryResult = useQuery<any, unknown>({
      queryKey: [urlEndPoint],
      enabled,
      queryFn: async () => {
        const response = await http.get(urlEndPoint, { params: paramsVar });
        return response.data;
      },
      onError: () => {
        toast.error('Connection failed!');
      },
      staleTime: 60000,
      cacheTime: 300000,
    });

    return {
      data: queryResult.data,
    };
  }
  return undefined;
};

export { customQuery };

export default {
  customQuery,
};
