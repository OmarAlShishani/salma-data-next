import {
    setSmallTalkTestings,
    setSmallTalkTestingsCount,
    setSmallTalkTestingsExports,
} from '@/redux/features/smallTalkTestingSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getSmallTalkTestingsFun = async (smallTalksId: any, page: any) => {
    try {
        const response = await axiosInstance.get(
            `/smallTalkTesting/getSmalltalkTesting/${smallTalksId}/${page}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setSmallTalkTestings(response.data.results.result));
            store.dispatch(
                setSmallTalkTestingsCount(response.data.results.count)
            );
            exportDataToExcel(smallTalksId);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createsSmallTalkTesting = async (
    text: string,
    smallTalksId: any
) => {
    try {
        const response = await axiosInstance.post(
            '/smallTalkTesting/createSmalltalkTesting',
            {
                smalltalkId: smallTalksId,
                text,
            }
        );
        if (response.data.isSuccess) {
            getSmallTalkTestingsFun(smallTalksId, 0);
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

export const importXlsxFile = async (file: any, smallTalksId: any) => {
    try {
        const response = await axiosInstance.post(
            '/smallTalkTesting/importXlsxFile',
            {
                file,
                smalltalkId: smallTalksId,
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
        getSmallTalkTestingsFun(smallTalksId, 0);
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};

export const exportDataToExcel = async (smallTalksId: any) => {
    try {
        const response = await axiosInstance.get(
            `/smallTalkTesting/exportXlsxFile/${smallTalksId}}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setSmallTalkTestingsExports(response.data.results));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const checkPermissionFun = async (smallTalksId: any) => {
    try {
        const response = await axiosInstance.get(
            `/smallTalkTesting/checkPermission/${smallTalksId}}`
        );
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
};

export const deleteSmallTalkTesting = async (
    trainingId: any,
    smallTalksId: any,
    page: any
) => {
    try {
        const response = await axiosInstance.delete(
            `/smallTalkTesting/deleteSmallTalkTesting/${smallTalksId}/${trainingId}`
        );
        if (response.data.isSuccess) {
            getSmallTalkTestingsFun(smallTalksId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};

export const updateSmallTalkTesting = async (
    trainingId: any,
    smallTalksId: any,
    page: any,
    modifyText: any
) => {
    try {
        const response = await axiosInstance.put(
            `/smallTalkTesting/updateSmallTalkTesting/${smallTalksId}/${trainingId}`,
            {
                data: {
                    text: {
                        set: modifyText,
                    },
                },
            }
        );
        if (response.data.isSuccess) {
            getSmallTalkTestingsFun(smallTalksId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};