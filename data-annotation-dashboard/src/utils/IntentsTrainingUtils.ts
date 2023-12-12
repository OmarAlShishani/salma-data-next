import {
    setIntentsTrainings,
    setIntentsTrainingsCount,
    setIntentsTrainingsExports,
} from '@/redux/features/intentsTrainingSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getIntentsTrainingFun = async (intentsId: any, page: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsTraining/getIntentsTraining/${intentsId}/${page}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setIntentsTrainings(response.data.results.result));
            store.dispatch(
                setIntentsTrainingsCount(response.data.results.count)
            );
            exportDataToExcel(intentsId);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createsIntentsTraining = async (text: string, intentsId: any) => {
    try {
        const response = await axiosInstance.post(
            '/intentsTraining/createIntentsTraining',
            {
                intentsId: intentsId,
                text,
            }
        );
        if (response.data.isSuccess) {
            getIntentsTrainingFun(intentsId, 0);
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
            '/intentsTraining/importXlsxFile',
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
        getIntentsTrainingFun(intentsId, 0);
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};

export const exportDataToExcel = async (intentsId: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsTraining/exportXlsxFile/${intentsId}}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setIntentsTrainingsExports(response.data.results));
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
            `/intentsTraining/checkPermission/${intentsId}}`
        );
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
};

export const deleteIntentsTraining = async (
    trainingId: any,
    intentsId: any,
    page: any
) => {
    try {
        const response = await axiosInstance.delete(
            `/intentsTraining/deleteIntentsTraining/${intentsId}/${trainingId}`
        );
        if (response.data.isSuccess) {
            getIntentsTrainingFun(intentsId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};

export const updateIntentsTraining = async (
    trainingId: any,
    intentsId: any,
    page: any,
    modifyText: any
) => {
    try {
        const response = await axiosInstance.put(
            `/intentsTraining/updateIntentsTraining/${intentsId}/${trainingId}`,
            {
                data: {
                    text: {
                        set: modifyText,
                    },
                },
            }
        );
        if (response.data.isSuccess) {
            getIntentsTrainingFun(intentsId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};
