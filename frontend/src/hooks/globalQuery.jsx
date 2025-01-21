import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import http from '../api/http';

const hookContainer = (urlEndPoint = false, paramsVar = [], enabled) => {
	if (urlEndPoint) {
		return useQuery({
			queryKey: [urlEndPoint],
			enabled: enabled,
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
};

export {
	hookContainer
};

export default {
	hookContainer,
};
