import { setUsers } from '@/redux/features/userSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getUsersFun = async () => {
    try {
        const response = await axiosInstance.get(`/users/getUsers`);
        if (response.data.isSuccess) {
            store.dispatch(setUsers(response.data.results));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createUserFun = async (data: any) => {
    try {
        const response = await axiosInstance.post('/users/createUser', {
            ...data,
        });
        if (response.data.isSuccess) {
            getUsersFun();
            toast.success('User Added');
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

export const updateUser = async ({ id, data }: any) => {
    const parseData = {} as any;
    for (const key in data) {
        const element = data[key];
        parseData[key] = { set: element };
    }
    try {
        const response = await axiosInstance.put(`/users/updateUser/${id}`, {
            data: parseData,
        });
        if (response.data.isSuccess) {
            getUsersFun();
            return { error: false, message: 'Intent Added' };
        } else {
            return { error: true, message: response.data.message };
        }
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};
