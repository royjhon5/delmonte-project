import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import http from '../api/http';

const customQuery = (
  urlEndPoint: string | false = false,
  paramsVar: Record<string, any> = {},
  enabled: boolean = true
): UseQueryResult<any, unknown> | undefined => {
  if (urlEndPoint) {
    return useQuery<any, unknown>({
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
  }
  return undefined;
};

export {
    customQuery,
};

export default {
    customQuery,
};
