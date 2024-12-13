import Axios, { AxiosInstance } from 'axios';

const baseUrl: string = window.location.origin;

const http: AxiosInstance = Axios.create({
    baseURL: `${baseUrl.split(':')[0]}:${baseUrl.split(':')[1]}:8000/api`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export default http;
