import { setIntents, setIntentsCount, setIntentsRoles } from '@/redux/features/intentsSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getIntentsFun = async (page: any) => {
    try {
        const response = await axiosInstance.get(`/intents/getIntents/${page}`);
        if (response.data.isSuccess) {
            store.dispatch(setIntents(response.data.results.result));
            store.dispatch(setIntentsCount(response.data.results.count));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createIntent = async (name: string) => {
    try {
        const response = await axiosInstance.post('/intents/createIntents', {
            name,
        });
        if (response.data.isSuccess) {
            getIntentsFun(0);
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
