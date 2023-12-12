import {
    setIntentsFlows,
    setIntentsFlowsCount,
    setIntentsFlowsExports,
} from '@/redux/features/intentsFlowsSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getIntentsFlowsFun = async (intentsId: any, page: any) => {
    const isAdmin = store.getState().user.loggedInUser.user_type === 'ADMIN';
    try {
        const response = await axiosInstance.get(
            `/intentsFlows/getIntentsFlows/${intentsId}/${page}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setIntentsFlows(response.data.results.result));
            store.dispatch(setIntentsFlowsCount(response.data.results.count));
            if (isAdmin) {
                exportDataToExcel(intentsId);
            }
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createIntentsFlow = async (text: string, intentsId: any) => {
    try {
        const response = await axiosInstance.post(
            '/intentsFlows/createIntentsFlows',
            {
                intentsId: intentsId,
                text,
            }
        );
        if (response.data.isSuccess) {
            getIntentsFlowsFun(intentsId, 0);
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

export const importXlsxFile = async (file: any, intentsId: any) => {
    try {
        const response = await axiosInstance.post(
            '/intentsFlows/importXlsxFile',
            {
                file,
                intentsId: intentsId,
            }
        );
        let success = [] as any;
        let failed = [] as any;
        for (let index = 0; index < response.data.length; index++) {
            const { isSuccess, message } = response.data[index];
            if (isSuccess) {
                success.push(message);
            } else {
                failed.push(message);
            }
        }
        if (success.length) {
            toast.success(success.join('\n'));
        }
        if (failed.length) {
            toast.error(failed.join('\n'));
        }
        getIntentsFlowsFun(intentsId, 0);
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};

export const exportDataToExcel = async (intentsId: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsFlows/exportXlsxFile/${intentsId}}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setIntentsFlowsExports(response.data.results));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const checkPermissionFun = async (intentsId: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsFlows/checkPermission/${intentsId}}`
        );
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
};
