import { setEntities, setEntitiesCount } from '@/redux/features/entitiesSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getEntitiesFun = async (page: any) => {
    try {
        const response = await axiosInstance.get(
            `/entities/getEntities/${page}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setEntities(response.data.results.result));
            store.dispatch(setEntitiesCount(response.data.results.count));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createEntities = async (name: string, entityColor: string) => {
    try {
        const response = await axiosInstance.post('/entities/createEntities', {
            name,
            color: entityColor,
        });
        if (response.data.isSuccess) {
            getEntitiesFun(0);
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
