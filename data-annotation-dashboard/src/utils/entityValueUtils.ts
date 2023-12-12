import {
    setEntityValues,
    setEntityValuesCount,
    setEntityValuesExports,
} from '@/redux/features/entityValuesSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getEntityValuesFun = async (entityId: any, page: any) => {
    const isAdmin = store.getState().user.loggedInUser.user_type === 'ADMIN';
    try {
        const response = await axiosInstance.get(
            `/entityValues/getEntityValues/${entityId}/${page}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setEntityValues(response.data.results.result));
            store.dispatch(setEntityValuesCount(response.data.results.count));
            if (isAdmin) {
                exportDataToExcel(entityId);
            }
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createsEntityValue = async (name: string, entityId: any) => {
    try {
        const response = await axiosInstance.post(
            '/entityValues/createEntityValues',
            {
                entityId: entityId,
                name,
            }
        );
        if (response.data.isSuccess) {
            getEntityValuesFun(entityId, 0);
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

export const importXlsxFile = async (file: any, entityId: any) => {
    try {
        const response = await axiosInstance.post(
            '/entityValues/importXlsxFile',
            {
                file,
                entityId: entityId,
            }
        );
        if (response.data.isSuccess) {
            getEntityValuesFun(entityId, 0);
            return { error: false, message: 'Intent Added' };
        } else {
            return { error: true, message: response.data.message };
        }
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};

export const exportDataToExcel = async (entityId: any) => {
    try {
        const response = await axiosInstance.get(
            `/entityValues/exportXlsxFile/${entityId}}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setEntityValuesExports(response.data.results));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const checkPermissionFun = async (entityId: any) => {
    try {
        const response = await axiosInstance.get(
            `/entityValues/checkPermission/${entityId}}`
        );
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
};
