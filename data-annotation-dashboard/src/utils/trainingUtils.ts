import {
    setTrainings,
    setTrainingsCount,
    setTrainingsExports,
} from '@/redux/features/trainingsSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getTrainingsFun = async (smallTalksId: any, page: any) => {
    try {
        const response = await axiosInstance.get(
            `/smalltalkTraining/getSmalltalkTraining/${smallTalksId}/${page}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setTrainings(response.data.results.result));
            store.dispatch(setTrainingsCount(response.data.results.count));
            exportDataToExcel(smallTalksId);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createTraining = async (text: string, smallTalksId: any) => {
    try {
        const response = await axiosInstance.post(
            '/smalltalkTraining/createSmalltalkTraining',
            {
                smalltalkId: smallTalksId,
                text,
            }
        );
        if (response.data.isSuccess) {
            getTrainingsFun(smallTalksId, 0);
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
            '/smalltalkTraining/importXlsxFile',
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
        getTrainingsFun(smallTalksId, 0);
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};

export const exportDataToExcel = async (smallTalksId: any) => {
    try {
        const response = await axiosInstance.get(
            `/smalltalkTraining/exportXlsxFile/${smallTalksId}}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setTrainingsExports(response.data.results));
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
            `/smalltalkTraining/checkPermission/${smallTalksId}}`
        );
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
};

export const deleteTraining = async (
    trainingId: any,
    smallTalksId: any,
    page: any
) => {
    try {
        const response = await axiosInstance.delete(
            `/smalltalkTraining/deleteSmalltalkTraining/${smallTalksId}/${trainingId}`
        );
        if (response.data.isSuccess) {
            getTrainingsFun(smallTalksId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};

export const updateTraining = async (
    trainingId: any,
    smallTalksId: any,
    page: any,
    modifyText: any
) => {
    try {
        const response = await axiosInstance.put(
            `/smalltalkTraining/updateSmalltalkTraining/${smallTalksId}/${trainingId}`,
            {
                data: {
                    text: {
                        set: modifyText,
                    },
                },
            }
        );
        if (response.data.isSuccess) {
            getTrainingsFun(smallTalksId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};
