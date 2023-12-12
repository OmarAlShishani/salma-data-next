/** @format */

import axios, { AxiosInstance } from 'axios';
import { restApiUrl } from '../../config/variables';
import { store } from '../redux/store';

const axiosInstance: AxiosInstance = axios.create({
    // API base URL
    headers: {
        Authorization: `Bearer ${store.getState().user.token}`,
    },
    baseURL: restApiUrl,
    // Other Axios configurations (headers, interceptors, etc.) can be added here
});

export default axiosInstance;
