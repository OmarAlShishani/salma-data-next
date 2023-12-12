import {
    setSmallTalks,
    setSmallTalksCount,
} from '@/redux/features/smallTalkSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getSmallTalksFun = async (page: any) => {
    try {
        const response = await axiosInstance.get(
            `/smallTalks/getSmallTalks/${page}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setSmallTalks(response.data.results.result));
            store.dispatch(setSmallTalksCount(response.data.results.count));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createSmallTalks = async (name: string) => {
    try {
        const response = await axiosInstance.post(
            '/smallTalks/createSmallTalks',
            {
                name,
            }
        );
        if (response.data.isSuccess) {
            getSmallTalksFun(0);
            return { error: false, message: 'Intent Added' };
        } else {
            toast.error(response.data.message);
            return { error: true, message: response.data.message };
        }
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};
